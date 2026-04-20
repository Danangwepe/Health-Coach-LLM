import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  timeout: 30000,
})

export const logApi = {
  create: (data)         => api.post("/api/logs/", data),
  getAll: (userId, n=14) => api.get(`/api/logs/${userId}?limit=${n}`),
}

export const analyticsApi = {
  get: (userId, days=14) => api.get(`/api/analytics/${userId}?days=${days}`),
}

export const coachApi = {
  weeklyReport: (userId)          => api.get(`/api/coach/report/${userId}`),
  chat:         (userId, message, history) =>
                  api.post("/api/coach/chat", { user_id: userId, message, history }),
  history:      (userId)          => api.get(`/api/coach/history/${userId}`),
}

export default api
