import { packagesApi } from '@/lib/api-client';

export interface GetPackageQueryType {
  destinationId?: string;
  interestId?: string;
  planId?: string;
  perRoom?: number;
  priceOrder?: number;
  startDate?: string;
  noAdult?: number;
  noChild?: number;
  noRoomCount?: number;
  noExtraAdult?: number;
  offset?: number;
  limit?: number;
}

export const getPackages = async (payload: GetPackageQueryType) => {
  try {
    // Convert payload to query params format
    const params: Record<string, string | number> = {};
    
    if (payload.destinationId) params.destinationId = payload.destinationId;
    if (payload.interestId) params.interestId = payload.interestId;
    if (payload.planId) params.planId = payload.planId;
    if (payload.perRoom !== undefined) params.perRoom = payload.perRoom;
    if (payload.startDate) params.startDate = payload.startDate;
    if (payload.noAdult !== undefined) params.noAdult = payload.noAdult;
    if (payload.noChild !== undefined) params.noChild = payload.noChild;
    if (payload.noRoomCount !== undefined) params.noRoomCount = payload.noRoomCount;
    if (payload.noExtraAdult !== undefined) params.noExtraAdult = payload.noExtraAdult;
    if (payload.limit) params.limit = payload.limit;
    if (payload.offset !== undefined) params.offset = payload.offset;
    if (payload.priceOrder !== undefined) params.priceOrder = payload.priceOrder;
    
    const response = await packagesApi.list(params);
    
    // Response now matches external API format: { success, result: { docs, totalDocs, hasNextPage, ... } }
    if (response.success && response.result) {
      const result = response.result as { docs: unknown[]; totalDocs: number; hasNextPage: boolean };
      return {
        result: {
          docs: result.docs || [],
          hasNextPage: result.hasNextPage ?? false,
          totalDocs: result.totalDocs ?? 0,
        },
      };
    }
    
    // Fallback for old format (data.items)
    if (response.success && response.data) {
      const data = response.data as { items?: unknown[]; docs?: unknown[]; total?: number; totalDocs?: number; hasNextPage?: boolean; page?: number; totalPages?: number };
      return {
        result: {
          docs: data.docs || data.items || [],
          hasNextPage: data.hasNextPage ?? (data.page ? data.page < (data.totalPages || 1) : false),
          totalDocs: data.totalDocs ?? data.total ?? 0,
        },
      };
    }
    
    return {
      result: {
        docs: [],
        hasNextPage: false,
        totalDocs: 0,
      },
    };
  } catch (error) {
    console.error('Error fetching packages:', error);
    return {
      result: {
        docs: [],
        hasNextPage: false,
        totalDocs: 0,
      },
    };
  }
};
