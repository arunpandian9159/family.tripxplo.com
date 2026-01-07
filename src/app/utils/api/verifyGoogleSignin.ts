import toast from 'react-hot-toast';
import { apiRequest, setAccessToken, setRefreshToken } from '@/lib/api-client';

interface GoogleOAuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
  refreshToken: string;
}

export const verifyGoogleAccessToken = async (token: string) => {
  try {
    // Call the auth Google OAuth endpoint
    const response = await apiRequest<GoogleOAuthResponse>('auth/google/oauth', {
      method: 'POST',
      body: { token },
    });

    if (response.success && response.data) {
      setAccessToken(response.data.token);
      setRefreshToken(response.data.refreshToken);
      
      return {
        data: {
          result: {
            accessToken: response.data.token,
            refreshToken: response.data.refreshToken,
            user: response.data.user,
          },
        },
      };
    }

    toast.error('An error occurred');
    return Promise.reject();
  } catch (error) {
    toast.error('An error occurred');
    return Promise.reject();
  }
};
