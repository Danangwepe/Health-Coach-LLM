"""
analysis/pattern_analyzer.py
Menganalisis pola kebiasaan dari data log harian user.
Semua kalkulasi dilakukan di sini (deterministik), bukan oleh LLM.
"""

from statistics import mean, stdev
from typing import Any


# ── Threshold referensi kesehatan ───────────────────────────
THRESHOLDS = {
    "sleep_hours":        {"min": 7,    "ideal": 8,   "max": 9},
    "water_ml":           {"min": 2000, "ideal": 2500, "max": 4000},
    "exercise_minutes":   {"min": 20,   "ideal": 45,  "max": 90},
    "mood_score":         {"min": 5,    "ideal": 8,   "max": 10},
    "stress_level":       {"min": 1,    "ideal": 3,   "max": 5},   # lower = better
}


def _safe_avg(values: list) -> float:
    valid = [v for v in values if v is not None]
    return round(mean(valid), 2) if valid else 0.0


def _trend(values: list) -> str:
    """Deteksi tren 7 hari terakhir: improving / declining / stable."""
    valid = [v for v in values if v is not None]
    if len(valid) < 3:
        return "insufficient data"
    first_half = mean(valid[: len(valid) // 2])
    second_half = mean(valid[len(valid) // 2 :])
    diff = second_half - first_half
    if diff > 0.5:
        return "improving ↑"
    elif diff < -0.5:
        return "declining ↓"
    return "stable →"


def _score_metric(metric: str, avg_value: float) -> int:
    """Beri skor 0–100 berdasarkan seberapa dekat dengan nilai ideal."""
    t = THRESHOLDS.get(metric)
    if not t:
        return 50
    ideal = t["ideal"]
    # Stress: semakin rendah semakin bagus
    if metric == "stress_level":
        ratio = ideal / max(avg_value, 0.1)
    else:
        ratio = avg_value / ideal
    score = min(100, int(ratio * 100))
    return score


def analyze(logs: list[dict]) -> dict[str, Any]:
    """
    Input : list of daily_log dicts dari Supabase
    Output: ringkasan analitik yang siap dikirim ke LLM
    """
    if not logs:
        return {"error": "Belum ada data log. Silakan isi log harian terlebih dahulu."}

    # Ekstrak series per metrik
    series = {
        "sleep_hours":      [r.get("sleep_hours")      for r in logs],
        "water_ml":         [r.get("water_ml")         for r in logs],
        "exercise_minutes": [r.get("exercise_minutes") for r in logs],
        "mood_score":       [r.get("mood_score")       for r in logs],
        "stress_level":     [r.get("stress_level")     for r in logs],
    }

    averages = {k: _safe_avg(v) for k, v in series.items()}
    trends   = {k: _trend(v)   for k, v in series.items()}
    scores   = {k: _score_metric(k, averages[k]) for k in averages}

    overall_score = int(mean(scores.values()))

    # Identifikasi area bermasalah
    weak_areas = [
        k for k, s in scores.items() if s < 60
    ]
    strong_areas = [
        k for k, s in scores.items() if s >= 80
    ]

    return {
        "days_analyzed": len(logs),
        "averages": averages,
        "trends": trends,
        "scores": scores,
        "overall_health_score": overall_score,
        "weak_areas": weak_areas,
        "strong_areas": strong_areas,
        "raw_series": series,   # untuk grafik Plotly
    }
