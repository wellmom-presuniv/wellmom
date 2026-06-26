from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordRequestForm
from app.api import deps
from app.schemas.user import UserCreate, UserResponse
from app.schemas.token import Token
from app.services import auth_service
from app.crud import user as crud_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse)
async def register(
    user_in: UserCreate, 
    db: AsyncSession = Depends(deps.get_db)
):
    # Pastikan default role selalu mother jika tidak diisi admin
    if user_in.role not in ["mother", "admin"]:
        user_in.role = "mother"
        
    user = await crud_user.get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="Email sudah terdaftar."
        )
    user = await crud_user.create_user(db, user_in)
    return user

@router.post("/login", response_model=Token)
async def login(
    db: AsyncSession = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
):
    user = await auth_service.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=400, detail="Email atau password salah."
        )
    
    access_token = auth_service.create_access_token(subject=str(user.id))
    return {"access_token": access_token, "token_type": "bearer"}