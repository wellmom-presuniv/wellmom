import uuid
from datetime import date
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_current_user_id
from app.schemas.checklist import (
    TodayChecklistResponse,
    ToggleResponse,
    ChecklistHistoryDay,
)
from app.services import checklist_service

router = APIRouter()


@router.get("/checklist/today", response_model=TodayChecklistResponse)
async def get_today_checklist(
    db: AsyncSession = Depends(get_db),
    user_id: uuid.UUID = Depends(get_current_user_id),
):
    """
    Dipanggil setiap kali halaman checklist dibuka.
    Semua item aktif dikembalikan beserta status hari ini.
    Item yang belum di-toggle otomatis is_completed=False.
    """
    return await checklist_service.get_today_checklist(db, user_id)


@router.get("/checklist/history", response_model=list[ChecklistHistoryDay])
async def get_checklist_history(
    limit: int = Query(default=30, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db),
    user_id: uuid.UUID = Depends(get_current_user_id),
):
    """
    Mengambil riwayat checklist per hari.
    Default mengambil 30 tanggal terakhir yang memiliki log checklist.
    """
    return await checklist_service.get_checklist_history(
        db=db,
        user_id=user_id,
        limit=limit,
        offset=offset,
    )

@router.post("/checklist/{item_id}/log", response_model=ToggleResponse)
async def toggle_checklist_item(
    item_id: uuid.UUID,
    log_date: date | None = Query(default=None, alias="date"),
    db: AsyncSession = Depends(get_db),
    user_id: uuid.UUID = Depends(get_current_user_id),
):
    """
    Toggle satu item checklist pada tanggal tertentu.

    Jika query param date tidak dikirim, otomatis memakai tanggal hari ini.
    Contoh:
    POST /checklist/{item_id}/log?date=2026-07-22
    """
    return await checklist_service.toggle_item(
        db=db,
        user_id=user_id,
        item_id=item_id,
        target_date=log_date,
    )