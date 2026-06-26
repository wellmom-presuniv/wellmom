import uuid
from sqlalchemy import Column, String, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base

class ReferralMapping(Base):
    __tablename__ = "referral_mappings"
    mapping_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    risk_level = Column(String, nullable=False) # LOW, MEDIUM, HIGH
    recommendation_action = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())