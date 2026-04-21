import clsx from "clsx"
import { ClipboardList, LayoutDashboard, Leaf, MessageCircle } from "lucide-react"
import { NavLink, Route, Routes } from "react-router-dom"
import ChatPage from "./pages/ChatPage"
import DashboardPage from "./pages/DashboardPage"
import HomePage from "./pages/HomePage"
import LogPage from "./pages/LogPage"

const USER_ID = "demo_user_001"

const nav = [
  { to: "/log",       label: "Log Harian",  icon: ClipboardList   },
  { to: "/dashboard", label: "Dashboard",   icon: LayoutDashboard },
  { to: "/chat",      label: "Chat Coach",  icon: MessageCircle   },
]

function NavBar() {
  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-surface-border">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <NavLink
          to="/"
          className="flex items-center gap-2.5 text-gray-900 hover:text-gray-700 transition-colors"
        >
          <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center text-white">
            <Leaf size={13} />
          </div>
          <span className="text-sm font-semibold tracking-tight">Health Coach</span>
        </NavLink>

        <nav className="flex items-center gap-0.5">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] transition-all",
                  isActive
                    ? "bg-brand-50 text-brand-600 font-medium"
                    : "text-gray-500 hover:text-gray-800 hover:bg-surface-muted"
                )
              }
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

function InnerLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/"          element={<HomePage />} />
      <Route path="/log"       element={<InnerLayout><LogPage      userId={USER_ID} /></InnerLayout>} />
      <Route path="/dashboard" element={<InnerLayout><DashboardPage userId={USER_ID} /></InnerLayout>} />
      <Route path="/chat"      element={<InnerLayout><ChatPage     userId={USER_ID} /></InnerLayout>} />
    </Routes>
  )
}
