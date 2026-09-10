import api from './axios';

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  registerUser: (data) => api.post('/auth/register', data),
  registerOwner: (data) => api.post('/auth/register-owner', data),
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
};
