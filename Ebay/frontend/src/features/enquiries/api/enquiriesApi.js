import api from '../../../services/api';

export const enquiriesApi = {
  getEnquiries: async (type = 'all') => {
    const res = await api.get('/api/enquiries', { params: { type } });
    return res.data;
  },
  getEnquiryById: async (id) => {
    const res = await api.get(`/api/enquiries/${id}`);
    return res.data;
  },
  sendEnquiry: async (payload) => {
    const res = await api.post('/api/enquiries', payload);
    return res.data;
  },
  respondEnquiry: async (id, payload) => {
    const res = await api.patch(`/api/enquiries/${id}/respond`, payload);
    return res.data;
  },
  withdrawEnquiry: async (id) => {
    const res = await api.patch(`/api/enquiries/${id}/withdraw`);
    return res.data;
  },
};
