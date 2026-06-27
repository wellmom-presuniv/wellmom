from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.schemas.user import UserCreate, UserResponse
from app.services import auth_service

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    # Menggunakan auth_service yang sudah kita perbaiki tadi
    result = await auth_service.register_user(
        db=db,
        email=user_in.email,
        password=user_in.password,
        full_name=user_in.full_name,
        role=user_in.role
    )
    return result

@router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    # auth_service.authenticate_user sudah mengembalikan format JSON lengkap 
    # (termasuk access_token dan token_type)
    result = await auth_service.authenticate_user(
        db=db, 
        email=form_data.username, 
        password=form_data.password
    )
    return result