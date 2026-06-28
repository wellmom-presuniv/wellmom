import uuid
from datetime import date
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.services import scoring_service


async def get_questions(db: AsyncSession) -> list:
    return await crud.assessment.get_active_questions(db)


async def submit_assessment(
    db: AsyncSession,
    user_id: uuid.UUID,
    answers: list[dict],
    systolic_bp: int | None,
    diastolic_bp: int | None,
) -> dict:
    # 1. Profil aktif wajib ada
    profile = await crud.pregnancy.get_active_profile(db, user_id)
    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profil kehamilan belum dibuat. Selesaikan onboarding terlebih dahulu."
        )

    # 2. Cegah duplikat hari ini
    today = date.today()
    existing = await crud.assessment.get_today_response(db, user_id, today)
    if existing:
        raise HTTPException(
            status_code=409,
            detail="Assessment hari ini sudah diisi. Satu submission per hari."
        )

    # 3. Validasi semua pertanyaan aktif terjawab
    questions = await crud.assessment.get_active_questions(db)
    active_ids = {q.question_id for q in questions}
    submitted_ids = {a["question_id"] for a in answers}
    missing = active_ids - submitted_ids
    if missing:
        raise HTTPException(
            status_code=422,
            detail=f"{len(missing)} pertanyaan aktif belum dijawab."
        )

    # 4. Simpan response
    response = await crud.assessment.create_response(
        db=db,
        user_id=user_id,
        pregnancy_profile_id=profile.profile_id,
        submitted_date=today,
        systolic_bp=systolic_bp,
        diastolic_bp=diastolic_bp,
    )

    # 5. Simpan jawaban per-pertanyaan
    await crud.assessment.bulk_create_response_items(
        db=db, response_id=response.response_id, answers=answers
    )

    # 6. Scoring
    thresholds = await crud.assessment.get_risk_thresholds(db)
    scoring = scoring_service.compute_risk(answers, questions, thresholds)

    # 7. BP status
    if systolic_bp is None and diastolic_bp is None:
        bp_status = "NOT_PROVIDED"
    else:
        bp_status = "PENDING_THRESHOLD"

    # 8. Simpan hasil — mapping eksplisit, tidak pakai **scoring
    await crud.assessment.create_result(
        db=db,
        response_id=response.response_id,
        total_score=scoring["total_score"],
        risk_level=scoring["risk_category"],
        triggered_red_flags=scoring["triggered_red_flags"],
        bp_assessment_status=bp_status,
    )

    return {
        "response_id": response.response_id,
        "date": today.isoformat(),
        "risk_category": scoring["risk_category"],
        "red_flag_triggered": bool(scoring["triggered_red_flags"]),  # derive dari list
        "triggered_red_flags": scoring["triggered_red_flags"],
        "total_score": scoring["total_score"],
        "bp_assessment_status": bp_status,
    }


async def get_today_result(db: AsyncSession, user_id: uuid.UUID) -> dict | None:
    today = date.today()
    result = await crud.assessment.get_today_result(db, user_id, today)
    if not result:
        return None

    triggered = result.triggered_red_flags or []
    return {
        "response_id": result.response_id,
        "date": today.isoformat(),
        "risk_category": result.risk_level,
        "red_flag_triggered": bool(triggered),      # derive dari JSONB
        "triggered_red_flags": triggered,
        "total_score": result.total_score,
        "bp_assessment_status": result.bp_assessment_status,
    }