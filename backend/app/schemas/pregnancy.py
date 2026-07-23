import uuid
from datetime import date
from pydantic import BaseModel


class CreateProfileRequest(BaseModel):
    hpht: date  # Hari Pertama Haid Terakhir


class ProfileResponse(BaseModel):
    profile_id: uuid.UUID
    hpht: date
    hpl: date               # Hari Perkiraan Lahir
    trimester: int          # 1 | 2 | 3
    gestational_week: int   # minggu ke berapa saat ini
    progress_pct: float     # 0.0 – 100.0 untuk progress bar Arka
    is_active: bool

    model_config = {"from_attributes": True}

class UpdateProfileRequest(BaseModel):
    hpht: date