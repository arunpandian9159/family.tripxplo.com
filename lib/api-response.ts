import { NextResponse } from "next/server";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: string;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage?: boolean;
}

/**
 * Success response helper
 */
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status },
  );
}

/**
 * Error response helper
 */
export function errorResponse(
  error: string,
  code?: string,
  status: number = 400,
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
      code,
    },
    { status },
  );
}

/**
 * Paginated response helper - matches external API format
 */
export function paginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
  message?: string,
  options?: { hasNextPage?: boolean; offset?: number },
): NextResponse {
  const totalPages = Math.ceil(total / limit);
  const offset = options?.offset ?? (page - 1) * limit;

  // Return in format matching external API: { success, result: { docs, totalDocs, ... } }
  return NextResponse.json(
    {
      success: true,
      result: {
        docs: items,
        totalDocs: total,
        limit,
        page,
        totalPages,
        pagingCounter: offset + 1,
        hasPrevPage: page > 1,
        hasNextPage: options?.hasNextPage ?? page < totalPages,
        offset,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
      },
      message,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    },
  );
}

/**
 * Common error codes
 */
export const ErrorCodes = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  EMAIL_EXISTS: "EMAIL_EXISTS",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  INVALID_TOKEN: "INVALID_TOKEN",
  ACCOUNT_SUSPENDED: "ACCOUNT_SUSPENDED",
  PACKAGE_NOT_FOUND: "PACKAGE_NOT_FOUND",
  BOOKING_NOT_FOUND: "BOOKING_NOT_FOUND",
  ALREADY_CANCELLED: "ALREADY_CANCELLED",
  CART_NOT_FOUND: "CART_NOT_FOUND",
  ITEM_NOT_FOUND: "ITEM_NOT_FOUND",
  ALREADY_IN_WISHLIST: "ALREADY_IN_WISHLIST",
  NOT_IN_WISHLIST: "NOT_IN_WISHLIST",
  PAYMENT_NOT_FOUND: "PAYMENT_NOT_FOUND",
  ORDER_NOT_FOUND: "ORDER_NOT_FOUND",
  ORDER_ALREADY_PAID: "ORDER_ALREADY_PAID",
  ALREADY_PAID: "ALREADY_PAID",
} as const;

/**
 * Common error messages
 */
export const ErrorMessages: Record<string, string> = {
  [ErrorCodes.UNAUTHORIZED]: "Authentication required",
  [ErrorCodes.FORBIDDEN]: "Access denied",
  [ErrorCodes.NOT_FOUND]: "Resource not found",
  [ErrorCodes.VALIDATION_ERROR]: "Validation error",
  [ErrorCodes.INTERNAL_ERROR]: "Internal server error",
  [ErrorCodes.EMAIL_EXISTS]: "Email already registered",
  [ErrorCodes.INVALID_CREDENTIALS]: "Invalid email or password",
  [ErrorCodes.TOKEN_EXPIRED]: "Token has expired",
  [ErrorCodes.INVALID_TOKEN]: "Invalid token",
  [ErrorCodes.ACCOUNT_SUSPENDED]: "Account has been suspended",
  [ErrorCodes.PACKAGE_NOT_FOUND]: "Package not found",
  [ErrorCodes.BOOKING_NOT_FOUND]: "Booking not found",
  [ErrorCodes.ALREADY_CANCELLED]: "Booking already cancelled",
  [ErrorCodes.CART_NOT_FOUND]: "Cart not found",
  [ErrorCodes.ITEM_NOT_FOUND]: "Item not found",
  [ErrorCodes.ALREADY_IN_WISHLIST]: "Package already in wishlist",
  [ErrorCodes.NOT_IN_WISHLIST]: "Package not in wishlist",
  [ErrorCodes.PAYMENT_NOT_FOUND]: "Payment not found",
  [ErrorCodes.ORDER_NOT_FOUND]: "Order not found",
  [ErrorCodes.ORDER_ALREADY_PAID]: "Order has already been paid",
  [ErrorCodes.ALREADY_PAID]: "Order already paid",
};
