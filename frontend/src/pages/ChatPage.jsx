import { useState, useRef, useEffect } from "react"
import { coachApi } from "../lib/api"
import { Send, Leaf, User, Zap } from "lucide-react"
import clsx from "clsx"

const QUICK = [
  "Bagaimana kondisi kesehatanku minggu ini?",
  "Tips agar kualitas tidurku lebih baik",
  "Saya sering merasa lelah, kenapa ya?",
  "Berikan motivasi untuk olahraga hari ini",
]

function Bubble({ role, content }) {
  const isUser = role === "user"
  return (
    <div className={clsx("flex gap-3", isUser && "flex-row-reverse")}>
      {/* Avatar */}
      <div className={clsx(
        "w-8 h-8 rounded-xl shrink-0 flex items-center justify-center mt-0.5",
        isUser ? "bg-indigo-100" : "bg-white border border-surface-border"
      )}>
        {isUser
          ? <User size={14} className="text-indigo-600" />
          : <Leaf size={14} className="text-indigo-500" />
        }
      </div>

      {/* Bubble */}
      <div className={clsx(
        "max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed",
        isUser
          ? "bg-indigo-600 text-white rounded-tr-sm"
          : "bg-white border border-surface-border text-gray-700 rounded-tl-sm"
      )}>
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-xl bg-white border border-surface-border flex items-center justify-center">
        <Leaf size={14} className="text-indigo-500" />
      </div>
      <div className="bg-white border border-surface-border px-4 py-3 rounded-2xl rounded-tl-sm">
        <div className="flex gap-1.5 items-center h-4">
          {[0,1,2].map(i => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ChatPage({ userId }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Halo! Saya AI Health Coach kamu 🌿\n\nTanyakan apa saja seputar kesehatan, tidur, olahraga, atau kebiasaan harianmu. Saya akan menjawab berdasarkan data aktualmu.",
    }
  ])
  const [input,   setInput]   = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const send = async (text) => {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput("")

    const updated = [...messages, { role: "user", content: msg }]
    setMessages(updated)
    setLoading(true)

    try {
      const r = await coachApi.chat(userId, msg, updated.slice(-10))
      setMessages(m => [...m, { role: "assistant", content: r.data.reply }])
    } catch (e) {
      setMessages(m => [...m, {
        role: "assistant",
        content: "Maaf, terjadi kesalahan. Coba lagi ya.",
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] max-w-2xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="py-7 mb-2 shrink-0">
        <h1 className="text-2xl font-semibold tracking-tight">Chat Coach</h1>
        <p className="text-sm text-gray-400 mt-1">
          Tanya apa saja — jawaban berdasarkan data kesehatanmu
        </p>
      </div>

      {/* Quick prompts */}
      {messages.length <= 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6 shrink-0">
          {QUICK.map(q => (
            <button
              key={q}
              onClick={() => send(q)}
              className="text-left text-xs text-gray-600 border border-surface-border
                         rounded-xl px-3 py-2.5 hover:bg-surface-muted hover:border-indigo-200
                         transition-all flex items-start gap-2"
            >
              <Zap size={11} className="text-indigo-400 mt-0.5 shrink-0" />
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 pb-4">
        {messages.map((m, i) => (
          <Bubble key={i} role={m.role} content={m.content} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="py-4 shrink-0">
        <div className="flex gap-2 card px-3 py-2.5 items-end">
          <textarea
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ketik pesan... (Enter untuk kirim)"
            className="flex-1 resize-none bg-transparent text-sm focus:outline-none
                       leading-relaxed max-h-32 py-0.5"
            style={{ fieldSizing: "content" }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="btn-primary px-3 py-2 shrink-0 disabled:opacity-40"
          >
            <Send size={14} />
          </button>
        </div>
        <p className="text-center text-xs text-gray-300 mt-2">
          AI Coach tidak menggantikan dokter. Konsultasikan kondisi serius ke tenaga medis.
        </p>
      </div>
    </div>
  )
}
