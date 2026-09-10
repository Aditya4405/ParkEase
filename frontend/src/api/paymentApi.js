import api from './axios';

export const paymentApi = {
  processPayment: (data) => api.post('/payments/process', data),
  getPaymentByBookingId: (bookingId) => api.get(`/payments/booking/${bookingId}`),
  getMyPayments: () => api.get('/payments/my'),
  getAllPayments: () => api.get('/payments'),
};
