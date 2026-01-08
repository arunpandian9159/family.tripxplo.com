import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "./auth";
import { errorResponse, ErrorCodes, ErrorMessages } from "./api-response";

export type ApiHandler = (
  request: NextRequest,
  context: { params: Record<string, string>; userId?: string },
) => Promise<NextResponse>;

/**
 * Middleware to require authentication
 */
export function withAuth(handler: ApiHandler): ApiHandler {
  return async (
    request: NextRequest,
    context: { params: Record<string, string> },
  ) => {
    const userId = getUserIdFromRequest(request);

    if (!userId) {
      return errorResponse(
        ErrorMessages[ErrorCodes.UNAUTHORIZED],
        ErrorCodes.UNAUTHORIZED,
        401,
      );
    }

    return handler(request, { ...context, userId });
  };
}

/**
 * Parse query parameters
 */
export function parseQueryParams(request: NextRequest): {
  page: number;
  limit: number;
  query?: string;
  [key: string]: string | number | undefined;
} {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const query =
    url.searchParams.get("q") || url.searchParams.get("query") || undefined;

  const params: Record<string, string | number | undefined> = {
    page: Math.max(1, page),
    limit: Math.min(100, Math.max(1, limit)),
    query,
  };

  // Add all other query params
  url.searchParams.forEach((value, key) => {
    if (!["page", "limit", "q", "query"].includes(key)) {
      params[key] = value;
    }
  });

  return params as {
    page: number;
    limit: number;
    query?: string;
    [key: string]: string | number | undefined;
  };
}

/**
 * Parse request body safely
 */
export async function parseBody<T>(request: NextRequest): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

/**
 * Validate required fields
 */
export function validateRequired(
  data: Record<string, unknown>,
  fields: string[],
): { valid: boolean; missing: string[] } {
  const missing = fields.filter(
    (field) =>
      data[field] === undefined || data[field] === null || data[field] === "",
  );
  return {
    valid: missing.length === 0,
    missing,
  };
}
