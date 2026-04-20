"""
backend/main.py
FastAPI entry point — AI Health Coach
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import logs, coach, analytics

app = FastAPI(title="AI Health Coach API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(logs.router,      prefix="/api/logs",      tags=["Logs"])
app.include_router(coach.router,     prefix="/api/coach",     tags=["Coach"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])

@app.get("/")
def root():
    return {"status": "ok", "message": "AI Health Coach API is running"}
