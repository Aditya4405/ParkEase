import api from './axios';

export const userApi = {
  getDashboardStats: () => api.get('/user/dashboard-stats'),
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
  getAllUsers: (role) => api.get('/users', { params: role ? { role } : {} }),
  getUserById: (id) => api.get(`/users/${id}`),
  createUser: (data, password) => api.post('/users', data, { params: password ? { password } : {} }),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getSystemStats: () => api.get('/admin/stats'),
};
