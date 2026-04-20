"""
routers/logs.py
Endpoint untuk menyimpan dan mengambil log harian.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(__file__)), '..'))

from src.database.supabase_client import save_daily_log, get_logs_by_user

router = APIRouter()


class DailyLogIn(BaseModel):
    user_id: str = "demo_user_001"
    sleep_hours: float
    water_ml: int
    exercise_minutes: int
    mood_score: int
    stress_level: int
    meals: Optional[str] = ""
    notes: Optional[str] = ""


@router.post("/")
def create_log(log: DailyLogIn):
    try:
        result = save_daily_log(log.user_id, log.dict())
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{user_id}")
def get_logs(user_id: str, limit: int = 14):
    try:
        logs = get_logs_by_user(user_id, limit)
        return {"success": True, "data": logs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
