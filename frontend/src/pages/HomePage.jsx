import { ClipboardList, LayoutDashboard, Leaf, MessageCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

const features = [
  {
    to: "/log",
    icon: ClipboardList,
    color: "text-indigo-500",
    label: "Log Harian",
    desc: "Catat tidur, hidrasi, olahraga, dan mood setiap hari untuk membangun data kesehatanmu.",
    cta: "Mulai Log",
  },
  {
    to: "/dashboard",
    icon: LayoutDashboard,
    color: "text-emerald-500",
    label: "Dashboard",
    desc: "Lihat tren dan skor kesehatanmu lewat grafik interaktif berdasarkan data aktual.",
    cta: "Lihat Data",
  },
  {
    to: "/chat",
    icon: MessageCircle,
    color: "text-violet-500",
    label: "Chat Coach",
    desc: "Tanya AI Coach tentang kesehatanmu — jawaban personal berdasarkan data kamu.",
    cta: "Mulai Chat",
  },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface-muted flex flex-col">
      <header className="px-5 sm:px-8 py-5 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center text-white">
          <Leaf size={13} />
        </div>
        <span className="text-sm font-semibold tracking-tight">Health Coach</span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-5 sm:px-6 py-10 sm:py-16">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block text-[11px] font-semibold text-brand-600 tracking-[0.12em] uppercase mb-4 sm:mb-5">
              AI Health Coach
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl text-gray-900 mb-4 sm:mb-5 leading-[1.15]">
              Kesehatan kamu,<br />dalam satu tempat.
            </h1>
            <p className="text-[15px] text-gray-500 max-w-xs mx-auto leading-relaxed">
              Catat kebiasaan harian, pantau progres, dan dapatkan insight personal dari AI Coach.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {features.map(({ to, icon: Icon, color, label, desc, cta }) => (
              <div
                key={to}
                onClick={() => navigate(to)}
                className="bg-white border border-surface-border rounded-2xl p-6 cursor-pointer
                           hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.09)] hover:-translate-y-0.5
                           transition-all duration-200 group flex flex-col"
              >
                <Icon size={18} className={`${color} mb-5`} />
                <p className="text-[13px] font-semibold text-gray-900 mb-2">{label}</p>
                <p className="text-[13px] text-gray-500 leading-relaxed flex-1">{desc}</p>
                <div className="mt-5 pt-4 border-t border-surface-border">
                  <span className="text-[13px] font-medium text-brand-600 group-hover:text-brand-700 transition-colors">
                    {cta} →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="px-5 sm:px-8 py-5 text-center">
        <p className="text-[11px] text-gray-400 tracking-wide">
          AI Health Coach v2.0 · Groq · LangChain · Supabase
        </p>
      </footer>
    </div>
  )
}
