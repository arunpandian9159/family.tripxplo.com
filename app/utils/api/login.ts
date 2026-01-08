import { authApi, setAccessToken, setRefreshToken } from "@/lib/api-client";

export const login = async (email: string, password: string) => {
  const response = await authApi.login({ email, password });

  if (response.success && response.data) {
    // Store tokens using the new API client token management
    setAccessToken(response.data.token);
    setRefreshToken(response.data.refreshToken);

    // Return in a format compatible with existing code
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

  // Throw error with specific message from API
  const errorMessage = response.error || response.message || "Login failed";
  throw new Error(errorMessage);
};
