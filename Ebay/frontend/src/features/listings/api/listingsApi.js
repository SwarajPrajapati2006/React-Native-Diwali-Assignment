import api from '../../../services/api';

export const listingsApi = {
  getListings: async (params = {}) => {
    const res = await api.get('/api/listings', { params });
    return res.data;
  },
  getListingById: async (id) => {
    const res = await api.get(`/api/listings/${id}`);
    return res.data;
  },
  getSimilarListings: async (id) => {
    const res = await api.get(`/api/listings/${id}/similar`);
    return res.data;
  },
  createListing: async (data) => {
    const res = await api.post('/api/listings', data);
    return res.data;
  },
  updateListing: async (id, data) => {
    const res = await api.patch(`/api/listings/${id}`, data);
    return res.data;
  },
  updateListingStatus: async (id, status) => {
    const res = await api.patch(`/api/listings/${id}/status`, { status });
    return res.data;
  },
  toggleListingActive: async (id, isActive) => {
    const res = await api.patch(`/api/listings/${id}/active`, { isActive });
    return res.data;
  },
  deleteListing: async (id) => {
    const res = await api.delete(`/api/listings/${id}`);
    return res.data;
  },
  getCategories: async () => {
    const res = await api.get('/api/categories');
    return res.data;
  },
};
