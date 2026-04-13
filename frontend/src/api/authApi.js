import api from './axios'

export const authApi = {
  register: (data) =>
    api.post('/auth/register', data),

  login: (data) =>
    api.post('/auth/login', data),

  sendOTP: (data) =>
    api.post('/auth/send-otp', data),

  verifyOTP: (data) =>
    api.post('/auth/verify-otp', data),

  me: () =>
    api.get('/auth/me'),

  updateProfile: (data) =>
    api.put('/auth/profile', data),

  changePassword: (data) =>
    api.put('/auth/change-password', data),
}