import uuid
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from app.models.pregnancy import PregnancyProfile


async def get_active_profile(
    db: AsyncSession, user_id: uuid.UUID
) -> PregnancyProfile | None:
    result = await db.execute(
        select(PregnancyProfile).where(
            PregnancyProfile.user_id == user_id,
            PregnancyProfile.is_active == True,
        )
    )
    return result.scalar_one_or_none()


async def create_profile(
    db: AsyncSession,
    user_id: uuid.UUID,
    hpht: date,
    hpl: date,
) -> PregnancyProfile:
    profile = PregnancyProfile(
        user_id=user_id,
        hpht=hpht,
        hpl=hpl,
        is_active=True,
    )
    db.add(profile)
    await db.flush()
    return profile


async def update_active_profile_hpht(
    db: AsyncSession,
    user_id: uuid.UUID,
    hpht: date,
    hpl: date,
) -> PregnancyProfile | None:
    profile = await get_active_profile(db, user_id)
    if not profile:
        return None

    profile.hpht = hpht
    profile.hpl = hpl

    db.add(profile)
    await db.flush()
    return profile


async def deactivate_all_profiles(
    db: AsyncSession, user_id: uuid.UUID
) -> None:
    """Dipakai kalau user input kehamilan baru — non-aktifkan semua yang lama."""
    await db.execute(
        update(PregnancyProfile)
        .where(PregnancyProfile.user_id == user_id)
        .values(is_active=False)
    )

async def update_profile(
    db: AsyncSession,
    profile: PregnancyProfile,
    hpht: date,
    hpl: date,
) -> PregnancyProfile:
    profile.hpht = hpht
    profile.hpl = hpl
    await db.flush()
    return profile