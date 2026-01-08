import { NextRequest } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth";
import {
  successResponse,
  errorResponse,
  ErrorCodes,
  ErrorMessages,
} from "@/lib/api-response";

interface RouteParams {
  params: Promise<{ paymentId: string }>;
}

// GET /api/v1/payment/:paymentId/status - Get payment status
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

    const { paymentId } = await params;
    const payment = global.paymentStore?.get(paymentId);

    if (!payment || payment.userId !== userId) {
      return errorResponse(
        ErrorMessages[ErrorCodes.PAYMENT_NOT_FOUND],
        ErrorCodes.PAYMENT_NOT_FOUND,
        404,
      );
    }

    return successResponse(
      {
        paymentId: payment.paymentId,
        orderId: payment.orderId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
      },
      "Payment status retrieved successfully",
    );
  } catch (error) {
    console.error("Get payment status error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500,
    );
  }
}
