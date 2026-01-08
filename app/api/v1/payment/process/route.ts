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

// POST /api/v1/payment/process - Process payment
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

    const body = await parseBody<ProcessPaymentBody>(request);

    if (!body) {
      return errorResponse(
        "Invalid request body",
        ErrorCodes.VALIDATION_ERROR,
        400,
      );
    }

    const { valid, missing } = validateRequired(
      body as unknown as Record<string, unknown>,
      ["paymentId", "paymentMethod"],
    );

    if (!valid) {
      return errorResponse(
        `Missing required fields: ${missing.join(", ")}`,
        ErrorCodes.VALIDATION_ERROR,
        400,
      );
    }

    const payment = global.paymentStore?.get(body.paymentId);

    if (!payment) {
      return errorResponse(
        ErrorMessages[ErrorCodes.PAYMENT_NOT_FOUND],
        ErrorCodes.PAYMENT_NOT_FOUND,
        404,
      );
    }

    if (payment.userId !== userId) {
      return errorResponse(
        "Unauthorized payment access",
        ErrorCodes.UNAUTHORIZED,
        401,
      );
    }

    if (payment.status === "completed") {
      return errorResponse(
        "Payment already completed",
        "PAYMENT_ALREADY_COMPLETED",
        400,
      );
    }

    // Update payment status
    payment.status = "processing";
    payment.paymentMethod = body.paymentMethod;

    // Simulate successful payment
    const transactionId = `txn_${generateId()}`;
    payment.transactionId = transactionId;
    payment.status = "completed";

    global.paymentStore.set(body.paymentId, payment);

    // Update booking payment status
    await Booking.updateOne(
      { bookingId: payment.orderId, userId },
      {
        $set: {
          isPrepaid: true,
          status: "waiting",
          paymentDate: new Date().toISOString(),
        },
      },
    );

    return successResponse(
      {
        success: true,
        transactionId,
        status: "completed",
      },
      "Payment processed successfully",
    );
  } catch (error) {
    console.error("Process payment error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500,
    );
  }
}
