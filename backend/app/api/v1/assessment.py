import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_current_user_id
from app.schemas.assessment import (
    SubmitAssessmentRequest,
    AssessmentResultResponse,
    AssessmentHistoryItem,
    QuestionResponse,
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
        medical_history=payload.medical_history,
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

@router.get(
    "/assessment/history",
    response_model=list[AssessmentHistoryItem],
)
async def get_assessment_history(
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db),
    user_id: uuid.UUID = Depends(get_current_user_id),
):
    """
    Mengambil riwayat assessment user.
    Diurutkan dari assessment terbaru.
    """

    return await assessment_service.get_assessment_history(
        db=db,
        user_id=user_id,
        limit=limit,
        offset=offset,
    )


@router.delete(
    "/assessment/{response_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_assessment_response(
    response_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    user_id: uuid.UUID = Depends(get_current_user_id),
):
    await assessment_service.delete_assessment_response(
        db=db,
        user_id=user_id,
        response_id=response_id,
    )

    return Response(status_code=status.HTTP_204_NO_CONTENT)