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

// GET /api/v1/emi/status/[id] - Get EMI status for a booking
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params;
    const userId = getUserIdFromRequest(request);

    if (!userId) {
      return errorResponse(
        ErrorMessages[ErrorCodes.UNAUTHORIZED],
        ErrorCodes.UNAUTHORIZED,
        401
      );
    }

    await connectDB();

    if (!bookingId) {
      return errorResponse(
        "Booking ID is required",
        ErrorCodes.VALIDATION_ERROR,
        400
      );
    }

    const booking = await Booking.findOne({ bookingId, userId });

    if (!booking) {
      return errorResponse(
        ErrorMessages[ErrorCodes.ORDER_NOT_FOUND],
        ErrorCodes.ORDER_NOT_FOUND,
        404
      );
    }

    if (!booking.emiDetails?.isEmiBooking) {
      return errorResponse("Not an EMI booking", "NOT_EMI_BOOKING", 400);
    }

    const emiDetails = booking.emiDetails;
    const paidCount = emiDetails.paidCount;
    const totalTenure = emiDetails.totalTenure;
    const totalAmount = emiDetails.totalAmount;
    const monthlyAmount = emiDetails.monthlyAmount;

    const remainingAmount =
      totalAmount -
      emiDetails.schedule
        .filter((s: any) => s.status === "paid")
        .reduce((acc: number, s: any) => acc + s.amount, 0);

    const nextInstallment = emiDetails.schedule.find(
      (s: any) => s.status === "pending"
    );

    return successResponse(
      {
        bookingId: booking.bookingId,
        packageName: booking.packageName,
        status:
          paidCount === totalTenure
            ? "fully_paid"
            : paidCount > 0
            ? "partially_paid"
            : "not_started",
        progress: {
          paidCount,
          totalTenure,
          remainingAmount,
          totalAmount,
        },
        nextInstallment: nextInstallment
          ? {
              installmentNumber: nextInstallment.installmentNumber,
              amount: nextInstallment.amount,
              dueDate: nextInstallment.dueDate,
            }
          : null,
        schedule: emiDetails.schedule.map((s: any) => ({
          installmentNumber: s.installmentNumber,
          amount: s.amount,
          dueDate: s.dueDate,
          status: s.status,
          paidAt: s.paidAt,
        })),
      },
      "EMI status retrieved successfully"
    );
  } catch (error) {
    console.error("EMI status error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500
    );
  }
}
