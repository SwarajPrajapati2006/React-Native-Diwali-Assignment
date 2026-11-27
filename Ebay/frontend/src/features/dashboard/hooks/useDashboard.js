import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';
import { listingsApi } from '../../listings/api/listingsApi';

export const useDashboard = () => {
  const queryClient = useQueryClient();

  const dashboardQuery = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.getDashboardData,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => listingsApi.updateListingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });

  const deleteListingMutation = useMutation({
    mutationFn: (id) => listingsApi.deleteListing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });

  return {
    data: dashboardQuery.data,
    stats: dashboardQuery.data?.stats || {
      active: 0,
      reserved: 0,
      sold: 0,
      pendingOffers: 0,
      receivedEnquiries: 0,
      totalSales: 0,
    },
    recentListings: dashboardQuery.data?.recentListings || [],
    recentEnquiries: dashboardQuery.data?.recentEnquiries || [],
    isLoading: dashboardQuery.isLoading,
    isRefetching: dashboardQuery.isRefetching,
    refetch: dashboardQuery.refetch,
    updateStatus: updateStatusMutation.mutateAsync,
    deleteListing: deleteListingMutation.mutateAsync,
  };
};
