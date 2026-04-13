import api from './axios'

export const quizApi = {
  getAll: (params) =>
    api.get('/quizzes', { params }),

  getById: (id) =>
    api.get(`/quizzes/${id}`),

  create: (data) =>
    api.post('/quizzes', data),

  update: (id, data) =>
    api.put(`/quizzes/${id}`, data),

  remove: (id) =>
    api.delete(`/quizzes/${id}`),

  toggle: (id) =>
    api.patch(`/quizzes/${id}/toggle`),

  getQR: (id) =>
    api.get(`/quizzes/${id}/qr`),

  uploadFile: (formData) =>
    api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  extractText: (fileId) =>
    api.get(`/files/${fileId}/extract`),

  generate: (data) =>
    api.post('/ai/generate', data),

  getAnalytics: (id) =>
    api.get(`/analytics/quiz/${id}`),

  getLeaderboard: (id) =>
    api.get(`/analytics/leaderboard/${id}`),

  exportResults: (id, format = 'csv') =>
    api.get(`/analytics/export/${id}`, {
      params: { format },
      responseType: 'blob',
    }),
}

export const attemptApi = {
  join: (data) =>
    api.post('/attempts/join', data),

  submit: (id, data) =>
    api.post(`/attempts/${id}/submit`, data),

  flag: (id, data) =>
    api.post(`/attempts/${id}/flag`, data),

  getByQuiz: (quizId) =>
    api.get(`/attempts`, { params: { quizId } }),
}