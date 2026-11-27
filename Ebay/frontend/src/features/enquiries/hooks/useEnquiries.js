import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enquiriesApi } from '../api/enquiriesApi';

export const useEnquiries = (type = 'all') => {
  const queryClient = useQueryClient();

  const enquiriesQuery = useQuery({
    queryKey: ['enquiries', type],
    queryFn: () => enquiriesApi.getEnquiries(type),
  });

  const respondMutation = useMutation({
    mutationFn: ({ id, payload }) => enquiriesApi.respondEnquiry(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: (id) => enquiriesApi.withdrawEnquiry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
    },
  });

  return {
    enquiries: enquiriesQuery.data || [],
    isLoading: enquiriesQuery.isLoading,
    isRefetching: enquiriesQuery.isRefetching,
    refetch: enquiriesQuery.refetch,
    respondEnquiry: respondMutation.mutateAsync,
    withdrawEnquiry: withdrawMutation.mutateAsync,
  };
};
