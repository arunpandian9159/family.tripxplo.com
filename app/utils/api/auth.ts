// This file is kept for backward compatibility
// All API calls now use the centralized API client from @/lib/api-client
import {
  apiRequest,
  setAccessToken,
  setRefreshToken,
  getRefreshToken as getRefreshTokenFromStorage,
  clearTokens,
} from "@/lib/api-client";
import {
  getAccessToken as getAccessTokenFromStorage,
  cleanToken,
} from "../constants/accessToken";
import { NEXT_PUBLIC_API_URL } from "../constants/apiUrls";

// Re-export token functions for backward compatibility
export { setAccessToken, setRefreshToken, clearTokens };

// Backward compatible API wrapper that uses the new fetch-based client
const api = {
  get: async (
    endpoint: string,
    config?: { params?: Record<string, unknown> },
  ) => {
    const queryString = config?.params
      ? "?" +
        new URLSearchParams(config.params as Record<string, string>).toString()
      : "";
    const response = await apiRequest(endpoint + queryString, {
      method: "GET",
      requireAuth: true,
    });
    return { data: response.success ? { result: response.data } : response };
  },

  post: async (endpoint: string, body?: unknown) => {
    const response = await apiRequest(endpoint, {
      method: "POST",
      body,
      requireAuth: true,
    });
    return { data: response.success ? { result: response.data } : response };
  },

  put: async (endpoint: string, body?: unknown) => {
    const response = await apiRequest(endpoint, {
      method: "PUT",
      body,
      requireAuth: true,
    });
    return { data: response.success ? { result: response.data } : response };
  },

  delete: async (endpoint: string) => {
    const response = await apiRequest(endpoint, {
      method: "DELETE",
      requireAuth: true,
    });
    return { data: response.success ? { result: response.data } : response };
  },
};

export default api;
