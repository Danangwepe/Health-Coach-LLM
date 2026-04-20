"""
routers/coach.py
Endpoint untuk AI coaching — weekly report & chat.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(__file__)), '..'))

from src.database.supabase_client import (
    get_logs_by_user, save_chat_message, get_recent_chat
)
from src.analysis.pattern_analyzer import analyze
from src.llm.coach import generate_weekly_report, chat_with_coach

router = APIRouter()


@router.get("/report/{user_id}")
def weekly_report(user_id: str):
    try:
        logs = get_logs_by_user(user_id, 14)
        if not logs:
            raise HTTPException(status_code=404, detail="Belum ada data log")
        analysis = analyze(logs)
        report = generate_weekly_report(analysis, "User")
        return {"success": True, "report": report, "analysis": analysis}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class ChatIn(BaseModel):
    user_id: str = "demo_user_001"
    message: str
    history: Optional[List[dict]] = []


@router.post("/chat")
def chat(body: ChatIn):
    try:
        logs = get_logs_by_user(body.user_id, 14)
        analysis = analyze(logs) if logs else None

        reply = chat_with_coach(
            user_message=body.message,
            chat_history=body.history,
            analysis=analysis,
        )
        save_chat_message(body.user_id, "user", body.message)
        save_chat_message(body.user_id, "assistant", reply)

        return {"success": True, "reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history/{user_id}")
def chat_history(user_id: str):
    try:
        history = get_recent_chat(user_id, 20)
        return {"success": True, "data": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
