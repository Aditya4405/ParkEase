import api from './axios';

export const adminApi = {
  getDashboardStats: () => api.get('/admin/dashboard-stats'),
  getUsers: () => api.get('/admin/users'),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/toggle-status`),
  getOwners: () => api.get('/admin/owners'),
  getParkingLots: () => api.get('/admin/parking-lots'),
  toggleParkingLotStatus: (id) => api.put(`/admin/parking-lots/${id}/toggle-status`),
  getParkingSlots: () => api.get('/admin/parking-slots'),
  getBookings: () => api.get('/admin/bookings'),
  getStatistics: () => api.get('/admin/statistics'),
  getPayments: () => api.get('/payments'),
};
