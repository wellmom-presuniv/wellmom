import uuid
from datetime import date
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud


async def get_today_checklist(
    db: AsyncSession, user_id: uuid.UUID
) -> dict:
    today = date.today()
    items = await crud.checklist.get_active_items(db)
    logs  = await crud.checklist.get_today_logs(db, user_id, today)

    # O(n) lookup — hindari nested loop
    log_map = {log.item_id: log for log in logs}

    result_items = []
    for item in items:
        log = log_map.get(item.item_id)
        result_items.append({
            "item_id":      item.item_id,
            "label":        item.label,
            "category":     item.category,
            "order_index":  item.order_index,
            "is_completed": log.is_completed if log else False,
            "log_id":       log.log_id if log else None,
        })

    total     = len(result_items)
    completed = sum(1 for i in result_items if i["is_completed"])

    return {
        "date":  today.isoformat(),
        "items": result_items,
        "summary": {
            "total":     total,
            "completed": completed,
            "label":     f"{completed}/{total} selesai",
        },
    }


async def toggle_item(
    db: AsyncSession,
    user_id: uuid.UUID,
    item_id: uuid.UUID,
) -> dict:
    # Validasi item ada dan aktif
    item = await crud.checklist.get_item_by_id(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item checklist tidak ditemukan")
    if not item.is_active:
        raise HTTPException(status_code=422, detail="Item ini sudah tidak aktif")

    # Profil kehamilan aktif wajib ada
    profile = await crud.pregnancy.get_active_profile(db, user_id)
    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profil kehamilan belum dibuat. Selesaikan onboarding terlebih dahulu."
        )

    today = date.today()
    log   = await crud.checklist.toggle_log(
        db=db,
        user_id=user_id,
        pregnancy_profile_id=profile.profile_id,
        item_id=item_id,
        today=today,
    )

    return {
        "item_id":      item_id,
        "label":        item.label,
        "is_completed": log.is_completed,
        "log_id":       log.log_id,
        "date":         today.isoformat(),
    }