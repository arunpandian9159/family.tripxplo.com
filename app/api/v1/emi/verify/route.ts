import { NextRequest } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth";
import {
  successResponse,
  errorResponse,
  ErrorCodes,
  ErrorMessages,
} from "@/lib/api-response";
import { parseBody, validateRequired } from "@/lib/api-middleware";

interface VerifyPaymentBody {
  paymentId: string;
  transactionId: string;
}

// POST /api/v1/emi/verify - Verify EMI payment
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

    const body = await parseBody<VerifyPaymentBody>(request);

    if (!body) {
      return errorResponse(
        "Invalid request body",
        ErrorCodes.VALIDATION_ERROR,
        400
      );
    }

    const { valid, missing } = validateRequired(
      body as unknown as Record<string, unknown>,
      ["paymentId", "transactionId"]
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

    const verified =
      payment.status === "completed" &&
      payment.transactionId === body.transactionId;

    return successResponse(
      {
        verified,
        status: payment.status,
        orderId: payment.orderId,
        isEmi: payment.isEmi,
        installmentNumber: payment.installmentNumber,
      },
      "EMI Payment verification completed"
    );
  } catch (error) {
    console.error("Verify EMI payment error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500
    );
  }
}
