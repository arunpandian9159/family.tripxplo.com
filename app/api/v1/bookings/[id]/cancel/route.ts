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

import { parseBody } from "@/lib/api-middleware";

interface CancelBookingBody {
  reason?: string;
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/v1/bookings/:id/cancel - Cancel booking
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

    const { id } = await params;
    const body = await parseBody<CancelBookingBody>(request);

    const booking = await Booking.findOne({ bookingId: id, userId });

    if (!booking) {
      return errorResponse(
        ErrorMessages[ErrorCodes.BOOKING_NOT_FOUND],
        ErrorCodes.BOOKING_NOT_FOUND,
        404,
      );
    }

    if (booking.status === "cancel") {
      return errorResponse(
        ErrorMessages[ErrorCodes.ALREADY_CANCELLED],
        ErrorCodes.ALREADY_CANCELLED,
        400,
      );
    }

    if (booking.status === "completed") {
      return errorResponse(
        "Cannot cancel completed booking",
        "BOOKING_COMPLETED",
        400,
      );
    }

    // Calculate refund
    let refundAmount = 0;
    if (booking.isPrepaid) {
      // 80% refund if cancelled
      refundAmount = booking.finalPrice * 0.8;
    }

    booking.status = "cancel";
    await booking.save();

    return successResponse(
      {
        booking: {
          id: booking.bookingId,
          bookingNumber: `TRP${booking._id.toString().slice(-8).toUpperCase()}`,
          packageId: booking.packageRootId,
          packageName: booking.packageName,
          packageImages: booking.packageImg || [],
          travelDate: booking.checkStartDate,
          noOfDays: booking.noOfDays,
          noOfNights: booking.noOfNight,
          adults: booking.noAdult || booking.noOfAdult,
          children: booking.noChild || booking.noOfChild,
          totalAmount: booking.finalPrice,
          status: booking.status,
          paymentStatus: booking.isPrepaid ? "refunded" : "pending",
          createdAt: booking.createdAt,
          destinations: booking.destination,
        },
        refundAmount,
        cancellationReason: body?.reason,
      },
      "Booking cancelled successfully",
    );
  } catch (error) {
    console.error("Cancel booking error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500,
    );
  }
}
