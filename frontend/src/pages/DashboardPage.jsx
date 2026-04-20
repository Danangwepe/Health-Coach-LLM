import { useEffect, useState } from "react"
import { analyticsApi, coachApi } from "../lib/api"
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine,
  BarChart, Bar, Legend,
} from "recharts"
import { TrendingUp, TrendingDown, Minus, Sparkles, RefreshCw } from "lucide-react"

const LABEL = {
  sleep_hours:      "Tidur",
  water_ml:         "Hidrasi",
  exercise_minutes: "Olahraga",
  mood_score:       "Mood",
  stress_level:     "Stress",
}

function TrendBadge({ trend }) {
  if (trend?.includes("↑")) return (
    <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
      <TrendingUp size={12} /> Membaik
    </span>
  )
  if (trend?.includes("↓")) return (
    <span className="flex items-center gap-1 text-rose-500 text-xs font-medium">
      <TrendingDown size={12} /> Menurun
    </span>
  )
  return (
    <span className="flex items-center gap-1 text-gray-400 text-xs">
      <Minus size={12} /> Stabil
    </span>
  )
}

export default function DashboardPage({ userId }) {
  const [data,    setData]    = useState(null)
  const [report,  setReport]  = useState("")
  const [loading, setLoading] = useState(true)
  const [genning, setGenning] = useState(false)

  useEffect(() => {
    analyticsApi.get(userId)
      .then(r => setData(r.data.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [userId])

  const generateReport = async () => {
    setGenning(true)
    try {
      const r = await coachApi.weeklyReport(userId)
      setReport(r.data.report)
    } catch (e) {
      alert("Gagal generate: " + (e.response?.data?.detail || e.message))
    } finally {
      setGenning(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-screen text-gray-400 text-sm">
      Memuat data...
    </div>
  )

  if (!data) return (
    <div className="max-w-lg mx-auto px-6 py-24 text-center">
      <p className="text-2xl font-serif mb-2">Belum ada data</p>
      <p className="text-sm text-gray-500">Isi log harian terlebih dahulu agar dashboard aktif.</p>
    </div>
  )

  // Radar data
  const radarData = Object.entries(data.scores).map(([k, v]) => ({
    metric: LABEL[k] || k, value: v,
  }))

  // Line chart data — mood & stress (reversed to chronological)
  const lineData = [...Array(data.days_analyzed)].map((_, i) => ({
    day: `H-${data.days_analyzed - 1 - i}`,
    mood:   data.raw_series.mood_score?.[data.days_analyzed - 1 - i],
    stress: data.raw_series.stress_level?.[data.days_analyzed - 1 - i],
  }))

  // Bar data — actual vs target
  const barData = [
    { name: "Tidur (jam)",  kamu: data.averages.sleep_hours,                     target: 8  },
    { name: "Air (×100ml)", kamu: +(data.averages.water_ml / 100).toFixed(1),    target: 25 },
    { name: "Olahraga (m)", kamu: data.averages.exercise_minutes,                target: 45 },
  ]

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-sm text-gray-400 mb-1">{data.days_analyzed} hari terakhir</p>
        <h1 className="text-3xl">Dashboard Kesehatan</h1>
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card px-5 py-5 col-span-1 flex flex-col justify-center items-center">
          <p className="text-xs text-gray-400 mb-1">Skor Kesehatan</p>
          <p className="text-5xl font-serif text-indigo-600">{data.overall_health_score}</p>
          <p className="text-xs text-gray-400 mt-1">/ 100</p>
        </div>
        <div className="col-span-2 grid grid-cols-2 gap-4">
          {Object.entries(data.scores).map(([k, score]) => (
            <div key={k} className="card px-4 py-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">{LABEL[k]}</span>
                <TrendBadge trend={data.trends[k]} />
              </div>
              <p className="text-2xl font-serif">{score}<span className="text-sm text-gray-400">/100</span></p>
              <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="card px-5 py-5">
          <p className="text-sm font-medium mb-4">Radar Kesehatan</p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e8e7e4" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <Radar dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="card px-5 py-5">
          <p className="text-sm font-medium mb-4">Mood vs Stress</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={lineData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0ee" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#9ca3af" }} />
              <YAxis domain={[1, 10]} tick={{ fontSize: 10, fill: "#9ca3af" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid #e8e7e4" }} />
              <ReferenceLine y={5} stroke="#e8e7e4" strokeDasharray="3 3" />
              <Line dataKey="mood"   stroke="#f59e0b" strokeWidth={2} dot={false} name="Mood" />
              <Line dataKey="stress" stroke="#ef4444" strokeWidth={2} dot={false} name="Stress" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="card px-5 py-5 mb-6">
        <p className="text-sm font-medium mb-4">Kamu vs Target Ideal</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0ee" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} />
            <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid #e8e7e4" }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="kamu"   name="Rata-rata kamu" fill="#6366f1" radius={[4,4,0,0]} />
            <Bar dataKey="target" name="Target ideal"   fill="#e8e7e4" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AI Report */}
      <div className="card px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium">Laporan AI Coach</p>
            <p className="text-xs text-gray-400 mt-0.5">Analisis personal berdasarkan data kamu</p>
          </div>
          <button onClick={generateReport} disabled={genning} className="btn-ghost flex items-center gap-2">
            <RefreshCw size={14} className={genning ? "animate-spin" : ""} />
            {genning ? "Membuat..." : "Generate"}
          </button>
        </div>

        {report ? (
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-surface-muted rounded-xl p-4">
            {report}
          </div>
        ) : (
          <div className="flex flex-col items-center py-8 text-gray-400">
            <Sparkles size={28} className="mb-2 text-indigo-300" />
            <p className="text-sm">Klik Generate untuk membuat laporan mingguan</p>
          </div>
        )}
      </div>
    </div>
  )
}
