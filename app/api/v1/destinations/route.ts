import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Destination from "@/lib/models/Destination";
import {
  paginatedResponse,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";
import { parseQueryParams } from "@/lib/api-middleware";

// GET /api/v1/destinations - Get all destinations with pagination
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { page, limit } = parseQueryParams(request);
    const skip = (page - 1) * limit;

    const [destinations, total] = await Promise.all([
      Destination.find().sort({ rankNo: -1 }).skip(skip).limit(limit).lean(),
      Destination.countDocuments(),
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
      "Destinations retrieved successfully",
    );
  } catch (error) {
    console.error("Get destinations error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500,
    );
  }
}
