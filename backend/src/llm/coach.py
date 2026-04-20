"""
llm/coach.py
Menghubungkan hasil analisis ke LLM (Groq + Llama 3.3-70b)
melalui LangChain untuk menghasilkan coaching yang personal.
"""

import os
import json
from langchain_groq import ChatGroq
from langchain.schema import SystemMessage, HumanMessage, AIMessage
from dotenv import load_dotenv

load_dotenv()

# ── Inisialisasi model ───────────────────────────────────────
def _get_llm() -> ChatGroq:
    return ChatGroq(
        api_key=os.getenv("GROQ_API_KEY"),
        model_name="llama-3.3-70b-versatile",
        temperature=0.6,
        max_tokens=1024,
    )


# ── System prompt ────────────────────────────────────────────
SYSTEM_PROMPT = """
Kamu adalah AI Health & Habit Coach yang empatik, berbasis data, dan komunikatif.

ATURAN KETAT:
1. Selalu gunakan data analitik yang diberikan sebagai dasar utama saran.
2. JANGAN memberikan diagnosis medis atau menggantikan dokter.
3. Berikan saran yang spesifik, actionable, dan realistis.
4. Gunakan bahasa Indonesia yang hangat dan mudah dipahami.
5. Jika ditanya hal di luar kesehatan & produktivitas, tolak dengan sopan.
6. Bedakan antara fakta dari data (observed) dan rekomendasi kamu (inferred).

FORMAT RESPONS untuk laporan mingguan:
- 🟢 Kelebihan (apa yang sudah baik)
- 🔴 Area yang perlu diperbaiki
- 💡 3 rekomendasi spesifik hari ini
- 📊 Skor kesehatan keseluruhan: XX/100

Untuk chat biasa, jawab secara natural dan singkat.
"""


# ── Weekly Report ────────────────────────────────────────────
def generate_weekly_report(analysis: dict, user_name: str = "Kamu") -> str:
    """Generate laporan mingguan berdasarkan hasil analisis."""
    llm = _get_llm()

    user_prompt = f"""
Nama user: {user_name}
Data analisis {analysis['days_analyzed']} hari terakhir:

RATA-RATA HARIAN:
- Tidur     : {analysis['averages']['sleep_hours']} jam
- Minum air : {analysis['averages']['water_ml']} ml
- Olahraga  : {analysis['averages']['exercise_minutes']} menit
- Mood      : {analysis['averages']['mood_score']}/10
- Stress    : {analysis['averages']['stress_level']}/10

TREN:
{json.dumps(analysis['trends'], indent=2, ensure_ascii=False)}

SKOR PER AREA (0-100):
{json.dumps(analysis['scores'], indent=2, ensure_ascii=False)}

SKOR KESELURUHAN: {analysis['overall_health_score']}/100
AREA LEMAH: {', '.join(analysis['weak_areas']) or 'Tidak ada'}
AREA KUAT : {', '.join(analysis['strong_areas']) or 'Tidak ada'}

Buatkan laporan coaching mingguan yang personal dan memotivasi.
"""

    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
        HumanMessage(content=user_prompt),
    ]
    response = llm.invoke(messages)
    return response.content


# ── Chat interaktif ──────────────────────────────────────────
def chat_with_coach(
    user_message: str,
    chat_history: list[dict],
    analysis: dict | None = None,
) -> str:
    """
    Chat interaktif dengan coach.
    chat_history: [{"role": "user"/"assistant", "content": "..."}]
    """
    llm = _get_llm()

    messages = [SystemMessage(content=SYSTEM_PROMPT)]

    # Sertakan konteks analisis jika ada
    if analysis and "error" not in analysis:
        context = f"""
[KONTEKS DATA USER — gunakan ini sebagai referensi]
Skor kesehatan saat ini: {analysis['overall_health_score']}/100
Area lemah: {', '.join(analysis['weak_areas']) or 'tidak ada'}
Area kuat : {', '.join(analysis['strong_areas']) or 'tidak ada'}
Rata-rata tidur: {analysis['averages']['sleep_hours']} jam
Rata-rata mood : {analysis['averages']['mood_score']}/10
"""
        messages.append(SystemMessage(content=context))

    # Tambah riwayat chat
    for msg in chat_history[-8:]:  # Ambil 8 pesan terakhir sebagai konteks
        if msg["role"] == "user":
            messages.append(HumanMessage(content=msg["content"]))
        else:
            messages.append(AIMessage(content=msg["content"]))

    messages.append(HumanMessage(content=user_message))

    response = llm.invoke(messages)
    return response.content
