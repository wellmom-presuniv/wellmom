import uuid
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.database import Base

class AssessmentQuestion(Base):
    __tablename__ = "assessment_questions"
    question_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    question_text = Column(String, nullable=False)
    category = Column(String, nullable=False)
    weight = Column(Integer, default=1)
    is_red_flag = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)

class AssessmentResponse(Base):
    __tablename__ = "assessment_responses"
    response_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    pregnancy_profile_id = Column(UUID(as_uuid=True), ForeignKey("pregnancy_profiles.profile_id", ondelete="CASCADE"), nullable=False)
    assessment_date = Column(DateTime(timezone=True), server_default=func.now())
    systolic_bp = Column(Integer, nullable=True)
    diastolic_bp = Column(Integer, nullable=True)

class AssessmentResponseItem(Base):
    __tablename__ = "assessment_response_items"
    item_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    response_id = Column(UUID(as_uuid=True), ForeignKey("assessment_responses.response_id", ondelete="CASCADE"), nullable=False)
    question_id = Column(UUID(as_uuid=True), ForeignKey("assessment_questions.question_id", ondelete="CASCADE"), nullable=False)
    answer = Column(Boolean, nullable=False)

class AssessmentResult(Base):
    __tablename__ = "assessment_results"
    result_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    response_id = Column(UUID(as_uuid=True), ForeignKey("assessment_responses.response_id", ondelete="CASCADE"), nullable=False)
    total_score = Column(Integer, nullable=False)
    risk_level = Column(String, nullable=False) # LOW, MEDIUM, HIGH
    triggered_red_flags = Column(JSONB, nullable=True) # [{"question_id": "uuid", "question_text": "text"}]
    bp_assessment_status = Column(String(20), nullable=False, default="NOT_PROVIDED") # NOT_PROVIDED | PENDING_THRESHOLD | NORMAL | FLAGGED
    recommendation_text = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())