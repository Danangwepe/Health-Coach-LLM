# 🌿 AI Health Coach — React + FastAPI

Panduan setup lengkap untuk versi full-stack (React frontend + FastAPI backend).

---

## 📁 Struktur Project

```
health-coach-react/
│
├── backend/                        ← FastAPI (Python)
│   ├── main.py                     ← Entry point API
│   ├── requirements.txt
│   ├── routers/
│   │   ├── logs.py                 ← POST/GET log harian
│   │   ├── analytics.py            ← GET analisis pola
│   │   └── coach.py                ← GET weekly report, POST chat
│   └── src/                        ← (copy dari project Streamlit lama)
│       ├── llm/coach.py
│       ├── database/supabase_client.py
│       ├── analysis/pattern_analyzer.py
│       └── utils/charts.py
│
└── frontend/                       ← React + Vite + Tailwind
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.jsx                ← Entry point React
        ├── App.jsx                 ← Router + Sidebar layout
        ├── index.css               ← Global styles + Tailwind
        ├── lib/
        │   └── api.js              ← Axios API client
        └── pages/
            ├── LogPage.jsx         ← Form log harian
            ├── DashboardPage.jsx   ← Charts + AI report
            └── ChatPage.jsx        ← Chat interaktif
```

---

## ⚙️ Setup Backend (FastAPI)

### 1. Masuk ke folder backend
```bash
cd health-coach-react/backend
```

### 2. Copy folder `src/` dari project Streamlit lama
```bash
# Dari root project lama, copy folder src ke backend
cp -r ../health-coach-ai/src ./src
cp ../health-coach-ai/.env .env
```

### 3. Buat virtual environment & install
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 4. Jalankan backend
```bash
uvicorn main:app --reload --port 8000
```

API akan berjalan di: **http://localhost:8000**
Dokumentasi otomatis di: **http://localhost:8000/docs**

---

## ⚛️ Setup Frontend (React)

### 1. Masuk ke folder frontend
```bash
cd health-coach-react/frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment
```bash
cp .env.example .env
# Isi VITE_API_URL=http://localhost:8000
```

### 4. Jalankan frontend
```bash
npm run dev
```

App akan berjalan di: **http://localhost:5173**

---

## 🚀 Menjalankan Keduanya Sekaligus

Buka **2 terminal terpisah**:

**Terminal 1 — Backend:**
```bash
cd backend && uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend && npm run dev
```

Buka browser: **http://localhost:5173** ✅

---

## 🌐 Deploy

### Backend → Railway (gratis)
1. Buka https://railway.app → login GitHub
2. New Project → Deploy from GitHub repo
3. Pilih folder `backend/`
4. Tambah environment variables (GROQ_API_KEY, SUPABASE_URL, SUPABASE_KEY)
5. Copy URL deploy → gunakan sebagai `VITE_API_URL` di frontend

### Frontend → Vercel (gratis)
1. Buka https://vercel.com → login GitHub
2. New Project → Import repo
3. Set Root Directory: `frontend`
4. Add Environment Variable: `VITE_API_URL=https://your-backend.railway.app`
5. Deploy!

---

## 🔑 Environment Variables

**Backend `.env`:**
```
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx
SUPABASE_URL=https://xxxxxxxxxx.supabase.co
SUPABASE_KEY=eyJhbGcixxxxxxxxxxxxxxxxxx
```

**Frontend `.env`:**
```
VITE_API_URL=http://localhost:8000
```
