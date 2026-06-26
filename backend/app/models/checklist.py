import uuid
from sqlalchemy import Column, Date, Integer, Boolean, String, ForeignKey, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base

class ChecklistLog(Base):
    __tablename__ = "checklist_logs"
    log_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    pregnancy_profile_id = Column(UUID(as_uuid=True), ForeignKey("pregnancy_profiles.profile_id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False)
    consumed_iron_pill = Column(Boolean, default=False)
    consumed_folic_acid = Column(Boolean, default=False)
    water_intake_glasses = Column(Integer, default=0)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())