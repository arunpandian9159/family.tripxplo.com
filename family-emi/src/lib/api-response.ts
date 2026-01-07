import { NextResponse } from 'next/server';

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
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status }
  );
}

/**
 * Error response helper
 */
export function errorResponse(
  error: string,
  code?: string,
  status: number = 400
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
      code,
    },
    { status }
  );
}

/**
 * Paginated response helper
 */
export function paginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
  message?: string,
  options?: { hasNextPage?: boolean; offset?: number }
): NextResponse {
  const totalPages = Math.ceil(total / limit);
  const offset = options?.offset ?? (page - 1) * limit;
  
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
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}

/**
 * Common error codes
 */
export const ErrorCodes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  PACKAGE_NOT_FOUND: 'PACKAGE_NOT_FOUND',
} as const;

