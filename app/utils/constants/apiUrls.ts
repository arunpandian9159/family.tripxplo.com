// API Base URLs
export const NEXT_PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "/api/v1/";
export const NEXT_PUBLIC_IMAGE_URL =
  process.env.NEXT_PUBLIC_PIC_URL ||
  "https://tripemilestone.in-maa-1.linodeobjects.com/";

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: "auth/register",
    LOGIN: "auth/login",
    LOGOUT: "auth/logout",
    REFRESH: "auth/refresh",
  },

  // Destinations
  DESTINATIONS: {
    LIST: "destinations",
    FEATURED: "destinations/featured",
    SEARCH: "destinations/search",
    BY_ID: (id: string) => `destinations/${id}`,
  },

  // Packages
  PACKAGES: {
    LIST: "packages",
    FEATURED: "packages/featured",
    SEARCH: "packages/search",
    BY_ID: (id: string) => `packages/${id}`,
  },

  // User
  USER: {
    PROFILE: "user/profile",
    WISHLIST: "user/wishlist",
    WISHLIST_ITEM: (packageId: string) => `user/wishlist/${packageId}`,
    BOOKINGS: "user/bookings",
  },

  // Cart
  CART: {
    GET: "cart",
    ADD: "cart/add",
    UPDATE: (itemId: string) => `cart/${itemId}`,
    REMOVE: (itemId: string) => `cart/${itemId}`,
    CLEAR: "cart/clear",
  },

  // Bookings
  BOOKINGS: {
    CREATE: "bookings",
    BY_ID: (id: string) => `bookings/${id}`,
    CANCEL: (id: string) => `bookings/${id}/cancel`,
  },

  // Payment
  PAYMENT: {
    INITIALIZE: "payment/initialize",
    PROCESS: "payment/process",
    VERIFY: "payment/verify",
    STATUS: (paymentId: string) => `payment/${paymentId}/status`,
    EMI_PAY: "emi/pay",
  },

  // Utility
  INTERESTS: "interests",
  PLANS: "plans",
  COUPONS: {
    LIST: "package/coupon",
    VALIDATE: "package/coupon/check",
  },

  // Health
  HEALTH: "health",
} as const;

// Helper function to build full API URL
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = NEXT_PUBLIC_API_URL.endsWith("/")
    ? NEXT_PUBLIC_API_URL
    : `${NEXT_PUBLIC_API_URL}/`;
  return `${baseUrl}${endpoint}`;
};
