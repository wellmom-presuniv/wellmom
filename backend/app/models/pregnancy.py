import uuid
from sqlalchemy import Column, Date, Boolean, ForeignKey, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base

class PregnancyProfile(Base):
    __tablename__ = "pregnancy_profiles"
    
    profile_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Kolom disesuaikan dengan kebutuhan kodingan Claude
    hpht = Column(Date, nullable=True) # Hari Pertama Haid Terakhir
    hpl = Column(Date, nullable=True)  # Hari Perkiraan Lahir
    is_active = Column(Boolean, default=True, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())