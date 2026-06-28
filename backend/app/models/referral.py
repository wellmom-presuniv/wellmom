import uuid
from sqlalchemy import Column, String, Boolean
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP
from sqlalchemy.sql import func

from app.database import Base


class ReferralMapping(Base):
    __tablename__ = "referral_mappings"

    mapping_id      = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    risk_level      = Column(String(10), nullable=False)   # LOW | MEDIUM | HIGH
    facility_type   = Column(String(100), nullable=True)   # nullable untuk migration aman
    recommendation  = Column(String(500), nullable=True)   # ganti dari recommendation_action
    urgency_label   = Column(String(100), nullable=True)
    is_active       = Column(Boolean, nullable=False, default=True)
    created_at      = Column(TIMESTAMP(timezone=True), nullable=False, server_default=func.now())