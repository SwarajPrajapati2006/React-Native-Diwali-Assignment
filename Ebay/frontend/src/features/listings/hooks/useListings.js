import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listingsApi } from '../api/listingsApi';

export const useListings = (filterParams = {}) => {
  const queryClient = useQueryClient();

  const listingsQuery = useQuery({
    queryKey: ['listings', filterParams],
    queryFn: () => listingsApi.getListings(filterParams),
    refetchOnMount:'always'
  });

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: listingsApi.getCategories,
  });

  const createMutation = useMutation({
    mutationFn: listingsApi.createListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => listingsApi.updateListingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: listingsApi.deleteListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  return {
    listings: listingsQuery.data?.listings || [],
    total: listingsQuery.data?.total || 0,
    isLoading: listingsQuery.isLoading,
    isRefetching: listingsQuery.isRefetching,
    refetch: listingsQuery.refetch,
    categories: categoriesQuery.data || [],
    createListing: createMutation.mutateAsync,
    updateStatus: updateStatusMutation.mutateAsync,
    deleteListing: deleteMutation.mutateAsync,
  };
};
