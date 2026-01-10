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

interface ProcessPaymentBody {
  paymentId: string;
  paymentMethod: string;
}

// POST /api/v1/emi/process - Process EMI payment
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

    const body = await parseBody<ProcessPaymentBody>(request);

    if (!body) {
      return errorResponse(
        "Invalid request body",
        ErrorCodes.VALIDATION_ERROR,
        400
      );
    }

    const { valid, missing } = validateRequired(
      body as unknown as Record<string, unknown>,
      ["paymentId", "paymentMethod"]
    );

    if (!valid) {
      return errorResponse(
        `Missing required fields: ${missing.join(", ")}`,
        ErrorCodes.VALIDATION_ERROR,
        400
      );
    }

    const payment = global.paymentStore?.get(body.paymentId);

    if (!payment) {
      return errorResponse(
        ErrorMessages[ErrorCodes.PAYMENT_NOT_FOUND],
        ErrorCodes.PAYMENT_NOT_FOUND,
        404
      );
    }

    if (payment.userId !== userId) {
      return errorResponse(
        "Unauthorized payment access",
        ErrorCodes.UNAUTHORIZED,
        401
      );
    }

    if (payment.status === "completed") {
      return errorResponse(
        "Payment already completed",
        "PAYMENT_ALREADY_COMPLETED",
        400
      );
    }

    // Update payment status
    payment.status = "processing";
    payment.paymentMethod = body.paymentMethod;

    // Simulate successful payment
    const transactionId = `txn_${generateId()}`;
    payment.transactionId = transactionId;
    payment.status = "completed";

    global.paymentStore?.set(body.paymentId, payment);

    // Update booking payment status
    const booking = await Booking.findOne({
      bookingId: payment.orderId,
      userId,
    });

    if (booking && booking.emiDetails?.isEmiBooking) {
      // Handle EMI Payment
      const isEmiPayment = payment.isEmi;
      const installmentNumber = payment.installmentNumber;

      if (!isEmiPayment) {
        return errorResponse(
          "This endpoint is for EMI payments only",
          "EMI_ONLY",
          400
        );
      }

      const schedule = booking.emiDetails.schedule;
      const installment = schedule.find(
        (s: any) => s.installmentNumber === installmentNumber
      );

      if (installment && installment.status !== "paid") {
        installment.status = "paid";
        installment.transactionId = transactionId;
        installment.paymentId = body.paymentId;
        installment.paidAt = new Date();

        booking.emiDetails.paidCount += 1;

        // Update next due date
        const nextPending = schedule.find(
          (s: any) =>
            s.status === "pending" && s.installmentNumber > installmentNumber
        );
        if (nextPending) {
          booking.emiDetails.nextDueDate = nextPending.dueDate;
        }

        // If first EMI is paid, mark booking as confirmed/waiting
        if (installmentNumber === 1 || booking.emiDetails.paidCount === 1) {
          booking.isPrepaid = true;
          booking.status = "waiting";
          booking.paymentDate = new Date().toISOString();
        }

        booking.markModified("emiDetails");
        await booking.save();
      }
    } else if (booking) {
      return errorResponse(
        "Booking is not an EMI booking",
        "NOT_EMI_BOOKING",
        400
      );
    }

    return successResponse(
      {
        success: true,
        transactionId,
        status: "completed",
        isEmiPayment: payment.isEmi,
        installmentNumber: payment.installmentNumber,
      },
      "EMI Payment processed successfully"
    );
  } catch (error) {
    console.error("Process EMI payment error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500
    );
  }
}
