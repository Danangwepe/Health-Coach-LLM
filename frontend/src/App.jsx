import clsx from "clsx"
import { ClipboardList, LayoutDashboard, Leaf, MessageCircle } from "lucide-react"
import { NavLink, Route, Routes } from "react-router-dom"
import ChatPage from "./pages/ChatPage"
import DashboardPage from "./pages/DashboardPage"
import LogPage from "./pages/LogPage"

const USER_ID = "demo_user_001"

const nav = [
  { to: "/",          label: "Log Harian",  icon: ClipboardList  },
  { to: "/dashboard", label: "Dashboard",   icon: LayoutDashboard },
  { to: "/chat",      label: "Chat Coach",  icon: MessageCircle   },
]

export default function App() {
  return (
    <div className="min-h-screen flex">
      {/* ── Sidebar ─────────────────────────────── */}
      <aside className="w-56 shrink-0 bg-white border-r border-surface-border
                        flex flex-col py-8 px-4 fixed inset-y-0 left-0 z-20">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-2 mb-10">
          <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center
                          justify-center text-white">
            <Leaf size={15} />
          </div>
          <span className="font-serif text-lg leading-none">Health Coach</span>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                  isActive
                    ? "bg-brand-50 text-brand-600 font-medium"
                    : "text-gray-500 hover:bg-surface-muted hover:text-gray-800"
                )
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-auto px-2">
          <p className="text-xs text-gray-400">AI Health Coach v2.0</p>
          <p className="text-xs text-gray-400">Groq · LangChain · Supabase</p>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────── */}
      <main className="flex-1 ml-56 min-h-screen">
        <Routes>
          <Route path="/"          element={<LogPage      userId={USER_ID} />} />
          <Route path="/dashboard" element={<DashboardPage userId={USER_ID} />} />
          <Route path="/chat"      element={<ChatPage     userId={USER_ID} />} />
        </Routes>
      </main>
    </div>
  )
}
