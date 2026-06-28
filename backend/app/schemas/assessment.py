import uuid
from datetime import date
from typing import Optional
from pydantic import BaseModel


class AnswerItem(BaseModel):
    question_id: uuid.UUID
    answer: bool


class SubmitAssessmentRequest(BaseModel):
    answers: list[AnswerItem]
    systolic_bp: Optional[int] = None
    diastolic_bp: Optional[int] = None


class TriggeredFlag(BaseModel):
    question_id: str
    question_text: str


class AssessmentResultResponse(BaseModel):
    response_id: uuid.UUID
    date: str
    risk_category: str              # LOW | MEDIUM | HIGH
    red_flag_triggered: bool
    triggered_red_flags: list[TriggeredFlag]
    total_score: Optional[int]      # None kalau red flag short-circuit
    bp_assessment_status: str       # NOT_PROVIDED | PENDING_THRESHOLD | NORMAL | FLAGGED


class QuestionResponse(BaseModel):
    question_id: uuid.UUID
    question_text: str
    order_index: int
    is_red_flag: bool
    weight: int
    is_active: bool

    model_config = {"from_attributes": True}