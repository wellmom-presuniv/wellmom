import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_current_user_id
from app.crud import referral as referral_crud
from app.schemas.referral import ReferralResponse

router = APIRouter()


@router.get("/referral/{risk_level}", response_model=ReferralResponse)
async def get_referral(
    risk_level: str,
    db: AsyncSession = Depends(get_db),
    _: uuid.UUID = Depends(get_current_user_id),
):
    mapping = await referral_crud.get_referral_by_risk(db, risk_level)

    if not mapping:
        raise HTTPException(
            status_code=404,
            detail=f"Referral mapping '{risk_level.upper()}' tidak ditemukan."
        )

    return mapping