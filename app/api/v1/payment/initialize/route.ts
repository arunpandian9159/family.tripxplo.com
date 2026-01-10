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

interface InitializePaymentBody {
  amount: number;
  orderId: string;
  currency?: string;
}

// In-memory payment store (in production, use a proper database)
// This is shared across requests via global scope
declare global {
  // eslint-disable-next-line no-var
  var paymentStore: Map<
    string,
    {
      paymentId: string;
      orderId: string;
      amount: number;
      currency: string;
      status: "created" | "processing" | "completed" | "failed";
      transactionId?: string;
      paymentMethod?: string;
      userId: string;
      createdAt: Date;
      // EMI metadata
      isEmi?: boolean;
      installmentNumber?: number;
    }
  >;
}

if (!global.paymentStore) {
  global.paymentStore = new Map();
}

// POST /api/v1/payment/initialize - Initialize payment
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

    const body = await parseBody<InitializePaymentBody>(request);

    if (!body) {
      return errorResponse(
        "Invalid request body",
        ErrorCodes.VALIDATION_ERROR,
        400
      );
    }

    const { valid, missing } = validateRequired(
      body as unknown as Record<string, unknown>,
      ["amount", "orderId"]
    );

    if (!valid) {
      return errorResponse(
        `Missing required fields: ${missing.join(", ")}`,
        ErrorCodes.VALIDATION_ERROR,
        400
      );
    }

    // Verify booking exists
    const booking = await Booking.findOne({ bookingId: body.orderId, userId });
    if (!booking) {
      return errorResponse(
        ErrorMessages[ErrorCodes.ORDER_NOT_FOUND],
        ErrorCodes.ORDER_NOT_FOUND,
        404
      );
    }

    if (booking.isPrepaid) {
      return errorResponse(
        ErrorMessages[ErrorCodes.ORDER_ALREADY_PAID],
        ErrorCodes.ORDER_ALREADY_PAID,
        400
      );
    }

    const paymentId = `pay_${generateId()}`;
    const currency = body.currency || "INR";

    // Store payment info
    global.paymentStore.set(paymentId, {
      paymentId,
      orderId: body.orderId,
      amount: body.amount,
      currency,
      status: "created",
      userId,
      createdAt: new Date(),
    });

    // In production, integrate with payment gateway (Razorpay, Stripe, etc.)
    const origin = new URL(request.url).origin;
    const paymentUrl = `${origin}/payment/${paymentId}`;

    return successResponse(
      {
        paymentId,
        paymentUrl,
        orderId: body.orderId,
        amount: body.amount,
        currency,
        status: "created",
      },
      "Payment initialized successfully",
      201
    );
  } catch (error) {
    console.error("Initialize payment error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500
    );
  }
}
