import uuid
from datetime import date
from enum import Enum

from pydantic import BaseModel, Field


class MonitoringType(str, Enum):
    FETAL_WEIGHT = "FETAL_WEIGHT"
    HEAD_CIRC = "HEAD_CIRC"
    MATERNAL = "MATERNAL"
    FETAL_LENGTH = "FETAL_LENGTH"
    GROWTH = "GROWTH"


class GrowthIndicator(str, Enum):
    WEIGHT = "WEIGHT"
    LENGTH = "LENGTH"
    HEAD_CIRCUMFERENCE = "HEAD_CIRCUMFERENCE"


class BiologicalSex(str, Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"


class FetalWeightLogRequest(BaseModel):
    measurement_date: date | None = None
    weight_grams: float = Field(gt=0)


class FetalWeightLogResponse(BaseModel):
    record_id: uuid.UUID
    date: date
    weight_grams: float
    status: str | None = None
    message: str | None = None


class FetalLengthLogRequest(BaseModel):
    measurement_date: date | None = None
    length_cm: float = Field(gt=0, le=70)


class FetalLengthLogResponse(BaseModel):
    record_id: uuid.UUID
    date: date
    length_cm: float


class HeadCircumferenceLogRequest(BaseModel):
    measurement_date: date | None = None
    head_circumference_cm: float = Field(gt=0)


class HeadCircumferenceLogResponse(BaseModel):
    record_id: uuid.UUID
    date: date
    head_circumference_cm: float
    normal_range: str
    message: str
    is_evaluated: bool


class MaternalLogRequest(BaseModel):
    measurement_date: date | None = None
    weight_kg: float = Field(gt=0)
    height_cm: float = Field(gt=0)
    lila_cm: float | None = Field(default=None, gt=0, le=60)


class MaternalLogResponse(BaseModel):
    record_id: uuid.UUID
    date: date
    weight_kg: float
    height_cm: float
    lila_cm: float | None = None
    lila_status: str | None = None  # NORMAL | KEK_RISK
    lila_message: str | None = None


class GrowthEvaluateRequest(BaseModel):
    measurement_date: date | None = None
    indicator: GrowthIndicator
    value: float = Field(gt=0)
    age_months: int = Field(ge=0, le=24)
    sex: BiologicalSex


class GrowthEvaluateResponse(BaseModel):
    record_id: uuid.UUID
    date: date
    indicator: GrowthIndicator
    value: float
    age_months: int
    sex: BiologicalSex
    z_score: float
    zone: str
    reference_month_used: int


class MonitoringHistoryItem(BaseModel):
    record_id: uuid.UUID
    date: date
    type: MonitoringType

    fetal_weight_grams: float | None = None
    head_circumference_cm: float | None = None
    fetal_length_cm: float | None = None

    maternal_weight_kg: float | None = None
    maternal_height_cm: float | None = None
    maternal_lila_cm: float | None = None
    lila_status: str | None = None

    indicator: GrowthIndicator | None = None
    value: float | None = None
    age_months: int | None = None
    sex: BiologicalSex | None = None

    status: str | None = None
    zone: str | None = None
    message: str | None = None
    z_score: float | None = None
    reference_month_used: int | None = None