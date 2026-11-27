import api from '../../../services/api';

export const dashboardApi = {
  getDashboardData: async () => {
    const res = await api.get('/api/users/dashboard');
    return res.data;
  },
  getMyStorefront: async (userId) => {
    const res = await api.get(`/api/users/${userId}/listings`);
    return res.data;
  },
};
