import uuid
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.checklist import ChecklistItem, ChecklistLog


async def get_active_items(db: AsyncSession) -> list[ChecklistItem]:
    result = await db.execute(
        select(ChecklistItem)
        .where(ChecklistItem.is_active == True)
        .order_by(ChecklistItem.order_index)
    )
    return result.scalars().all()


async def get_item_by_id(
    db: AsyncSession, item_id: uuid.UUID
) -> ChecklistItem | None:
    result = await db.execute(
        select(ChecklistItem).where(ChecklistItem.item_id == item_id)
    )
    return result.scalar_one_or_none()


async def get_today_logs(
    db: AsyncSession, user_id: uuid.UUID, today: date
) -> list[ChecklistLog]:
    result = await db.execute(
        select(ChecklistLog).where(
            ChecklistLog.user_id == user_id,
            ChecklistLog.log_date == today,
        )
    )
    return result.scalars().all()


async def get_log(
    db: AsyncSession,
    user_id: uuid.UUID,
    item_id: uuid.UUID,
    today: date,
) -> ChecklistLog | None:
    result = await db.execute(
        select(ChecklistLog).where(
            ChecklistLog.user_id == user_id,
            ChecklistLog.item_id == item_id,
            ChecklistLog.log_date == today,
        )
    )
    return result.scalar_one_or_none()


async def toggle_log(
    db: AsyncSession,
    user_id: uuid.UUID,
    pregnancy_profile_id: uuid.UUID,
    item_id: uuid.UUID,
    today: date,
) -> ChecklistLog:
    existing = await get_log(db, user_id, item_id, today)
    if existing:
        existing.is_completed = not existing.is_completed
        db.add(existing)
        await db.flush()
        return existing

    new_log = ChecklistLog(
        user_id=user_id,
        pregnancy_profile_id=pregnancy_profile_id,
        item_id=item_id,
        log_date=today,
        is_completed=True,
    )
    db.add(new_log)
    await db.flush()
    return new_log