import uuid
from datetime import date, datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.models.assessment import (
    AssessmentQuestion, AssessmentResponse,
    AssessmentResponseItem, AssessmentResult,
)
from app.models.risk_threshold import RiskThreshold


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
) -> AssessmentResponse:
    response = AssessmentResponse(
        user_id=user_id,
        pregnancy_profile_id=pregnancy_profile_id,
        assessment_date=datetime.now(timezone.utc),
        systolic_bp=systolic_bp,
        diastolic_bp=diastolic_bp,
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
) -> AssessmentResult:
    result = AssessmentResult(
        response_id=response_id,
        total_score=total_score,
        risk_level=risk_level,
        triggered_red_flags=triggered_red_flags,
        bp_assessment_status=bp_assessment_status,
    )
    db.add(result)
    await db.flush()
    return result


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