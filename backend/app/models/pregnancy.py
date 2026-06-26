import uuid
from sqlalchemy import Column, String, Date, Integer, ForeignKey, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base

class PregnancyProfile(Base):
    __tablename__ = "pregnancy_profiles"
    profile_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    estimated_due_date = Column(Date, nullable=True) # HPL
    last_menstrual_period = Column(Date, nullable=True) # HPHT
    current_trimester = Column(Integer, nullable=True)
    status = Column(String, default="active", nullable=False) # active, completed
    created_at = Column(DateTime(timezone=True), server_default=func.now())