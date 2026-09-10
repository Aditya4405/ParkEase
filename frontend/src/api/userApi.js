import api from './axios';

export const userApi = {
  getAllUsers: (role) => api.get('/users', { params: role ? { role } : {} }),
  getUserById: (id) => api.get(`/users/${id}`),
  createUser: (data, password) => api.post('/users', data, { params: password ? { password } : {} }),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getSystemStats: () => api.get('/admin/stats'),
};
