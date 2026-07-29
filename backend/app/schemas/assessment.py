import uuid
from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field


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


class DurationTriggeredSymptom(BaseModel):
    symptom: str
    days_active: int
    status: str


class AssessmentResultResponse(BaseModel):
    response_id: uuid.UUID
    date: str
    risk_category: str
    red_flag_triggered: bool
    triggered_red_flags: list[TriggeredFlag]
    duration_triggered_symptoms: list[DurationTriggeredSymptom] = Field(default_factory=list)
    total_score: Optional[int]
    bp_assessment_status: str
    bp_category: Optional[str] = None

class AssessmentHistoryItem(BaseModel):
    response_id: uuid.UUID
    date: str
    risk_category: str
    red_flag_triggered: bool
    triggered_red_flags: list[TriggeredFlag]
    duration_triggered_symptoms: list[DurationTriggeredSymptom] = Field(default_factory=list)
    total_score: Optional[int]
    bp_assessment_status: str
    bp_category: Optional[str] = None


class HighRiskAssessmentAlertResponse(BaseModel):
    response_id: uuid.UUID
    result_id: uuid.UUID
    user_id: uuid.UUID
    full_name: str
    email: str
    pregnancy_profile_id: uuid.UUID
    hpht: Optional[date]
    hpl: Optional[date]
    gestational_week: Optional[int]
    risk_category: str
    total_score: Optional[int]
    red_flag_triggered: bool
    triggered_red_flags: list[TriggeredFlag] = Field(default_factory=list)
    assessment_date: datetime


class QuestionResponse(BaseModel):
    question_id: uuid.UUID
    question_text: str
    order_index: int
    is_red_flag: bool
    weight: int
    is_active: bool

    model_config = {"from_attributes": True}
