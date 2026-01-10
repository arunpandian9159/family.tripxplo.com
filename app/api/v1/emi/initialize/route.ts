import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/lib/models/Booking";
import { getUserIdFromRequest, generateId } from "@/lib/auth";
import {
  successResponse,
  errorResponse,
  ErrorCodes,
  ErrorMessages,
} from "@/lib/api-response";
import { parseBody, validateRequired } from "@/lib/api-middleware";

interface EmiInitializeBody {
  bookingId: string;
  tenureMonths: number;
  emiAmount?: number;
  totalAmount?: number;
}

/**
 * POST /api/v1/emi/initialize
 * Description: Creates an EMI installment plan for an existing booking and returns payment URL for first installment.
 * Auth: Required
 */
export async function POST(request: NextRequest) {
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

    const body = await parseBody<any>(request);

    if (!body) {
      return errorResponse(
        "Invalid request body",
        ErrorCodes.VALIDATION_ERROR,
        400
      );
    }

    // Accept both bookingId and orderId (alias used in some clients)
    const bookingId = body.bookingId || body.orderId;

    if (!bookingId) {
      return errorResponse(
        "Missing required field: bookingId or orderId",
        ErrorCodes.VALIDATION_ERROR,
        400
      );
    }

    const tenureMonths = body.tenureMonths || 6;

    // Find booking
    const booking = await Booking.findOne({
      bookingId: bookingId,
      userId,
    });

    if (!booking) {
      return errorResponse(
        ErrorMessages[ErrorCodes.ORDER_NOT_FOUND],
        ErrorCodes.ORDER_NOT_FOUND,
        404
      );
    }

    // Initialize or Update EMI schedule if not already paid
    if (
      !booking.emiDetails?.isEmiBooking ||
      booking.emiDetails.paidCount === 0
    ) {
      // Validate tenure
      const allowedTenures = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      if (!allowedTenures.includes(tenureMonths)) {
        return errorResponse(
          "Selected tenure is not supported. Must be between 3 to 16 months.",
          "INVALID_TENURE",
          400
        );
      }

      // Use price from booking or request
      const finalPrice = body.totalAmount || booking.finalPrice;
      const emiMonths = tenureMonths;
      const emiAmount = body.emiAmount || Math.floor(finalPrice / emiMonths);
      const totalAmount = body.totalAmount || finalPrice;

      const schedule = [];
      const bookingDate = new Date();

      for (let i = 1; i <= emiMonths; i++) {
        const dueDate = new Date(bookingDate);
        dueDate.setDate(dueDate.getDate() + (i - 1) * 30); // 30 day cycles

        // Adjust the last installment for rounding
        let currentAmount = emiAmount;
        if (i === emiMonths) {
          currentAmount = totalAmount - emiAmount * (emiMonths - 1);
        }

        schedule.push({
          installmentNumber: i,
          amount: currentAmount,
          dueDate,
          status: "pending",
        });
      }

      // Update booking with EMI details
      booking.emiDetails = {
        isEmiBooking: true,
        totalTenure: emiMonths,
        monthlyAmount: emiAmount,
        totalAmount: totalAmount,
        paidCount: 0,
        nextDueDate: schedule[0].dueDate,
        schedule: schedule as any,
      };

      booking.markModified("emiDetails");
      await booking.save();
    }

    // Always return payment URL for the first unpaid installment
    const firstUnpaid = booking.emiDetails.schedule.find(
      (s: any) => s.status === "pending"
    );

    if (!firstUnpaid) {
      return errorResponse("All installments already paid", "ALL_PAID", 400);
    }

    // Initialize payment session
    const paymentId = `pay_${generateId()}`;
    if (!global.paymentStore) {
      global.paymentStore = new Map();
    }

    global.paymentStore.set(paymentId, {
      paymentId,
      orderId: booking.bookingId,
      amount: firstUnpaid.amount,
      currency: "INR",
      status: "created",
      userId,
      createdAt: new Date(),
      isEmi: true,
      installmentNumber: firstUnpaid.installmentNumber,
      emiMonths: booking.emiDetails.totalTenure,
      emiAmount: booking.emiDetails.monthlyAmount,
      totalAmount: booking.emiDetails.totalAmount,
    });

    const origin = new URL(request.url).origin;
    const paymentUrl = `${origin}/payment/${paymentId}`;

    return successResponse(
      {
        bookingId: booking.bookingId,
        paymentId,
        paymentUrl,
        amount: firstUnpaid.amount,
        installmentNumber: firstUnpaid.installmentNumber,
        emiDetails: {
          totalTenure: booking.emiDetails.totalTenure,
          monthlyAmount: booking.emiDetails.monthlyAmount,
          totalAmount: booking.emiDetails.totalAmount,
          paidCount: booking.emiDetails.paidCount,
          nextDueDate: booking.emiDetails.nextDueDate,
        },
      },
      "EMI initialized and payment session created",
      201
    );
  } catch (error) {
    console.error("EMI Initialize error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500
    );
  }
}
