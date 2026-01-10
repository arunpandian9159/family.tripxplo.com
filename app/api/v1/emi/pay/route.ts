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

interface EmiPayBody {
  bookingId: string;
  installmentNumber: number;
}

// POST /api/v1/emi/pay - Initiate payment for an EMI installment
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

    const body = await parseBody<EmiPayBody>(request);

    if (!body) {
      return errorResponse(
        "Invalid request body",
        ErrorCodes.VALIDATION_ERROR,
        400
      );
    }

    const { valid, missing } = validateRequired(
      body as unknown as Record<string, unknown>,
      ["bookingId", "installmentNumber"]
    );

    if (!valid) {
      return errorResponse(
        `Missing required fields: ${missing.join(", ")}`,
        ErrorCodes.VALIDATION_ERROR,
        400
      );
    }

    // Find booking
    const booking = await Booking.findOne({
      bookingId: body.bookingId,
      userId,
    });
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

    // Find installment
    const installment = booking.emiDetails.schedule.find(
      (s: any) => s.installmentNumber === body.installmentNumber
    );

    if (!installment) {
      return errorResponse(
        "Invalid installment number",
        "INVALID_INSTALLMENT",
        400
      );
    }

    if (installment.status === "paid") {
      return errorResponse("Installment already paid", "ALREADY_PAID", 400);
    }

    // Initialize payment entry
    const paymentId = `pay_${generateId()}`;
    const currency = "INR";

    // Store payment info in global store (as per current implementation)
    // In production, this would be a separate Payment model
    if (!global.paymentStore) {
      global.paymentStore = new Map();
    }

    global.paymentStore.set(paymentId, {
      paymentId,
      orderId: body.bookingId,
      amount: installment.amount,
      currency,
      status: "created",
      userId,
      createdAt: new Date(),
      // Track metadata for EMI
      isEmi: true,
      installmentNumber: body.installmentNumber,
      emiMonths: booking.emiDetails.totalTenure,
      emiAmount: booking.emiDetails.monthlyAmount,
      totalAmount: booking.emiDetails.totalAmount,
    });

    const origin = new URL(request.url).origin;
    const paymentUrl = `${origin}/payment/${paymentId}`;

    return successResponse(
      {
        paymentId,
        paymentUrl,
        orderId: body.bookingId,
        amount: installment.amount,
        currency,
        installmentNumber: body.installmentNumber,
        status: "created",
      },
      "EMI Payment initialized successfully",
      201
    );
  } catch (error) {
    console.error("EMI Pay error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500
    );
  }
}
