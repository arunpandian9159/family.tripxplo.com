import { API_ENDPOINTS, buildApiUrl } from "@/app/utils/constants/apiUrls";

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  result?: T; // For paginated responses matching external API format
  message?: string;
  error?: string;
  code?: string;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  headers?: Record<string, string>;
  requireAuth?: boolean;
}

// Get access token from storage
const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};

// Set access token in storage
export const setAccessToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("accessToken", token);
};

// Set refresh token in storage
export const setRefreshToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("refreshToken", token);
};

// Get refresh token from storage
export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refreshToken");
};

// Clear tokens
export const clearTokens = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// Main API request function
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = "GET", body, headers = {}, requireAuth = false } = options;

  const url = buildApiUrl(endpoint);

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (requireAuth) {
    const token = getAccessToken();
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    // Handle token refresh if needed
    if (response.status === 401 && requireAuth) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Retry the request with new token
        const token = getAccessToken();
        requestHeaders["Authorization"] = `Bearer ${token}`;

        const retryResponse = await fetch(url, {
          method,
          headers: requestHeaders,
          body: body ? JSON.stringify(body) : undefined,
        });

        return await retryResponse.json();
      }
    }

    return data;
  } catch (error) {
    console.error("API request error:", error);
    return {
      success: false,
      error: "Network error occurred",
      code: "NETWORK_ERROR",
    };
  }
}

// Refresh access token
async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(buildApiUrl(API_ENDPOINTS.AUTH.REFRESH), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (data.success && data.data) {
      setAccessToken(data.data.token);
      setRefreshToken(data.data.refreshToken);
      return true;
    }
  } catch (error) {
    console.error("Token refresh error:", error);
  }

  clearTokens();
  return false;
}

// Auth API
export const authApi = {
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) =>
    apiRequest<{ user: unknown; token: string; refreshToken: string }>(
      API_ENDPOINTS.AUTH.REGISTER,
      { method: "POST", body: data }
    ),

  login: (data: { email: string; password: string }) =>
    apiRequest<{ user: unknown; token: string; refreshToken: string }>(
      API_ENDPOINTS.AUTH.LOGIN,
      { method: "POST", body: data }
    ),

  logout: () =>
    apiRequest(API_ENDPOINTS.AUTH.LOGOUT, {
      method: "POST",
      requireAuth: true,
    }),

  refresh: (refreshToken: string) =>
    apiRequest<{ token: string; refreshToken: string }>(
      API_ENDPOINTS.AUTH.REFRESH,
      { method: "POST", body: { refreshToken } }
    ),
};

// Destinations API
export const destinationsApi = {
  list: (params?: { page?: number; limit?: number }) =>
    apiRequest(
      `${API_ENDPOINTS.DESTINATIONS.LIST}?${new URLSearchParams(
        params as Record<string, string>
      ).toString()}`
    ),

  featured: (limit?: number) =>
    apiRequest(
      `${API_ENDPOINTS.DESTINATIONS.FEATURED}${limit ? `?limit=${limit}` : ""}`
    ),

  search: (query: string, params?: { page?: number; limit?: number }) =>
    apiRequest(
      `${API_ENDPOINTS.DESTINATIONS.SEARCH}?q=${encodeURIComponent(
        query
      )}&${new URLSearchParams(params as Record<string, string>).toString()}`
    ),

  getById: (id: string) => apiRequest(API_ENDPOINTS.DESTINATIONS.BY_ID(id)),
};

// Packages API
export const packagesApi = {
  list: (params?: Record<string, string | number>) =>
    apiRequest(
      `${API_ENDPOINTS.PACKAGES.LIST}?${new URLSearchParams(
        params as Record<string, string>
      ).toString()}`
    ),

  featured: (limit?: number) =>
    apiRequest(
      `${API_ENDPOINTS.PACKAGES.FEATURED}${limit ? `?limit=${limit}` : ""}`
    ),

  search: (params?: Record<string, string | number>) =>
    apiRequest(
      `${API_ENDPOINTS.PACKAGES.SEARCH}?${new URLSearchParams(
        params as Record<string, string>
      ).toString()}`
    ),

  getById: (id: string) => apiRequest(API_ENDPOINTS.PACKAGES.BY_ID(id)),
};

// User API
export const userApi = {
  getProfile: () =>
    apiRequest(API_ENDPOINTS.USER.PROFILE, { requireAuth: true }),

  updateProfile: (data: Record<string, unknown>) =>
    apiRequest(API_ENDPOINTS.USER.PROFILE, {
      method: "PUT",
      body: data,
      requireAuth: true,
    }),

  getWishlist: () =>
    apiRequest(API_ENDPOINTS.USER.WISHLIST, { requireAuth: true }),

  addToWishlist: (packageId: string) =>
    apiRequest(API_ENDPOINTS.USER.WISHLIST_ITEM(packageId), {
      method: "POST",
      requireAuth: true,
    }),

  removeFromWishlist: (packageId: string) =>
    apiRequest(API_ENDPOINTS.USER.WISHLIST_ITEM(packageId), {
      method: "DELETE",
      requireAuth: true,
    }),

  getBookings: (params?: { page?: number; limit?: number }) =>
    apiRequest(
      `${API_ENDPOINTS.USER.BOOKINGS}?${new URLSearchParams(
        params as Record<string, string>
      ).toString()}`,
      { requireAuth: true }
    ),
};

// Cart API
export const cartApi = {
  get: () => apiRequest(API_ENDPOINTS.CART.GET, { requireAuth: true }),

  add: (data: {
    packageId: string;
    travelDate: string;
    adults: number;
    children?: number;
    quantity?: number;
  }) =>
    apiRequest(API_ENDPOINTS.CART.ADD, {
      method: "POST",
      body: data,
      requireAuth: true,
    }),

  update: (itemId: string, data: Record<string, unknown>) =>
    apiRequest(API_ENDPOINTS.CART.UPDATE(itemId), {
      method: "PUT",
      body: data,
      requireAuth: true,
    }),

  remove: (itemId: string) =>
    apiRequest(API_ENDPOINTS.CART.REMOVE(itemId), {
      method: "DELETE",
      requireAuth: true,
    }),

  clear: () =>
    apiRequest(API_ENDPOINTS.CART.CLEAR, { method: "POST", requireAuth: true }),
};

// Bookings API
export const bookingsApi = {
  create: (data: {
    packageId: string;
    travelDate: string;
    adults: number;
    children?: number;
    // Price fields
    finalPackagePrice?: number;
    totalPackagePrice?: number;
    gstPrice?: number;
    gstPer?: number;
    couponDiscount?: number;
    couponCode?: string | null;
    redeemCoin?: number;
    // EMI fields
    emiMonths?: number;
    emiAmount?: number;
    totalEmiAmount?: number;
  }) =>
    apiRequest(API_ENDPOINTS.BOOKINGS.CREATE, {
      method: "POST",
      body: data,
      requireAuth: true,
    }),

  getById: (id: string) =>
    apiRequest(API_ENDPOINTS.BOOKINGS.BY_ID(id), { requireAuth: true }),

  cancel: (id: string, reason?: string) =>
    apiRequest(API_ENDPOINTS.BOOKINGS.CANCEL(id), {
      method: "POST",
      body: { reason },
      requireAuth: true,
    }),
};

// Payment API
export const paymentApi = {
  initialize: (data: { amount: number; orderId: string; currency?: string }) =>
    apiRequest(API_ENDPOINTS.PAYMENT.INITIALIZE, {
      method: "POST",
      body: data,
      requireAuth: true,
    }),

  process: (data: { paymentId: string; paymentMethod: string }) =>
    apiRequest(API_ENDPOINTS.PAYMENT.PROCESS, {
      method: "POST",
      body: data,
      requireAuth: true,
    }),

  payEmi: (data: { bookingId: string; installmentNumber: number }) =>
    apiRequest(API_ENDPOINTS.PAYMENT.EMI_PAY, {
      method: "POST",
      body: data,
      requireAuth: true,
    }),

  verify: (data: { paymentId: string; transactionId: string }) =>
    apiRequest(API_ENDPOINTS.PAYMENT.VERIFY, {
      method: "POST",
      body: data,
      requireAuth: true,
    }),

  getStatus: (paymentId: string) =>
    apiRequest(API_ENDPOINTS.PAYMENT.STATUS(paymentId), { requireAuth: true }),
};

// Coupon API
export const couponApi = {
  validate: (code: string) =>
    apiRequest(API_ENDPOINTS.COUPONS.VALIDATE, {
      method: "POST",
      body: { code },
      requireAuth: true,
    }),
};

// Health check
export const healthApi = {
  check: () => apiRequest(API_ENDPOINTS.HEALTH),
};

// Export all APIs
export default {
  auth: authApi,
  destinations: destinationsApi,
  packages: packagesApi,
  user: userApi,
  cart: cartApi,
  bookings: bookingsApi,
  payment: paymentApi,
  coupon: couponApi,
  health: healthApi,
};
