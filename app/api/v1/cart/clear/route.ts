import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Cart from "@/lib/models/Cart";
import { getUserIdFromRequest } from "@/lib/auth";
import {
  successResponse,
  errorResponse,
  ErrorCodes,
  ErrorMessages,
} from "@/lib/api-response";

// POST /api/v1/cart/clear - Clear cart
export async function POST(request: NextRequest) {
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

    await Cart.updateOne(
      { userId },
      {
        $set: {
          items: [],
          totalAmount: 0,
        },
      },
    );

    return successResponse(null, "Cart cleared successfully");
  } catch (error) {
    console.error("Clear cart error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500,
    );
  }
}
