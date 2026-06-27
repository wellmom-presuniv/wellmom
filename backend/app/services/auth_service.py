from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.core.security import hash_password, verify_password, create_access_token
from app.schemas.user import UserCreate

async def register_user(
    db: AsyncSession,
    email: str,
    password: str,
    full_name: str,
    role: str = "mother",
) -> dict:
    existing = await crud.user.get_user_by_email(db, email)
    if existing:
        raise HTTPException(status_code=409, detail="Email sudah terdaftar")

    # Bungkus payload pakai UserCreate biar cocok dengan crud lu
    user_in = UserCreate(
        email=email,
        password=password,
        full_name=full_name,
        role=role
    )
    
    new_user = await crud.user.create_user(db=db, user_in=user_in)
    token = create_access_token(str(new_user.id), new_user.role)

    return {
        "user_id": str(new_user.id),
        "email": new_user.email,
        "full_name": new_user.full_name,
        "role": new_user.role,
        "access_token": token,
        "token_type": "bearer",
    }


async def authenticate_user(db: AsyncSession, email: str, password: str) -> dict:
    user = await crud.user.get_user_by_email(db, email)

    if user is None or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email atau password salah")

    # Udah pakai str(user.id) yang bener buat WellMom
    token = create_access_token(str(user.id), user.role)

    return {
        "user_id": str(user.id),
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "access_token": token,
        "token_type": "bearer",
    }