import uuid
from datetime import date
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.monitoring import MonitoringRecord


async def create_record(
    db: AsyncSession,
    *,
    user_id: uuid.UUID,
    record_type: str,
    check_date: date,
    pregnancy_profile_id: uuid.UUID | None = None,
    **values: Any,
) -> MonitoringRecord:
    record = MonitoringRecord(
        user_id=user_id,
        pregnancy_profile_id=pregnancy_profile_id,
        record_type=record_type,
        check_date=check_date,
        **values,
    )

    db.add(record)
    await db.flush()
    return record


async def get_history(
    db: AsyncSession,
    *,
    user_id: uuid.UUID,
    record_type: str,
    limit: int = 30,
    offset: int = 0,
) -> list[MonitoringRecord]:
    result = await db.execute(
        select(MonitoringRecord)
        .where(
            MonitoringRecord.user_id == user_id,
            MonitoringRecord.record_type == record_type,
        )
        .order_by(
            MonitoringRecord.check_date.desc(),
            MonitoringRecord.created_at.desc(),
        )
        .offset(offset)
        .limit(limit)
    )

    return list(result.scalars().all())