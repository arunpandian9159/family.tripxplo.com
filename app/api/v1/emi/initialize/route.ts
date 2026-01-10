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
import { parseBody, validateRequired } from "@/lib/api-middleware";

interface EmiInitializeBody {
  bookingId: string;
  tenureMonths: number;
  emiAmount?: number;
  totalAmount?: number;
}

/**
 * POST /api/v1/emi/initialize
 * Description: Creates an EMI installment plan for an existing booking.
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

    const body = await parseBody<EmiInitializeBody>(request);

    if (!body) {
      return errorResponse(
        "Invalid request body",
        ErrorCodes.VALIDATION_ERROR,
        400
      );
    }

    const { valid, missing } = validateRequired(
      body as unknown as Record<string, unknown>,
      ["bookingId", "tenureMonths"]
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

    // Check if EMI already exists
    if (booking.emiDetails?.isEmiBooking) {
      return errorResponse(
        "EMI schedule already initialized",
        "EMI_ALREADY_EXISTS",
        400
      );
    }

    // Validate tenure
    const allowedTenures = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    if (!allowedTenures.includes(body.tenureMonths)) {
      return errorResponse(
        "Selected tenure is not supported. Must be between 3 to 16 months.",
        "INVALID_TENURE",
        400
      );
    }

    // Use price from booking or request
    const finalPrice = body.totalAmount || booking.finalPrice;
    const emiMonths = body.tenureMonths;
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

    return successResponse(
      {
        bookingId: booking.bookingId,
        emiDetails: {
          totalTenure: booking.emiDetails.totalTenure,
          monthlyAmount: booking.emiDetails.monthlyAmount,
          totalAmount: booking.emiDetails.totalAmount,
          paidCount: booking.emiDetails.paidCount,
          nextDueDate: booking.emiDetails.nextDueDate,
          schedule: booking.emiDetails.schedule.map((s: any) => ({
            installmentNumber: s.installmentNumber,
            amount: s.amount,
            dueDate: s.dueDate,
            status: s.status,
          })),
        },
      },
      "EMI schedule initialized successfully",
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
