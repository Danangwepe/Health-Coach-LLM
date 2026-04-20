"""
database/supabase_client.py
Mengelola koneksi dan operasi ke Supabase (PostgreSQL).
"""

import os
from datetime import datetime, date
from typing import Optional
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()


def get_client() -> Client:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    if not url or not key:
        raise ValueError("SUPABASE_URL dan SUPABASE_KEY harus diisi di file .env")
    return create_client(url, key)


# ── Log harian ──────────────────────────────────────────────

def save_daily_log(user_id: str, log: dict) -> dict:
    """Simpan log harian user ke database."""
    client = get_client()
    data = {
        "user_id": user_id,
        "log_date": str(date.today()),
        "sleep_hours": log.get("sleep_hours"),
        "water_ml": log.get("water_ml"),
        "exercise_minutes": log.get("exercise_minutes"),
        "mood_score": log.get("mood_score"),       # 1–10
        "stress_level": log.get("stress_level"),   # 1–10
        "meals": log.get("meals", ""),
        "notes": log.get("notes", ""),
        "created_at": datetime.utcnow().isoformat(),
    }
    response = client.table("daily_logs").insert(data).execute()
    return response.data[0] if response.data else {}


def get_logs_by_user(user_id: str, limit: int = 14) -> list:
    """Ambil log 14 hari terakhir milik user."""
    client = get_client()
    response = (
        client.table("daily_logs")
        .select("*")
        .eq("user_id", user_id)
        .order("log_date", desc=True)
        .limit(limit)
        .execute()
    )
    return response.data or []


# ── Profil user ─────────────────────────────────────────────

def get_or_create_user(user_id: str, name: str = "User") -> dict:
    """Ambil profil user, buat baru jika belum ada."""
    client = get_client()
    response = client.table("users").select("*").eq("user_id", user_id).execute()
    if response.data:
        return response.data[0]
    # Buat user baru
    new_user = {
        "user_id": user_id,
        "name": name,
        "created_at": datetime.utcnow().isoformat(),
    }
    client.table("users").insert(new_user).execute()
    return new_user


# ── Riwayat chat ─────────────────────────────────────────────

def save_chat_message(user_id: str, role: str, content: str):
    """Simpan satu pesan chat ke database."""
    client = get_client()
    client.table("chat_history").insert({
        "user_id": user_id,
        "role": role,
        "content": content,
        "created_at": datetime.utcnow().isoformat(),
    }).execute()


def get_recent_chat(user_id: str, limit: int = 10) -> list:
    """Ambil 10 pesan terakhir untuk konteks LLM."""
    client = get_client()
    response = (
        client.table("chat_history")
        .select("role, content")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )
    # Kembalikan urutan kronologis (oldest first)
    return list(reversed(response.data or []))
