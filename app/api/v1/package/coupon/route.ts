import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Coupon from "@/lib/models/Coupon";
import { getUserIdFromRequest } from "@/lib/auth";
import { successResponse, errorResponse, ErrorCodes } from "@/lib/api-response";

// GET /api/v1/package/coupon - Get available coupons for booking
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);

    await connectDB();

    // Get all public coupons and user-specific coupons
    const coupons = (await Coupon.find({
      $or: [{ isPublic: true }, { userId: userId || "none" }],
    }).lean()) as any[];

    // Filter out expired coupons in JavaScript to avoid TypeScript issues
    const now = new Date();
    const validCoupons = coupons.filter((coupon) => {
      if (!coupon.validDate) return true; // No expiry date
      const expiryDate = new Date(coupon.validDate);
      return expiryDate >= now;
    });

    // Format coupons for response - using field names expected by CouponSelect component
    const formattedCoupons = validCoupons.map((coupon) => ({
      couponId: coupon.couponId,
      couponName: coupon.couponName,
      couponCode: coupon.code,
      couponDescription: coupon.description,
      couponValueType: coupon.valueType,
      couponValue: coupon.value,
      couponValidateDate: coupon.validDate,
      minOrderValue: coupon.minOrderValue || 0,
      maxDiscount: coupon.maxDiscount || null,
    }));

    return successResponse(formattedCoupons, "Coupons fetched successfully");
  } catch (error) {
    console.error("Get coupons error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500,
    );
  }
}
