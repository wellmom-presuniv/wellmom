from fastapi import APIRouter
from app.api.v1 import auth
from app.api.v1 import pregnancy
from app.api.v1 import assessment
from app.api.v1 import admin

api_router = APIRouter()

api_router.include_router(auth.router,       prefix="/auth", tags=["auth"])
api_router.include_router(pregnancy.router,  prefix="",      tags=["profile"])
api_router.include_router(assessment.router, prefix="",      tags=["assessment"])
api_router.include_router(admin.router,      prefix="",      tags=["admin"])