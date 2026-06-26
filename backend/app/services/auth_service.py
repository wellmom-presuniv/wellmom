from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.core.security import hash_password, verify_password, create_access_token


async def register_user(
    db: AsyncSession,
    email: str,
    password: str,
    full_name: str,
    role: str = "worker",
    job_category: str | None = None,
) -> dict:
    existing = await crud.user.get_user_by_email(db, email)
    if existing:
        raise HTTPException(status_code=409, detail="Email sudah terdaftar")

    pw_hash = hash_password(password)
    new_user = await crud.user.create_user(
        db=db,
        email=email,
        password_hash=pw_hash,
        full_name=full_name,
        role=role,
        job_category=job_category,
    )

    token = create_access_token(new_user.user_id, new_user.role)

    return {
        "user_id": new_user.user_id,
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

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Akun tidak aktif")

    token = create_access_token(user.user_id, user.role)

    return {
        "user_id": user.user_id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "access_token": token,
        "token_type": "bearer",
    }