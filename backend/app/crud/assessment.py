import uuid
from datetime import date, datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import case, func, or_, select

from app.models.assessment import (
    AssessmentQuestion, AssessmentResponse,
    AssessmentResponseItem, AssessmentResult,
    SymptomOnsetTracking,
)
from app.models.pregnancy import PregnancyProfile
from app.models.risk_threshold import RiskThreshold
from app.models.user import User
from typing import Any

async def get_active_questions(db: AsyncSession) -> list[AssessmentQuestion]:
    result = await db.execute(
        select(AssessmentQuestion)
        .where(AssessmentQuestion.is_active == True)
        .order_by(AssessmentQuestion.order_index)
    )
    return result.scalars().all()


async def get_risk_thresholds(db: AsyncSession) -> list[RiskThreshold]:
    result = await db.execute(
        select(RiskThreshold).where(RiskThreshold.is_active == True)
    )
    return result.scalars().all()


async def get_today_response(
    db: AsyncSession,
    user_id: uuid.UUID,
    today: date,
) -> AssessmentResponse | None:
    query = select(AssessmentResponse).where(
        AssessmentResponse.user_id == user_id,
        func.date(AssessmentResponse.assessment_date) == today
    )
    result = await db.execute(query)
    return result.scalars().first()


async def get_today_result(
    db: AsyncSession, user_id: uuid.UUID, today: date
) -> AssessmentResult | None:
    """Join ke response untuk filter by user dan tanggal."""
    result = await db.execute(
        select(AssessmentResult)
        .join(AssessmentResponse,
              AssessmentResult.response_id == AssessmentResponse.response_id)
        .where(
            AssessmentResponse.user_id == user_id,
            func.date(AssessmentResponse.assessment_date) == today,
        )
    )
    return result.scalar_one_or_none()


async def create_response(
    db: AsyncSession,
    user_id: uuid.UUID,
    pregnancy_profile_id: uuid.UUID,
    systolic_bp: int | None,
    diastolic_bp: int | None,
    medical_history: list[str] | None = None,
) -> AssessmentResponse:
    response = AssessmentResponse(
        user_id=user_id,
        pregnancy_profile_id=pregnancy_profile_id,
        assessment_date=datetime.now(timezone.utc),
        systolic_bp=systolic_bp,
        diastolic_bp=diastolic_bp,
        medical_history=medical_history or [],
    )
    db.add(response)
    await db.flush()
    return response


async def bulk_create_response_items(
    db: AsyncSession,
    response_id: uuid.UUID,
    answers: list[dict],
) -> None:
    """answers: list of {"question_id": UUID, "answer": bool}"""
    items = [
        AssessmentResponseItem(
            response_id=response_id,
            question_id=a["question_id"],
            answer=a["answer"],
        )
        for a in answers
    ]
    db.add_all(items)
    await db.flush()


async def create_result(
    db: AsyncSession,
    response_id: uuid.UUID,
    total_score: int | None,
    risk_level: str,
    triggered_red_flags: list,
    bp_assessment_status: str,
    duration_triggered_symptoms: list | None = None,
    bp_category: str | None = None,
) -> AssessmentResult:
    result = AssessmentResult(
        response_id=response_id,
        total_score=total_score,
        risk_level=risk_level,
        triggered_red_flags=triggered_red_flags,
        duration_triggered_symptoms=duration_triggered_symptoms,
        bp_assessment_status=bp_assessment_status,
        bp_category=bp_category,
    )
    db.add(result)
    await db.flush()
    return result


async def get_active_symptom_tracking(
    db: AsyncSession,
    pregnancy_profile_id: uuid.UUID,
    symptom_type: str,
) -> SymptomOnsetTracking | None:
    result = await db.execute(
        select(SymptomOnsetTracking)
        .where(
            SymptomOnsetTracking.pregnancy_profile_id == pregnancy_profile_id,
            SymptomOnsetTracking.symptom_type == symptom_type,
            SymptomOnsetTracking.resolved == False,
        )
        .order_by(SymptomOnsetTracking.last_reported_date.desc())
    )
    return result.scalars().first()


async def save_symptom_tracking_record(
    db: AsyncSession,
    pregnancy_profile_id: uuid.UUID,
    symptom_type: str,
    existing_row: SymptomOnsetTracking | None,
    updated_record: Any | None,
) -> SymptomOnsetTracking | None:
    if updated_record is None:
        return None

    if existing_row and updated_record.resolved:
        existing_row.resolved = True
        await db.flush()
        return existing_row

    if existing_row is None:
        row = SymptomOnsetTracking(
            pregnancy_profile_id=pregnancy_profile_id,
            symptom_type=symptom_type,
            onset_date=updated_record.onset_date,
            last_reported_date=updated_record.last_reported_date,
            resolved=updated_record.resolved,
        )
        db.add(row)
        await db.flush()
        return row

    # Kalau onset berubah, berarti logic duration mendeteksi gap day.
    # Record lama di-resolve, lalu buat record baru.
    if updated_record.onset_date != existing_row.onset_date:
        existing_row.resolved = True

        row = SymptomOnsetTracking(
            pregnancy_profile_id=pregnancy_profile_id,
            symptom_type=symptom_type,
            onset_date=updated_record.onset_date,
            last_reported_date=updated_record.last_reported_date,
            resolved=updated_record.resolved,
        )
        db.add(row)
        await db.flush()
        return row

    existing_row.last_reported_date = updated_record.last_reported_date
    existing_row.resolved = updated_record.resolved
    await db.flush()
    return existing_row


async def get_assessment_history(
    db: AsyncSession,
    user_id: uuid.UUID,
    limit: int = 20,
    offset: int = 0,
) -> list[tuple[AssessmentResult, datetime]]:
    """
    Mengambil riwayat asesmen (AssessmentResult + Tanggal)
    diurutkan dari yang paling baru untuk kebutuhan frontend.
    """
    result = await db.execute(
        select(AssessmentResult, AssessmentResponse.assessment_date)
        .join(
            AssessmentResponse,
            AssessmentResult.response_id == AssessmentResponse.response_id,
        )
        .where(AssessmentResponse.user_id == user_id)
        .order_by(AssessmentResponse.assessment_date.desc())
        .offset(offset)
        .limit(limit)
    )
    return result.all()


async def get_high_risk_assessment_alerts(
    db: AsyncSession,
    limit: int = 20,
    offset: int = 0,
) -> list[tuple[AssessmentResponse, AssessmentResult, User, PregnancyProfile]]:
    """
    Return assessment alerts in one query, including patient and pregnancy data.

    Red flags are stored as a JSONB array. The CASE expression guards
    jsonb_array_length so nullable, empty, or non-array JSON values are safe.
    """
    red_flag_count = case(
        (
            func.jsonb_typeof(AssessmentResult.triggered_red_flags) == "array",
            func.jsonb_array_length(AssessmentResult.triggered_red_flags),
        ),
        else_=0,
    )

    result = await db.execute(
        select(
            AssessmentResponse,
            AssessmentResult,
            User,
            PregnancyProfile,
        )
        .select_from(AssessmentResponse)
        .join(
            AssessmentResult,
            AssessmentResult.response_id == AssessmentResponse.response_id,
        )
        .join(User, User.id == AssessmentResponse.user_id)
        .join(
            PregnancyProfile,
            PregnancyProfile.profile_id
            == AssessmentResponse.pregnancy_profile_id,
        )
        .where(
            or_(
                AssessmentResult.risk_level == "HIGH",
                red_flag_count > 0,
            )
        )
        .order_by(
            AssessmentResponse.assessment_date.desc(),
            AssessmentResult.created_at.desc(),
        )
        .offset(offset)
        .limit(limit)
    )
    return result.all()


async def delete_response_by_id_and_user(
    db: AsyncSession,
    *,
    response_id: uuid.UUID,
    user_id: uuid.UUID,
) -> bool:
    result = await db.execute(
        select(AssessmentResponse).where(
            AssessmentResponse.response_id == response_id,
            AssessmentResponse.user_id == user_id,
        )
    )
    response = result.scalar_one_or_none()

    if response is None:
        return False

    await db.delete(response)
    await db.flush()

    return True
