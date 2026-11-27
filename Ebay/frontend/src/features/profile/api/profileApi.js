import api from '../../../services/api';

export const profileApi = {
  getProfile: async () => {
    const res = await api.get('/api/auth/me');
    return res.data;
  },
  updateProfile: async (data) => {
    const res = await api.patch('/api/users/me', data);
    return res.data;
  },
};
