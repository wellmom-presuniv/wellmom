import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_current_user_id
from app.schemas.checklist import TodayChecklistResponse, ToggleResponse
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


@router.post("/checklist/{item_id}/log", response_model=ToggleResponse)
async def toggle_checklist_item(
    item_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    user_id: uuid.UUID = Depends(get_current_user_id),
):
    """
    Toggle satu item hari ini. Tidak butuh request body.
    Belum ada log → buat baru (is_completed=True).
    Sudah ada → balik nilai (True↔False).
    """
    return await checklist_service.toggle_item(db, user_id, item_id)