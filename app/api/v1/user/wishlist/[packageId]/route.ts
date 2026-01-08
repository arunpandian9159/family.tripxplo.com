import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import Package from "@/lib/models/Package";
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

// POST /api/v1/user/wishlist/:packageId - Add to wishlist
export async function POST(request: NextRequest, { params }: RouteParams) {
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

    // Check if package exists
    const pkg = await Package.findOne({ packageId });
    if (!pkg) {
      return errorResponse(
        ErrorMessages[ErrorCodes.PACKAGE_NOT_FOUND],
        ErrorCodes.PACKAGE_NOT_FOUND,
        404,
      );
    }

    // Check if already in wishlist
    const user = await User.findOne({ userId });
    if (user?.wishList?.includes(packageId)) {
      return errorResponse(
        ErrorMessages[ErrorCodes.ALREADY_IN_WISHLIST],
        ErrorCodes.ALREADY_IN_WISHLIST,
        409,
      );
    }

    // Add to wishlist
    await User.updateOne({ userId }, { $addToSet: { wishList: packageId } });

    return successResponse(null, "Added to wishlist successfully", 201);
  } catch (error) {
    console.error("Add to wishlist error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500,
    );
  }
}

// DELETE /api/v1/user/wishlist/:packageId - Remove from wishlist
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    // Check if in wishlist
    const user = await User.findOne({ userId });
    if (!user?.wishList?.includes(packageId)) {
      return errorResponse(
        ErrorMessages[ErrorCodes.NOT_IN_WISHLIST],
        ErrorCodes.NOT_IN_WISHLIST,
        404,
      );
    }

    // Remove from wishlist
    await User.updateOne({ userId }, { $pull: { wishList: packageId } });

    return successResponse(null, "Removed from wishlist successfully");
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500,
    );
  }
}
