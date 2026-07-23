from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_current_user_id
from app.schemas.pregnancy import CreateProfileRequest, ProfileResponse
from app.services import pregnancy_service
import uuid

router = APIRouter()


@router.post("/profile", response_model=ProfileResponse, status_code=201)
async def create_profile(
    payload: CreateProfileRequest,
    db: AsyncSession = Depends(get_db),
    user_id: uuid.UUID = Depends(get_current_user_id),
):
    """
    Dipanggil sekali saat onboarding.
    Input: hpht (tanggal HPHT dalam format YYYY-MM-DD)
    Output: profil lengkap + trimester + minggu + 9progress
    """
    return await pregnancy_service.create_pregnancy_profile(
        db=db, user_id=user_id, hpht=payload.hpht
    )


@router.get("/profile/me", response_model=ProfileResponse)
async def get_my_profile(
    db: AsyncSession = Depends(get_db),
    user_id: uuid.UUID = Depends(get_current_user_id),
):
    """
    Dipanggil setiap kali dashboard dibuka.
    Trimester, minggu, dan progress dihitung otomatis dari hpht.
    """
    return await pregnancy_service.get_my_profile(db=db, user_id=user_id)

from app.schemas.pregnancy import CreateProfileRequest, ProfileResponse, UpdateProfileRequest

@router.patch("/profile", response_model=ProfileResponse)
async def update_profile(
    payload: UpdateProfileRequest,
    db: AsyncSession = Depends(get_db),
    user_id: uuid.UUID = Depends(get_current_user_id),
):
    """
    Update HPHT profil kehamilan yang sudah ada.
    Backend otomatis hitung ulang HPL, trimester, minggu, dan progress.
    """
    return await pregnancy_service.update_pregnancy_profile(
        db=db, user_id=user_id, hpht=payload.hpht
    )