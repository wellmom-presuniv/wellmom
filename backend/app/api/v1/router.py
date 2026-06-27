from fastapi import APIRouter
from app.api.v1 import auth
from app.api.v1 import pregnancy

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(pregnancy.router, prefix="", tags=["profile"])