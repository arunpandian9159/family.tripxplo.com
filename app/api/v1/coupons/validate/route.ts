import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Coupon from "@/lib/models/Coupon";
import { getUserIdFromRequest } from "@/lib/auth";
import {
  successResponse,
  errorResponse,
  ErrorCodes,
  ErrorMessages,
} from "@/lib/api-response";
import { parseBody, validateRequired } from "@/lib/api-middleware";

interface ValidateCouponBody {
  code: string;
}

// POST /api/v1/coupons/validate - Validate a coupon code
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

    const body = await parseBody<ValidateCouponBody>(request);

    if (!body) {
      return errorResponse(
        "Invalid request body",
        ErrorCodes.VALIDATION_ERROR,
        400,
      );
    }

    const { valid, missing } = validateRequired(
      body as unknown as Record<string, unknown>,
      ["code"],
    );

    if (!valid) {
      return errorResponse(
        `Missing required fields: ${missing.join(", ")}`,
        ErrorCodes.VALIDATION_ERROR,
        400,
      );
    }

    const coupon = await Coupon.findOne({
      code: body.code.toUpperCase(),
      $or: [{ isPublic: true }, { userId }],
    }).lean();

    if (!coupon) {
      return errorResponse("Invalid coupon code", "INVALID_COUPON", 404);
    }

    // Check if coupon is expired
    if (coupon.validDate && new Date(coupon.validDate) < new Date()) {
      return errorResponse("Coupon has expired", "COUPON_EXPIRED", 400);
    }

    return successResponse(
      {
        coupon: {
          id: coupon.couponId,
          name: coupon.couponName,
          code: coupon.code,
          description: coupon.description,
          valueType: coupon.valueType,
          value: coupon.value,
          validDate: coupon.validDate,
        },
      },
      "Coupon is valid",
    );
  } catch (error) {
    console.error("Validate coupon error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500,
    );
  }
}
