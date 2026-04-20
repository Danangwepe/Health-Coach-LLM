"""
utils/charts.py
Membuat grafik interaktif dengan Plotly berdasarkan data log.
"""

import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots


COLORS = {
    "sleep":    "#6366f1",
    "water":    "#06b6d4",
    "exercise": "#10b981",
    "mood":     "#f59e0b",
    "stress":   "#ef4444",
}


def chart_overview(analysis: dict) -> go.Figure:
    """Radar chart skor kesehatan per area."""
    scores = analysis["scores"]
    labels = {
        "sleep_hours":      "Tidur",
        "water_ml":         "Hidrasi",
        "exercise_minutes": "Olahraga",
        "mood_score":       "Mood",
        "stress_level":     "Stress",
    }
    categories = [labels[k] for k in scores]
    values     = list(scores.values())

    fig = go.Figure(go.Scatterpolar(
        r=values + [values[0]],
        theta=categories + [categories[0]],
        fill="toself",
        fillcolor="rgba(99,102,241,0.2)",
        line=dict(color="#6366f1", width=2),
        name="Skor Kamu",
    ))
    fig.update_layout(
        polar=dict(radialaxis=dict(visible=True, range=[0, 100])),
        showlegend=False,
        title="📊 Radar Kesehatan Mingguan",
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font=dict(color="#e2e8f0"),
    )
    return fig


def chart_sleep_trend(analysis: dict, dates: list) -> go.Figure:
    """Line chart tren tidur."""
    values = list(reversed(analysis["raw_series"]["sleep_hours"]))
    fig = go.Figure(go.Scatter(
        x=dates,
        y=values,
        mode="lines+markers",
        line=dict(color=COLORS["sleep"], width=2),
        marker=dict(size=6),
        name="Jam Tidur",
        fill="tozeroy",
        fillcolor="rgba(99,102,241,0.1)",
    ))
    fig.add_hline(y=8, line_dash="dot", line_color="#94a3b8",
                  annotation_text="Ideal: 8 jam")
    fig.update_layout(
        title="😴 Tren Tidur",
        yaxis_title="Jam",
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font=dict(color="#e2e8f0"),
        xaxis=dict(gridcolor="#334155"),
        yaxis=dict(gridcolor="#334155"),
    )
    return fig


def chart_mood_stress(analysis: dict, dates: list) -> go.Figure:
    """Dual line chart mood vs stress."""
    mood   = list(reversed(analysis["raw_series"]["mood_score"]))
    stress = list(reversed(analysis["raw_series"]["stress_level"]))

    fig = go.Figure()
    fig.add_trace(go.Scatter(
        x=dates, y=mood, name="Mood",
        line=dict(color=COLORS["mood"], width=2),
        marker=dict(size=6),
    ))
    fig.add_trace(go.Scatter(
        x=dates, y=stress, name="Stress",
        line=dict(color=COLORS["stress"], width=2),
        marker=dict(size=6),
    ))
    fig.update_layout(
        title="🧠 Mood vs Stress",
        yaxis_title="Skor (1–10)",
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font=dict(color="#e2e8f0"),
        xaxis=dict(gridcolor="#334155"),
        yaxis=dict(gridcolor="#334155", range=[0, 10]),
    )
    return fig


def chart_habits_bar(analysis: dict) -> go.Figure:
    """Bar chart perbandingan rata-rata vs target."""
    metrics = {
        "Tidur (jam)":      (analysis["averages"]["sleep_hours"],      8),
        "Air (×100ml)":     (analysis["averages"]["water_ml"] / 100,   25),
        "Olahraga (menit)": (analysis["averages"]["exercise_minutes"], 45),
    }
    names   = list(metrics.keys())
    actuals = [v[0] for v in metrics.values()]
    targets = [v[1] for v in metrics.values()]

    fig = go.Figure()
    fig.add_trace(go.Bar(name="Rata-rata Kamu", x=names, y=actuals,
                         marker_color="#6366f1"))
    fig.add_trace(go.Bar(name="Target Ideal",   x=names, y=targets,
                         marker_color="#334155"))
    fig.update_layout(
        barmode="group",
        title="🎯 Kamu vs Target",
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font=dict(color="#e2e8f0"),
        yaxis=dict(gridcolor="#334155"),
    )
    return fig
