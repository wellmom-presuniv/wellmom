import uuid
from sqlalchemy import Column, Float, Date, ForeignKey, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base

class MonitoringRecord(Base):
    __tablename__ = "monitoring_records"
    record_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    pregnancy_profile_id = Column(UUID(as_uuid=True), ForeignKey("pregnancy_profiles.profile_id", ondelete="CASCADE"), nullable=False)
    check_date = Column(Date, nullable=False)
    fetal_weight_grams = Column(Float, nullable=True)
    fetal_length_cm = Column(Float, nullable=True)
    head_circumference_cm = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())