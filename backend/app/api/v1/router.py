from fastapi import APIRouter

from app.api.v1 import (
    auth,
    pregnancy,
    assessment,
    checklist,
    content,
    admin,
    referral,
    monitoring,
)


api_router = APIRouter()


api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["auth"],
)

api_router.include_router(
    pregnancy.router,
    prefix="",
    tags=["profile"],
)

api_router.include_router(
    assessment.router,
    prefix="",
    tags=["assessment"],
)

api_router.include_router(
    checklist.router,
    prefix="",
    tags=["checklist"],
)

api_router.include_router(
    content.router,
    prefix="",
    tags=["content"],
)

api_router.include_router(
    admin.router,
    prefix="",
    tags=["admin"],
)

api_router.include_router(
    referral.router,
    prefix="",
    tags=["referral"],
)

api_router.include_router(
    monitoring.router,
    prefix="",
    tags=["monitoring"],
)