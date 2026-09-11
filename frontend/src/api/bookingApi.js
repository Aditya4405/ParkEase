import api from './axios';

export const bookingApi = {
  createBooking: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my'),
  getOwnerBookings: () => api.get('/bookings/owner/my'),
  getAllBookings: () => api.get('/bookings/all'),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (bookingId) => api.put(`/bookings/${bookingId}/cancel`),
  getAvailableSlots: (lotId, paramsOrType, maybeStart, maybeEnd) => {
    let params = {};
    if (paramsOrType && typeof paramsOrType === 'object') {
      params = { ...paramsOrType };
    } else {
      if (paramsOrType) params.vehicleType = paramsOrType;
      if (maybeStart) params.startTime = maybeStart;
      if (maybeEnd) params.endTime = maybeEnd;
    }
    return api.get(`/bookings/${lotId}/available-slots`, { params });
  },
  verifyBooking: (id) => api.get(`/bookings/verify/${id}`),
};
