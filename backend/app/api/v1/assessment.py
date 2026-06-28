import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_current_user_id
from app.schemas.assessment import (
    SubmitAssessmentRequest, AssessmentResultResponse, QuestionResponse
)
from app.services import assessment_service

router = APIRouter()


@router.get("/assessment/questions", response_model=list[QuestionResponse])
async def get_questions(
    db: AsyncSession = Depends(get_db),
    user_id: uuid.UUID = Depends(get_current_user_id),
):
    """
    Dipanggil saat form self-assessment dibuka.
    Arka render pertanyaan dari list ini — urutan sudah benar (order_index ASC).
    """
    return await assessment_service.get_questions(db)


@router.post("/assessment/submit",
             response_model=AssessmentResultResponse, status_code=201)
async def submit_assessment(
    payload: SubmitAssessmentRequest,
    db: AsyncSession = Depends(get_db),
    user_id: uuid.UUID = Depends(get_current_user_id),
):
    """
    Kirim jawaban harian + opsional tensi darah.
    Backend resolve pregnancy_profile_id otomatis dari token.
    Satu submission per hari — duplicate akan dapat 409.
    """
    answers = [
        {"question_id": a.question_id, "answer": a.answer}
        for a in payload.answers
    ]
    return await assessment_service.submit_assessment(
        db=db,
        user_id=user_id,
        answers=answers,
        systolic_bp=payload.systolic_bp,
        diastolic_bp=payload.diastolic_bp,
    )


@router.get("/assessment/today",
            response_model=Optional[AssessmentResultResponse])
async def get_today_result(
    db: AsyncSession = Depends(get_db),
    user_id: uuid.UUID = Depends(get_current_user_id),
):
    """
    Cek apakah user sudah submit hari ini.
    Returns result kalau sudah, null kalau belum.
    Arka pakai ini untuk decide: tampilkan form atau tampilkan hasil.
    """
    result = await assessment_service.get_today_result(db, user_id)
    return result