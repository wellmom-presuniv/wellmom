from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import api_router
import app.models  # ← memastikan semua model ter-register di Base.metadata

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("WellMom backend starting...")
    yield
    print("WellMom backend shutting down...")

app = FastAPI(
    title="WellMom API",
    version="1.0.0",
    lifespan=lifespan,
)

# 🚨 INI BAGIAN YANG DIPERBARUI: TAMBAHKAN DOMAIN VERCEL & VITE LOKAL 🚨
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:8081",
        "http://localhost:5173",               # ← Wajib biar Vite lokal Alek nggak error
        "https://wellmom-cms.vercel.app",      # ← WAJIB: Domain resmi CMS Vercel kamu!
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")