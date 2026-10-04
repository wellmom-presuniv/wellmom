import json
import uuid
from datetime import date
from pathlib import Path

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.services import scoring_service

from scoring.bp_classifier import classify_blood_pressure
from scoring.duration_logic import (
    ORDER_INDEX_TO_SYMPTOM,
    SymptomTrackingRecord,
    evaluate_all_duration_symptoms,
    update_tracking_record,
)
from scoring.risk_combiner import combine_final_risk

from app.crud import assessment as assessment_crud
from app.services.pregnancy_service import calculate_gestational_week


BP_THRESHOLDS_PATH = Path(__file__).resolve().parents[2] / "scoring" / "bp_thresholds.json"


async def get_questions(db: AsyncSession) -> list:
    return await crud.assessment.get_active_questions(db)


def _load_bp_thresholds() -> list[dict]:
    with BP_THRESHOLDS_PATH.open("r", encoding="utf-8-sig") as file:
        data = json.load(file)

    if isinstance(data, list):
        return data

    if isinstance(data, dict):
        for key in ("thresholds", "bp_thresholds", "blood_pressure_thresholds"):
            if key in data:
                return data[key]

    raise RuntimeError("Format bp_thresholds.json tidak valid.")


def _resolve_bp_status(
    systolic_bp: int | None,
    diastolic_bp: int | None,
) -> tuple[str, str | None]:
    if systolic_bp is None and diastolic_bp is None:
        return "NOT_PROVIDED", None

    if systolic_bp is None or diastolic_bp is None:
        raise HTTPException(
            status_code=422,
            detail="Systolic dan diastolic BP harus diisi bersamaan.",
        )

    try:
        bp_category = classify_blood_pressure(
            systolic=systolic_bp,
            diastolic=diastolic_bp,
            thresholds=_load_bp_thresholds(),
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    bp_category_value = bp_category.value

    # bp_assessment_status is kept as a legacy/backward-compatible summary field.
    # It only tells whether BP was provided, normal, or non-normal.
    # Detailed BP severity must be read from bp_category:
    # NORMAL | ELEVATED | STAGE_1 | STAGE_2 | CRISIS
    #
    # BP is currently informational only and does not affect final risk_category.
    if bp_category_value == "NORMAL":
        return "NORMAL", bp_category_value

    return "FLAGGED", bp_category_value


def calculate_map(systolic_bp: int | None, diastolic_bp: int | None) -> float | None:
    """MAP = (sistolik + 2 x diastolik) / 3 (Buku KIA 2024). Informasional saja."""
    if systolic_bp is None or diastolic_bp is None:
        return None
    return round((systolic_bp + 2 * diastolic_bp) / 3, 1)


def _normalize_medical_history(medical_history: list[str] | None) -> list[str]:
    """Dedupe; 'NONE' eksklusif -- kalau ada pilihan lain, 'NONE' dibuang."""
    unique = list(dict.fromkeys(medical_history or []))
    if len(unique) > 1 and "NONE" in unique:
        unique = [item for item in unique if item != "NONE"]
    return unique


def _normalize_score_result(scoring: dict) -> dict:
    triggered_red_flags = scoring.get("triggered_red_flags") or []

    return {
        "risk_category": scoring["risk_category"],
        "red_flag_triggered": bool(triggered_red_flags),
        "triggered_red_flags": triggered_red_flags,
        "total_score": scoring["total_score"],
    }


async def _evaluate_duration_logic(
    db: AsyncSession,
    pregnancy_profile_id: uuid.UUID,
    questions: list,
    answers: list[dict],
    today: date,
) -> tuple[str, list[dict]]:
    answer_by_question_id = {
        answer["question_id"]: answer["answer"]
        for answer in answers
    }

    tracking_records = {}

    for question in questions:
        symptom_type = ORDER_INDEX_TO_SYMPTOM.get(question.order_index)
        if symptom_type is None:
            continue

        answered_yes = bool(answer_by_question_id.get(question.question_id, False))

        existing_row = await crud.assessment.get_active_symptom_tracking(
            db=db,
            pregnancy_profile_id=pregnancy_profile_id,
            symptom_type=symptom_type.value,
        )

        existing_record = None
        if existing_row:
            existing_record = SymptomTrackingRecord(
                symptom_type=symptom_type,
                onset_date=existing_row.onset_date,
                last_reported_date=existing_row.last_reported_date,
                resolved=existing_row.resolved,
            )

        updated_record = update_tracking_record(
            symptom_type=symptom_type,
            existing_record=existing_record,
            answered_yes=answered_yes,
            today=today,
        )

        await crud.assessment.save_symptom_tracking_record(
            db=db,
            pregnancy_profile_id=pregnancy_profile_id,
            symptom_type=symptom_type.value,
            existing_row=existing_row,
            updated_record=updated_record,
        )

        if updated_record is not None:
            tracking_records[symptom_type] = updated_record

    duration_category, duration_triggered_symptoms = evaluate_all_duration_symptoms(
        tracking_records
    )

    return duration_category.value, duration_triggered_symptoms


async def submit_assessment(
    db: AsyncSession,
    user_id: uuid.UUID,
    answers: list[dict],
    systolic_bp: int | None,
    diastolic_bp: int | None,
    medical_history: list[str] | None = None,
) -> dict:
    medical_history = _normalize_medical_history(medical_history)

    # 1. Profil aktif wajib ada
    profile = await crud.pregnancy.get_active_profile(db, user_id)
    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profil kehamilan belum dibuat. Selesaikan onboarding terlebih dahulu.",
        )

    # 2. Cegah duplikat hari ini
    today = date.today()
    existing = await crud.assessment.get_today_response(db, user_id, today)
    if existing:
        raise HTTPException(
            status_code=409,
            detail="Assessment hari ini sudah diisi. Satu submission per hari.",
        )

    # 3. Validasi semua pertanyaan aktif terjawab
    questions = await crud.assessment.get_active_questions(db)
    active_ids = {q.question_id for q in questions}
    submitted_ids = {a["question_id"] for a in answers}
    missing = active_ids - submitted_ids
    if missing:
        raise HTTPException(
            status_code=422,
            detail=f"{len(missing)} pertanyaan aktif belum dijawab.",
        )

    # 4. Scoring lama: score + red flag
    thresholds = await crud.assessment.get_risk_thresholds(db)
    scoring = scoring_service.compute_risk(answers, questions, thresholds)
    score_result = _normalize_score_result(scoring)

    # 5. Duration logic Arizal: Q2, Q4, Q8 by order_index
    duration_category, duration_triggered_symptoms = await _evaluate_duration_logic(
        db=db,
        pregnancy_profile_id=profile.profile_id,
        questions=questions,
        answers=answers,
        today=today,
    )

    # 6. BP classifier Arizal: informasional saja
    bp_status, bp_category = _resolve_bp_status(
        systolic_bp=systolic_bp,
        diastolic_bp=diastolic_bp,
    )

    # 7. Combine final risk
    final_result = combine_final_risk(
        score_result=score_result,
        duration_category=duration_category,
        duration_triggered_symptoms=duration_triggered_symptoms,
        bp_category=bp_category,
    )

    # 8. Simpan response
    response = await crud.assessment.create_response(
        db=db,
        user_id=user_id,
        pregnancy_profile_id=profile.profile_id,
        systolic_bp=systolic_bp,
        diastolic_bp=diastolic_bp,
        medical_history=medical_history,
    )

    # 9. Simpan jawaban per-pertanyaan
    await crud.assessment.bulk_create_response_items(
        db=db,
        response_id=response.response_id,
        answers=answers,
    )

    # 10. Simpan hasil final
    await crud.assessment.create_result(
        db=db,
        response_id=response.response_id,
        total_score=final_result.total_score,
        risk_level=final_result.risk_category.value,
        triggered_red_flags=final_result.triggered_red_flags,
        duration_triggered_symptoms=final_result.duration_triggered_symptoms,
        bp_assessment_status=bp_status,
        bp_category=final_result.bp_category,
    )

    await db.commit()

    return {
        "response_id": response.response_id,
        "date": today.isoformat(),
        "risk_category": final_result.risk_category.value,
        "red_flag_triggered": final_result.red_flag_triggered,
        "triggered_red_flags": final_result.triggered_red_flags,
        "duration_triggered_symptoms": final_result.duration_triggered_symptoms,
        "total_score": final_result.total_score,
        "bp_assessment_status": bp_status,
        "bp_category": final_result.bp_category,
        "map_mmhg": calculate_map(systolic_bp, diastolic_bp),
        "medical_history": medical_history,
    }


async def get_today_result(db: AsyncSession, user_id: uuid.UUID) -> dict | None:
    today = date.today()
    result = await crud.assessment.get_today_result(db, user_id, today)
    if not result:
        return None

    triggered = result.triggered_red_flags or []
    duration_triggered = result.duration_triggered_symptoms or []
    response = await crud.assessment.get_today_response(db, user_id, today)

    return {
        "response_id": result.response_id,
        "date": today.isoformat(),
        "risk_category": result.risk_level,
        "red_flag_triggered": bool(triggered),
        "triggered_red_flags": triggered,
        "duration_triggered_symptoms": duration_triggered,
        "total_score": result.total_score,
        "bp_assessment_status": result.bp_assessment_status,
        "bp_category": result.bp_category,
        "map_mmhg": calculate_map(
            response.systolic_bp if response else None,
            response.diastolic_bp if response else None,
        ),
        "medical_history": (response.medical_history if response else None) or [],
    }


async def get_assessment_history(
    db: AsyncSession,
    user_id: uuid.UUID,
    limit: int = 20,
    offset: int = 0,
) -> list[dict]:
    rows = await crud.assessment.get_assessment_history(
        db=db,
        user_id=user_id,
        limit=limit,
        offset=offset,
    )

    history = []

    for result, assessment_date in rows:
        triggered = result.triggered_red_flags or []
        duration_triggered = result.duration_triggered_symptoms or []

        history.append(
            {
                "response_id": result.response_id,
                "date": assessment_date.date().isoformat(),
                "risk_category": result.risk_level,
                "red_flag_triggered": bool(triggered),
                "triggered_red_flags": triggered,
                "duration_triggered_symptoms": duration_triggered,
                "total_score": result.total_score,
                "bp_assessment_status": result.bp_assessment_status,
                "bp_category": result.bp_category,
            }
        )

    return history


async def list_high_risk_assessment_alerts(
    db: AsyncSession,
    limit: int = 20,
    offset: int = 0,
) -> list[dict]:
    rows = await assessment_crud.get_high_risk_assessment_alerts(
        db=db,
        limit=limit,
        offset=offset,
    )

    alerts = []
    for response, result, user, profile in rows:
        triggered_red_flags = (
            result.triggered_red_flags
            if isinstance(result.triggered_red_flags, list)
            else []
        )
        gestational_week = None
        if profile.hpht is not None:
            reference_date = (
                response.assessment_date.date()
                if response.assessment_date is not None
                else date.today()
            )
            gestational_week = calculate_gestational_week(
                profile.hpht,
                reference_date,
            )

        alerts.append(
            {
                "response_id": response.response_id,
                "result_id": result.result_id,
                "user_id": user.id,
                "full_name": user.full_name,
                "email": user.email,
                "pregnancy_profile_id": profile.profile_id,
                "hpht": profile.hpht,
                "hpl": profile.hpl,
                "gestational_week": gestational_week,
                "risk_category": result.risk_level,
                "total_score": result.total_score,
                "red_flag_triggered": bool(triggered_red_flags),
                "triggered_red_flags": triggered_red_flags,
                "assessment_date": response.assessment_date,
            }
        )

    return alerts


async def delete_assessment_response(
    db: AsyncSession,
    user_id: uuid.UUID,
    response_id: uuid.UUID,
) -> None:
    deleted = await assessment_crud.delete_response_by_id_and_user(
        db=db,
        response_id=response_id,
        user_id=user_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Assessment response tidak ditemukan",
        )

    await db.commit()
