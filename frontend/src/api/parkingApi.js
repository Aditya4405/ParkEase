import api from './axios';

export const parkingApi = {
  // Public
  searchParkingLots: (params) => api.get('/parking-lots', { params }),
  getParkingLotById: (id) => api.get(`/parking-lots/${id}`),
  getSlotsByLotId: (lotId) => api.get(`/parking-lots/${lotId}/slots`),
  getSlotById: (id) => api.get(`/parking-slots/${id}`),

  // Owner / Admin
  getMyParkingLots: () => api.get('/parking-lots/owner/my'),
  createParkingLot: (data) => api.post('/parking-lots', data),
  updateParkingLot: (id, data) => api.put(`/parking-lots/${id}`, data),
  deleteParkingLot: (id) => api.delete(`/parking-lots/${id}`),

  // Slot Management
  addSlot: (lotId, data) => api.post(`/parking-lots/${lotId}/slots`, data),
  updateSlot: (id, data) => api.put(`/parking-slots/${id}`, data),
  deleteSlot: (id) => api.delete(`/parking-slots/${id}`),
};
