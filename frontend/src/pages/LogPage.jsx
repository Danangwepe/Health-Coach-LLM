import { Brain, CheckCircle2, Droplets, Dumbbell, Moon, NotebookPen, Smile, UtensilsCrossed } from "lucide-react"
import { useState } from "react"
import { logApi } from "../lib/api"

const METRICS = [
  {
    key: "sleep_hours", label: "Tidur", icon: Moon,
    min: 0, max: 12, step: 0.5, unit: "jam", default: 7,
    hint: "Berapa jam kamu tidur semalam?",
    color: "text-indigo-500",
  },
  {
    key: "water_ml", label: "Air minum", icon: Droplets,
    min: 0, max: 4000, step: 100, unit: "ml", default: 2000,
    hint: "Total air yang diminum hari ini",
    color: "text-cyan-500",
  },
  {
    key: "exercise_minutes", label: "Olahraga", icon: Dumbbell,
    min: 0, max: 180, step: 5, unit: "menit", default: 30,
    hint: "Durasi olahraga hari ini",
    color: "text-emerald-500",
  },
  {
    key: "mood_score", label: "Mood", icon: Smile,
    min: 1, max: 10, step: 1, unit: "/10", default: 7,
    hint: "1 = sangat buruk · 10 = luar biasa",
    color: "text-amber-500",
  },
  {
    key: "stress_level", label: "Stress", icon: Brain,
    min: 1, max: 10, step: 1, unit: "/10", default: 4,
    hint: "1 = santai · 10 = sangat stres",
    color: "text-rose-500",
  },
]

export default function LogPage({ userId }) {
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  })

  const [values, setValues] = useState(
    Object.fromEntries(METRICS.map(m => [m.key, m.default]))
  )
  const [meals,   setMeals]   = useState("")
  const [notes,   setNotes]   = useState("")
  const [loading, setLoading] = useState(false)
  const [saved,   setSaved]   = useState(false)

  const set = (key, val) => setValues(v => ({ ...v, [key]: val }))

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await logApi.create({ user_id: userId, ...values, meals, notes })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      alert("Gagal menyimpan: " + (e.response?.data?.detail || e.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs text-gray-400 mb-1.5 uppercase tracking-wider font-medium">{today}</p>
        <h1 className="text-2xl font-semibold tracking-tight">Log Kebiasaan Harian</h1>
        <p className="text-sm text-gray-500 mt-1.5">
          Isi setiap hari agar AI Coach bisa memberi rekomendasi yang akurat.
        </p>
      </div>

      {/* Metric sliders */}
      <div className="flex flex-col gap-6 mb-8">
        {METRICS.map(({ key, label, icon: Icon, min, max, step, unit, hint, color }) => (
          <div key={key} className="card px-5 py-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icon size={16} className={color} />
                <span className="text-sm font-medium">{label}</span>
              </div>
              <span className="text-md font-sans text-gray-800">
                {values[key]} {unit}
              </span>
            </div>
            <input
              type="range"
              min={min} max={max} step={step}
              value={values[key]}
              onChange={e => set(key, parseFloat(e.target.value))}
              className="w-full accent-indigo-500 h-1.5 rounded-full cursor-pointer"
            />
            <p className="text-xs text-gray-400 mt-2">{hint}</p>
          </div>
        ))}
      </div>

      {/* Text inputs */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="card px-5 py-5">
          <div className="flex items-center gap-2 mb-3">
            <UtensilsCrossed size={15} className="text-orange-400" />
            <span className="text-sm font-medium">Makan hari ini</span>
          </div>
          <textarea
            rows={3}
            value={meals}
            onChange={e => setMeals(e.target.value)}
            placeholder="Contoh: Sarapan nasi + telur, makan siang ayam bakar..."
            className="input resize-none"
          />
        </div>

        <div className="card px-5 py-5">
          <div className="flex items-center gap-2 mb-3">
            <NotebookPen size={15} className="text-violet-400" />
            <span className="text-sm font-medium">Catatan tambahan</span>
          </div>
          <textarea
            rows={2}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Ada yang ingin dicatat hari ini?"
            className="input resize-none"
          />
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading || saved}
        className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-base"
      >
        {saved ? (
          <><CheckCircle2 size={18} /> Tersimpan!</>
        ) : loading ? (
          <span className="animate-pulse">Menyimpan...</span>
        ) : (
          "Simpan Log Hari Ini"
        )}
      </button>
    </div>
  )
}
