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

interface CheckCouponBody {
  code?: string;
  couponCode?: string;
}

// POST /api/v1/package/coupon/check - Validate a coupon code
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

    const body = await parseBody<CheckCouponBody>(request);

    if (!body) {
      return errorResponse(
        "Invalid request body",
        ErrorCodes.VALIDATION_ERROR,
        400,
      );
    }

    // Support both 'code' and 'couponCode' field names
    const couponCode = body.code || body.couponCode;

    if (!couponCode) {
      return errorResponse(
        "Coupon code is required",
        ErrorCodes.VALIDATION_ERROR,
        400,
      );
    }

    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
      $or: [{ isPublic: true }, { userId }],
    }).lean();

    if (!coupon) {
      return errorResponse("Invalid coupon code", "INVALID_COUPON", 404);
    }

    // Check if coupon is expired
    if (coupon.validDate && new Date(coupon.validDate) < new Date()) {
      return errorResponse("Coupon has expired", "COUPON_EXPIRED", 400);
    }

    // Return coupon details in the format expected by the frontend
    const couponData = coupon as any;
    return successResponse(
      {
        couponId: couponData.couponId,
        couponName: couponData.couponName,
        couponCode: couponData.code,
        couponDescription: couponData.description,
        valueType: couponData.valueType,
        value: couponData.value,
        couponValidateDate: couponData.validDate,
        minOrderValue: couponData.minOrderValue || 0,
        maxDiscount: couponData.maxDiscount || null,
      },
      "Coupon is valid",
    );
  } catch (error) {
    console.error("Check coupon error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500,
    );
  }
}
