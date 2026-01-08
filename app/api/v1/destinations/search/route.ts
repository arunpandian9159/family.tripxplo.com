import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Destination from "@/lib/models/Destination";
import {
  paginatedResponse,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";
import { parseQueryParams } from "@/lib/api-middleware";

// GET /api/v1/destinations/search - Search destinations
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { page, limit, query } = parseQueryParams(request);
    const skip = (page - 1) * limit;

    const searchFilter = query
      ? { destinationName: { $regex: query, $options: "i" } }
      : {};

    const [destinations, total] = await Promise.all([
      Destination.find(searchFilter)
        .sort({ rankNo: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Destination.countDocuments(searchFilter),
    ]);

    const formattedDestinations = destinations.map((dest) => ({
      id: dest.destinationId,
      name: dest.destinationName,
      image: dest.image,
      type: dest.destinationType,
      rankNo: dest.rankNo,
    }));

    return paginatedResponse(
      formattedDestinations,
      total,
      page,
      limit,
      "Search results retrieved successfully",
    );
  } catch (error) {
    console.error("Search destinations error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500,
    );
  }
}
