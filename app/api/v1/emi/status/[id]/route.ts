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

// GET /api/v1/emi/status/[id] - Get EMI status for a booking or payment
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = getUserIdFromRequest(request);

    if (!userId) {
      return errorResponse(
        ErrorMessages[ErrorCodes.UNAUTHORIZED],
        ErrorCodes.UNAUTHORIZED,
        401
      );
    }

    await connectDB();

    let bookingId = id;

    // If ID is a payment ID, resolve it to booking ID
    if (id.startsWith("pay_")) {
      const payment = global.paymentStore?.get(id);
      if (!payment || payment.userId !== userId) {
        return errorResponse(
          ErrorMessages[ErrorCodes.PAYMENT_NOT_FOUND],
          ErrorCodes.PAYMENT_NOT_FOUND,
          404
        );
      }
      bookingId = payment.orderId;
    }

    const booking = await Booking.findOne({ bookingId, userId });

    if (!booking) {
      return errorResponse(
        ErrorMessages[ErrorCodes.ORDER_NOT_FOUND],
        ErrorCodes.ORDER_NOT_FOUND,
        400
      );
    }

    if (!booking.emiDetails?.isEmiBooking) {
      return errorResponse("Not an EMI booking", "NOT_EMI_BOOKING", 400);
    }

    const emiDetails = booking.emiDetails;
    const paidCount = emiDetails.paidCount;
    const totalTenure = emiDetails.totalTenure;
    const totalAmount = emiDetails.totalAmount;

    const remainingAmount =
      totalAmount -
      emiDetails.schedule
        .filter((s: any) => s.status === "paid")
        .reduce((acc: number, s: any) => acc + s.amount, 0);

    const nextInstallment = emiDetails.schedule.find(
      (s: any) => s.status === "pending"
    );

    // If we searched by paymentId, we can include payment-specific info
    let paymentInfo = {};
    if (id.startsWith("pay_")) {
      const payment = global.paymentStore?.get(id);
      if (payment) {
        paymentInfo = {
          paymentId: payment.paymentId,
          amount: payment.amount,
          status: payment.status,
          currentEmiNumber: payment.installmentNumber,
        };
      }
    }

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
        ...paymentInfo, // Include payment specific info if requested by paymentId
        orderId: booking.bookingId, // For compatibility with existing payment page
        amount: nextInstallment?.amount || emiDetails.monthlyAmount, // For compatibility
        emiMonths: totalTenure,
        emiAmount: emiDetails.monthlyAmount,
        totalAmount: totalAmount,
        currentEmiNumber: paidCount + 1,
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
