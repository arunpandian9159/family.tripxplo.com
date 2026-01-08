import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Interest from "@/lib/models/Interest";
import { successResponse, errorResponse, ErrorCodes } from "@/lib/api-response";
import { parseQueryParams } from "@/lib/api-middleware";

// GET /api/v1/interests - Get all interests
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { limit } = parseQueryParams(request);

    const interests = await Interest.find()
      .sort({ sort: -1 })
      .limit(limit)
      .lean();

    const formattedInterests = interests.map((interest) => ({
      id: interest.interestId,
      name: interest.interestName,
      image: interest.image,
      sort: interest.sort,
      perRoom: interest.perRoom,
      isFirst: interest.isFirst,
    }));

    return successResponse(
      { interests: formattedInterests },
      "Interests retrieved successfully",
    );
  } catch (error) {
    console.error("Get interests error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500,
    );
  }
}
