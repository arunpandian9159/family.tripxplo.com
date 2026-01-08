import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/lib/models/Booking";
import { getUserIdFromRequest } from "@/lib/auth";
import {
  successResponse,
  errorResponse,
  ErrorCodes,
  ErrorMessages,
} from "@/lib/api-response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/v1/bookings/:id - Get booking details
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

    const { id } = await params;
    const booking = await Booking.findOne({ bookingId: id, userId }).lean();

    if (!booking) {
      return errorResponse(
        ErrorMessages[ErrorCodes.BOOKING_NOT_FOUND],
        ErrorCodes.BOOKING_NOT_FOUND,
        404,
      );
    }

    // Map status for frontend compatibility
    const mapStatus = (status: string) => {
      const statusMap: Record<string, string> = {
        completed: "confirmed",
        approval: "confirmed",
        waiting: "waiting",
        pending: "pending",
        failed: "failed",
        cancel: "failed",
      };
      return statusMap[status] || status;
    };

    // Return booking data in format expected by frontend components
    return successResponse(
      {
        // Core IDs
        bookingId: booking.bookingId,
        bookingNumber: `TRP${booking._id.toString().slice(-8).toUpperCase()}`,
        packageRootId: booking.packageRootId,

        // Package info
        packageName: booking.packageName,
        packageImg: booking.packageImg || [],
        planId: booking.planId,
        planName: booking.planName || "Standard",
        interestId: booking.interestId,
        interestName: booking.interestName,

        // Duration
        noOfDays: booking.noOfDays,
        noOfNight: booking.noOfNight,

        // Dates
        checkStartDate: booking.checkStartDate,
        checkEndDate: booking.checkEndDate,
        fullStartDate: booking.fullStartDate || booking.checkStartDate,
        fullEndDate: booking.fullEndDate || booking.checkEndDate,

        // Destinations and location
        destination: booking.destination || [],
        startFrom: booking.startFrom,

        // Guest counts
        noAdult: booking.noAdult || booking.noOfAdult || 0,
        noChild: booking.noChild || booking.noOfChild || 0,
        noOfAdult: booking.noOfAdult || 0,
        noOfChild: booking.noOfChild || 0,
        noExtraAdult: booking.noExtraAdult || 0,
        noRoomCount: booking.noRoomCount || 0,
        perRoom: booking.perRoom || 0,

        // Counts
        hotelCount: booking.hotelCount || 0,
        activityCount: booking.activityCount || 0,
        vehicleCount: booking.vehicleCount || 0,

        // Pricing
        finalPrice: booking.finalPrice || 0,
        totalPackagePrice: booking.totalPackagePrice || 0,
        packagePrice: booking.packagePrice || 0,
        discountPrice: booking.discountPrice || 0,
        gstPrice: booking.gstPrice || 0,
        gstPer: booking.gstPer || 5,
        perPerson: booking.perPerson || 0,
        balanceAmount: booking.balanceAmount || 0,
        redeemAmount: booking.redeemAmount || 0,
        redeemCoin: booking.redeemCoin || 0,

        // Status
        status: mapStatus(booking.status),
        isPrepaid: booking.isPrepaid || false,
        paymentStatus: booking.isPrepaid ? "paid" : "pending",
        paymentDate: booking.paymentDate,

        // Coupon
        couponCode: booking.couponCode,
        discountType: booking.discountType,
        discountValue: booking.discountValue || 0,

        // Detailed booking info
        hotelMeal: booking.hotelMeal || [],
        vehicleDetail: booking.vehicleDetail || [],
        activity: booking.activity || [],
        period: booking.period || [],

        // Meta
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      },
      "Booking retrieved successfully",
    );
  } catch (error) {
    console.error("Get booking error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500,
    );
  }
}
