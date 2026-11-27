import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesApi } from '../api/favoritesApi';
import { useNetworkStore } from '../../../store/networkStore';

export const useFavorites = () => {
  const queryClient = useQueryClient();
  const { isConnected, enqueueAction } = useNetworkStore();

  const favoritesQuery = useQuery({
    queryKey: ['favorites'],
    queryFn: favoritesApi.getFavorites,
  });

  const favoriteIdsQuery = useQuery({
    queryKey: ['favoriteIds'],
    queryFn: favoritesApi.getFavoriteIds,
  });

  const toggleFavorite = async (listing) => {
    const listingId = listing._id || listing.id;
    const currentIds = favoriteIdsQuery.data || [];
    const isFav = currentIds.includes(listingId);

    // Optimistic cache update
    const nextIds = isFav
      ? currentIds.filter((id) => id !== listingId)
      : [...currentIds, listingId];

    queryClient.setQueryData(['favoriteIds'], nextIds);

    if (!isConnected) {
      // Queue offline action
      await enqueueAction({
        type: 'TOGGLE_FAVORITE',
        action: isFav ? 'REMOVE' : 'ADD',
        listingId,
      });
      return;
    }

    try {
      if (isFav) {
        await favoritesApi.removeFavorite(listingId);
      } else {
        await favoritesApi.addFavorite(listingId);
      }
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    } catch (e) {
      console.warn('Favorite toggle error:', e);
      // rollback on error
      queryClient.setQueryData(['favoriteIds'], currentIds);
    }
  };

  const isFavorite = (listingId) => {
    const currentIds = favoriteIdsQuery.data || [];
    return currentIds.includes(listingId);
  };

  return {
    favorites: favoritesQuery.data || [],
    favoriteIds: favoriteIdsQuery.data || [],
    isLoading: favoritesQuery.isLoading,
    isRefetching: favoritesQuery.isRefetching,
    refetch: favoritesQuery.refetch,
    toggleFavorite,
    isFavorite,
  };
};
