import uuid
from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base

class RiskThreshold(Base):
    __tablename__ = "risk_thresholds"
    threshold_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    min_score = Column(Integer, nullable=False)
    max_score = Column(Integer, nullable=False)
    category = Column(String(10), nullable=False)  # LOW | MEDIUM | HIGH
    is_active = Column(Boolean, nullable=False, default=True)