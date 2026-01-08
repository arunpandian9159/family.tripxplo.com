import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Destination from "@/lib/models/Destination";
import { successResponse, errorResponse, ErrorCodes } from "@/lib/api-response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/v1/destinations/:id - Get destination by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const { id } = await params;
    const destination = await Destination.findOne({ destinationId: id }).lean();

    if (!destination) {
      return errorResponse("Destination not found", ErrorCodes.NOT_FOUND, 404);
    }

    return successResponse(
      {
        destination: {
          id: destination.destinationId,
          name: destination.destinationName,
          image: destination.image,
          type: destination.destinationType,
          rankNo: destination.rankNo,
        },
      },
      "Destination retrieved successfully",
    );
  } catch (error) {
    console.error("Get destination error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500,
    );
  }
}
