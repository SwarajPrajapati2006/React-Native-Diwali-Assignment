import api from '../../../services/api';

export const favoritesApi = {
  getFavorites: async () => {
    const res = await api.get('/api/favorites');
    return res.data;
  },
  getFavoriteIds: async () => {
    const res = await api.get('/api/favorites/ids');
    return res.data;
  },
  addFavorite: async (listingId) => {
    const res = await api.post('/api/favorites', { listingId });
    return res.data;
  },
  removeFavorite: async (listingId) => {
    const res = await api.delete(`/api/favorites/${listingId}`);
    return res.data;
  },
};
