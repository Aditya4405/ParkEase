import api from './axios';

export const ownerApi = {
  getDashboardStats: () => api.get('/owner/dashboard-stats'),
  getRevenue: () => api.get('/owner/revenue'),
  getStatistics: () => api.get('/owner/statistics'),
};
