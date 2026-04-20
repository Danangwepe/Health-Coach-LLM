"""
routers/analytics.py
Endpoint untuk analisis pola kesehatan.
"""

from fastapi import APIRouter, HTTPException
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(__file__)), '..'))

from src.database.supabase_client import get_logs_by_user
from src.analysis.pattern_analyzer import analyze

router = APIRouter()


@router.get("/{user_id}")
def get_analytics(user_id: str, days: int = 14):
    try:
        logs = get_logs_by_user(user_id, days)
        if not logs:
            return {"success": False, "message": "Belum ada data log"}
        result = analyze(logs)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
