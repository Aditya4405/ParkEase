import api from './axios';

export const ownerApplicationApi = {
  // Public/User endpoints
  submitApplication: (data) => api.post('/owner-applications', data),
  getMyApplication: () => api.get('/owner-applications/me'),

  // Admin endpoints
  getAdminApplications: (params) => api.get('/admin/owner-applications', { params }),
  getAdminApplicationById: (id) => api.get(`/admin/owner-applications/${id}`),
  approveApplication: (id, data) => api.put(`/admin/owner-applications/${id}/approve`, data),
  rejectApplication: (id, data) => api.put(`/admin/owner-applications/${id}/reject`, data),
};
