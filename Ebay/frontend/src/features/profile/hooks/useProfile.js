import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../api/profileApi';
import { useAuthStore } from '../../../store/authStore';

export const useProfile = () => {
  const queryClient = useQueryClient();
  const { user, updateUser } = useAuthStore();

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.getProfile,
    initialData: user,
  });

  const updateProfileMutation = useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: (updated) => {
      updateUser(updated);
      queryClient.setQueryData(['profile'], updated);
    },
  });

  return {
    profile: profileQuery.data || user,
    isLoading: profileQuery.isLoading,
    refetch: profileQuery.refetch,
    updateProfile: updateProfileMutation.mutateAsync,
  };
};
