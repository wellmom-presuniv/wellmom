import uuid
from sqlalchemy import Column, String, Integer, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base

class EducationContent(Base):
    __tablename__ = "education_contents"
    content_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    body = Column(String, nullable=False)
    target_trimester = Column(Integer, nullable=True) # 1, 2, 3
    created_at = Column(DateTime(timezone=True), server_default=func.now())