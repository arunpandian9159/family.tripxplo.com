import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/lib/api-client';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
}

export function useAuth() {
  const {
    data: userInfo,
    status: queryStatus,
    refetch,
  } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await userApi.getProfile();
      if (response.success && response.data) {
        return { result: response.data };
      }
      throw new Error('Failed to fetch profile');
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const user = userInfo?.result as User | undefined;
  const isAuthenticated = !!user;
  const isLoading = queryStatus === 'pending';
  const isError = queryStatus === 'error';

  return { user, isAuthenticated, isLoading, isError, refetch };
}
