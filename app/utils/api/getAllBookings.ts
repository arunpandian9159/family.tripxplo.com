import { userApi } from "@/lib/api-client";

interface PaginatedResult {
  docs: unknown[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface BookingsApiResponse {
  success: boolean;
  result?: PaginatedResult;
  data?: {
    items: unknown[];
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
}

export const getAllBookings = async (offset: number, limit: number) => {
  try {
    const page = Math.floor(offset / limit) + 1;
    const response = (await userApi.getBookings({
      page,
      limit,
    })) as BookingsApiResponse;

    // API returns data in `result` format from paginatedResponse
    if (response.success && response.result) {
      return {
        result: {
          docs: response.result.docs || [],
          hasNextPage: response.result.hasNextPage ?? false,
          totalDocs: response.result.totalDocs,
          page: response.result.page,
          totalPages: response.result.totalPages,
        },
      };
    }

    // Fallback: check for `data` format (legacy support)
    if (response.success && response.data) {
      const data = response.data;
      return {
        result: {
          docs: data.items || [],
          hasNextPage: data.page < data.totalPages,
          totalDocs: data.total,
          page: data.page,
          totalPages: data.totalPages,
        },
      };
    }

    // Return empty result instead of rejecting
    return {
      result: {
        docs: [],
        hasNextPage: false,
        totalDocs: 0,
        page: 1,
        totalPages: 0,
      },
    };
  } catch (error) {
    console.error("Error fetching bookings:", error);
    // Return empty result on error
    return {
      result: {
        docs: [],
        hasNextPage: false,
        totalDocs: 0,
        page: 1,
        totalPages: 0,
      },
    };
  }
};
