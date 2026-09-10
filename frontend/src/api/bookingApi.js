import api from './axios';

export const bookingApi = {
  createBooking: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my'),
  getOwnerBookings: () => api.get('/bookings/owner/my'),
  getAllBookings: () => api.get('/bookings/all'),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (bookingId) => api.put(`/bookings/${bookingId}/cancel`),
  getAvailableSlots: (lotId, params) => api.get(`/bookings/${lotId}/available-slots`, { params }),
};
