import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.referral import ReferralMapping


async def get_all_referrals(db: AsyncSession) -> list[ReferralMapping]:
    result = await db.execute(
        select(ReferralMapping)
        .where(ReferralMapping.is_active == True)
        .order_by(ReferralMapping.risk_level)
    )
    return result.scalars().all()


async def get_referral_by_risk(
    db: AsyncSession, risk_level: str
) -> ReferralMapping | None:
    result = await db.execute(
        select(ReferralMapping).where(
            ReferralMapping.risk_level == risk_level.upper(),
            ReferralMapping.is_active == True,
        )
    )
    return result.scalar_one_or_none()


async def upsert_referral(
    db: AsyncSession,
    risk_level: str,
    facility_type: str,
    recommendation: str,
    urgency_label: str,
) -> ReferralMapping:
    existing = await get_referral_by_risk(db, risk_level)
    if existing:
        existing.facility_type  = facility_type
        existing.recommendation = recommendation
        existing.urgency_label  = urgency_label
        db.add(existing)
        await db.flush()
        return existing

    new_mapping = ReferralMapping(
        risk_level=risk_level.upper(),
        facility_type=facility_type,
        recommendation=recommendation,
        urgency_label=urgency_label,
        is_active=True,
    )
    db.add(new_mapping)
    await db.flush()
    return new_mapping