import { NextRequest } from 'next/server';

/**
 * Parse query parameters from request
 */
export function parseQueryParams(request: NextRequest): {
  page: number;
  limit: number;
  query?: string;
  [key: string]: string | number | undefined;
} {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const query = url.searchParams.get('q') || url.searchParams.get('query') || undefined;

  const params: Record<string, string | number | undefined> = {
    page: Math.max(1, page),
    limit: Math.min(100, Math.max(1, limit)),
    query,
  };

  // Add all other query params
  url.searchParams.forEach((value, key) => {
    if (!['page', 'limit', 'q', 'query'].includes(key)) {
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
