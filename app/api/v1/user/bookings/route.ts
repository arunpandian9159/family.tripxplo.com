import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/lib/models/Booking";
import { getUserIdFromRequest } from "@/lib/auth";
import {
  paginatedResponse,
  errorResponse,
  ErrorCodes,
  ErrorMessages,
} from "@/lib/api-response";
import { parseQueryParams } from "@/lib/api-middleware";

// GET /api/v1/user/bookings - Get user bookings
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);

    if (!userId) {
      return errorResponse(
        ErrorMessages[ErrorCodes.UNAUTHORIZED],
        ErrorCodes.UNAUTHORIZED,
        401
      );
    }

    await connectDB();

    const { page, limit } = parseQueryParams(request);
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      Booking.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Booking.countDocuments({ userId }),
    ]);

    // Map status values for frontend compatibility
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

    const formattedBookings = bookings.map((booking) => ({
      // Core IDs
      bookingId: booking.bookingId,
      bookingNumber: `TRP${booking._id.toString().slice(-8).toUpperCase()}`,

      // Package info
      packageName: booking.packageName,
      packageImg: booking.packageImg || [],
      planName: booking.planName || "Standard",
      interestName: booking.interestName,

      // Duration
      noOfDays: booking.noOfDays,
      noOfNight: booking.noOfNight,

      // Dates
      checkStartDate: booking.checkStartDate,
      checkEndDate: booking.checkEndDate,
      fullStartDate: booking.fullStartDate || booking.checkStartDate,
      fullEndDate: booking.fullEndDate || booking.checkEndDate,

      // Guest counts
      noAdult: booking.noAdult || booking.noOfAdult,
      noChild: booking.noChild || booking.noOfChild,
      noOfAdult: booking.noOfAdult,
      noOfChild: booking.noOfChild,

      // Counts
      hotelCount: booking.hotelCount || 0,
      activityCount: booking.activityCount || 0,
      vehicleCount: booking.vehicleCount || 0,

      // Pricing
      finalPrice: booking.finalPrice,
      totalPackagePrice: booking.totalPackagePrice,
      discountPrice: booking.discountPrice,

      // Status
      status: mapStatus(booking.status),
      isPrepaid: booking.isPrepaid,
      paymentStatus: booking.isPrepaid ? "paid" : "pending",

      // Destinations
      destination: booking.destination,
      startFrom: booking.startFrom,

      // Meta
      createdAt: booking.createdAt,

      // EMI Details
      emiDetails: booking.emiDetails
        ? {
            isEmiBooking: booking.emiDetails.isEmiBooking,
            totalTenure: booking.emiDetails.totalTenure,
            monthlyAmount: booking.emiDetails.monthlyAmount,
            totalAmount: booking.emiDetails.totalAmount,
            paidCount: booking.emiDetails.paidCount,
            nextDueDate: booking.emiDetails.nextDueDate,
            schedule: booking.emiDetails.schedule || [],
          }
        : undefined,
    }));

    return paginatedResponse(
      formattedBookings,
      total,
      page,
      limit,
      "Bookings retrieved successfully"
    );
  } catch (error) {
    console.error("Get user bookings error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500
    );
  }
}
