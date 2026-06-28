import uuid
from pydantic import BaseModel, EmailStr
from typing import Optional


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = "mother"
    job_category: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    """Dipakai untuk response register DAN login."""
    user_id: uuid.UUID
    email: str
    full_name: str
    role: str
    access_token: str
    token_type: str