import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Destination from "@/lib/models/Destination";
import { successResponse, errorResponse, ErrorCodes } from "@/lib/api-response";
import { parseQueryParams } from "@/lib/api-middleware";

// GET /api/v1/destinations/featured - Get featured destinations
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { limit } = parseQueryParams(request);

    const destinations = await Destination.find()
      .sort({ rankNo: -1 })
      .limit(limit)
      .lean();

    const formattedDestinations = destinations.map((dest) => ({
      id: dest.destinationId,
      name: dest.destinationName,
      image: dest.image,
      type: dest.destinationType,
      rankNo: dest.rankNo,
    }));

    return successResponse(
      { destinations: formattedDestinations },
      "Featured destinations retrieved successfully",
    );
  } catch (error) {
    console.error("Get featured destinations error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500,
    );
  }
}
