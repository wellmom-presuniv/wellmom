import uuid
from datetime import date, timedelta
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud


def calculate_gestational_week(hpht: date, reference_date: date) -> int:
    days_pregnant = (reference_date - hpht).days
    return max(days_pregnant // 7, 0)


def _compute_stats(hpht: date, hpl: date, today: date) -> dict:
    gestational_week = calculate_gestational_week(hpht, today)

    if gestational_week <= 12:
        trimester = 1
    elif gestational_week <= 27:
        trimester = 2
    else:
        trimester = 3

    progress_pct = round(min(gestational_week / 40 * 100, 100.0), 1)

    return {
        "gestational_week": gestational_week,
        "trimester": trimester,
        "progress_pct": progress_pct,
    }


async def create_pregnancy_profile(
    db: AsyncSession,
    user_id: uuid.UUID,
    hpht: date,
) -> dict:
    today = date.today()

    if hpht > today:
        raise HTTPException(
            status_code=422,
            detail="HPHT tidak boleh di masa depan"
        )

    existing = await crud.pregnancy.get_active_profile(db, user_id)
    if existing:
        raise HTTPException(
            status_code=409,
            detail="Sudah ada profil kehamilan aktif. "
                   "Hubungi admin untuk membuat kehamilan baru."
        )

    hpl = hpht + timedelta(days=280)
    profile = await crud.pregnancy.create_profile(
        db=db, user_id=user_id, hpht=hpht, hpl=hpl
    )

    stats = _compute_stats(hpht, hpl, today)
    return {
        "profile_id": profile.profile_id,
        "hpht": profile.hpht,
        "hpl": profile.hpl,
        "is_active": profile.is_active,
        **stats,
    }


async def get_my_profile(
    db: AsyncSession,
    user_id: uuid.UUID,
) -> dict:
    profile = await crud.pregnancy.get_active_profile(db, user_id)
    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profil kehamilan belum dibuat. "
                   "Selesaikan onboarding terlebih dahulu."
        )

    stats = _compute_stats(profile.hpht, profile.hpl, date.today())
    return {
        "profile_id": profile.profile_id,
        "hpht": profile.hpht,
        "hpl": profile.hpl,
        "is_active": profile.is_active,
        **stats,
    }


async def update_pregnancy_profile(
    db: AsyncSession,
    user_id: uuid.UUID,
    hpht: date,
) -> dict:
    today = date.today()

    if hpht > today:
        raise HTTPException(
            status_code=422,
            detail="HPHT tidak boleh di masa depan"
        )

    existing = await crud.pregnancy.get_active_profile(db, user_id)
    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Profil kehamilan belum dibuat. Selesaikan onboarding terlebih dahulu."
        )

    hpl = hpht + timedelta(days=280)
    profile = await crud.pregnancy.update_active_profile_hpht(
        db=db,
        user_id=user_id,
        hpht=hpht,
        hpl=hpl,
    )

    stats = _compute_stats(profile.hpht, profile.hpl, today)
    return {
        "profile_id": profile.profile_id,
        "hpht": profile.hpht,
        "hpl": profile.hpl,
        "is_active": profile.is_active,
        **stats,
    }
