import uuid
from datetime import date, datetime
from typing import Literal, Optional
from pydantic import BaseModel, Field


class AnswerItem(BaseModel):
    question_id: uuid.UUID
    answer: bool


MedicalHistoryCode = Literal[
    "HYPERTENSION",
    "DIABETES",
    "KIDNEY_DISEASE",
    "HEART_DISEASE",
    "AUTOIMMUNE",
    "CLOTTING_DISORDER",
    "SEVERE_ANEMIA",
    "NONE",
]


class SubmitAssessmentRequest(BaseModel):
    answers: list[AnswerItem]
    systolic_bp: Optional[int] = None
    diastolic_bp: Optional[int] = None
    # Q11 riwayat penyakit: multi-select, tidak masuk skor, dipakai untuk mengarahkan edukasi.
    medical_history: list[MedicalHistoryCode] = Field(default_factory=list)


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
    # MAP = (sistolik + 2 x diastolik) / 3, null kalau tensi tidak diisi.
    map_mmhg: Optional[float] = None
    # MAP > cutoff KIA hanya pada usia kehamilan < 20 minggu (scoring/map_check.py);
    # kalau true sudah ikut menaikkan risk_category (Risiko Sedang).
    map_at_risk: bool = False
    # Kategori AHA >= STAGE_2 (semua usia kehamilan, termasuk HPHT kosong) -> berisiko; ikut menaikkan
    # risk_category ke minimal MEDIUM. Independen dari map_at_risk. Aditif (default false).
    bp_at_risk: bool = False
    # Minggu penuh dari HPHT saat assessment; null kalau HPHT tidak tersedia.
    gestational_week: Optional[int] = None
    medical_history: list[str] = Field(default_factory=list)

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
