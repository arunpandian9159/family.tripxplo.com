import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { getUserIdFromRequest } from "@/lib/auth";
import {
  successResponse,
  errorResponse,
  ErrorCodes,
  ErrorMessages,
} from "@/lib/api-response";

interface RouteParams {
  params: Promise<{ packageId: string }>;
}

// GET /api/v1/user/wishlist/:packageId/check - Check if package is in wishlist
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const userId = getUserIdFromRequest(request);

    if (!userId) {
      return errorResponse(
        ErrorMessages[ErrorCodes.UNAUTHORIZED],
        ErrorCodes.UNAUTHORIZED,
        401,
      );
    }

    await connectDB();

    const { packageId } = await params;

    const user = await User.findOne({ userId }).lean();
    const isInWishlist = user?.wishList?.includes(packageId) || false;

    return successResponse({ isInWishlist }, "Wishlist status retrieved");
  } catch (error) {
    console.error("Check wishlist error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500,
    );
  }
}
