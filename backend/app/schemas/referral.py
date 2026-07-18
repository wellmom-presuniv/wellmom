import uuid
from typing import Optional
from pydantic import BaseModel


class ReferralResponse(BaseModel):
    mapping_id: uuid.UUID
    risk_level: str
    facility_type: Optional[str]
    recommendation: Optional[str]
    urgency_label: Optional[str]
    is_active: bool

    model_config = {"from_attributes": True}


class UpsertReferralRequest(BaseModel):
    facility_type: str
    recommendation: str
    urgency_label: str