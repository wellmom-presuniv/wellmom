import uuid
from typing import Optional
from pydantic import BaseModel


class EducationContentResponse(BaseModel):
    content_id: uuid.UUID
    title: str
    body: str
    trimester: Optional[int] = None
    category: Optional[str] = None
    order_in_category: Optional[int] = None

    model_config = {
        "from_attributes": True
    }