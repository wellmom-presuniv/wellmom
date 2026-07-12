from datetime import date

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.content import get_published_content
from app.models.pregnancy import PregnancyProfile
from app.services.pregnancy_service import _compute_stats


async def get_education_content_for_user(
    db: AsyncSession,
    user_id,
):
    profile_result = await db.execute(
        select(PregnancyProfile).where(
            PregnancyProfile.user_id == user_id,
            PregnancyProfile.is_active == True,
        )
    )

    profile = profile_result.scalar_one_or_none()

    if profile is None:
        raise HTTPException(
            status_code=404,
            detail="Profil kehamilan tidak ditemukan.",
        )

    stats = _compute_stats(
        hpht=profile.hpht,
        hpl=profile.hpl,
        today=date.today(),
    )

    return await get_published_content(
        db=db,
        trimester=stats["trimester"],
    )