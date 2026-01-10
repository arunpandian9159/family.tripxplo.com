import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/lib/models/Booking";
import Package from "@/lib/models/Package";
import { getUserIdFromRequest, generateId } from "@/lib/auth";
import {
  successResponse,
  errorResponse,
  ErrorCodes,
  ErrorMessages,
} from "@/lib/api-response";
import { parseBody, validateRequired } from "@/lib/api-middleware";

interface CreateBookingBody {
  packageId: string;
  travelDate: string;
  adults: number;
  children?: number;
  travelers?: {
    name: string;
    age: number;
    gender: "male" | "female" | "other";
  }[];
  // Price fields from frontend
  finalPackagePrice?: number;
  totalPackagePrice?: number;
  gstPrice?: number;
  gstPer?: number;
  couponDiscount?: number;
  couponCode?: string;
  redeemCoin?: number;
  // EMI fields
  emiMonths?: number;
  emiAmount?: number;
  totalEmiAmount?: number;
}

// POST /api/v1/bookings - Create a new booking
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

    const body = await parseBody<CreateBookingBody>(request);

    if (!body) {
      return errorResponse(
        "Invalid request body",
        ErrorCodes.VALIDATION_ERROR,
        400
      );
    }

    const { valid, missing } = validateRequired(
      body as unknown as Record<string, unknown>,
      ["packageId", "travelDate", "adults", "emiMonths"]
    );

    if (!valid) {
      return errorResponse(
        `Missing required fields: ${missing.join(
          ", "
        )}. All bookings must be EMI-based.`,
        ErrorCodes.VALIDATION_ERROR,
        400
      );
    }

    // Get package details
    const pkg = await Package.findOne({ packageId: body.packageId }).lean();
    if (!pkg) {
      return errorResponse(
        ErrorMessages[ErrorCodes.PACKAGE_NOT_FOUND],
        ErrorCodes.PACKAGE_NOT_FOUND,
        404
      );
    }

    // Generate booking ID
    const bookingId = generateId();
    const bookingNumber = `TRP${Date.now().toString().slice(-8)}`;

    // Use price from frontend if provided, otherwise calculate
    // Frontend sends the actual calculated price including all components
    let totalAmount: number;
    let finalPrice: number;

    if (body.finalPackagePrice && body.finalPackagePrice > 0) {
      // Use frontend-calculated price (includes hotels, activities, GST, discounts)
      finalPrice = body.finalPackagePrice;
      totalAmount = body.totalPackagePrice || body.finalPackagePrice;
    } else {
      // Fallback: Calculate simplified price
      const basePrice = pkg.activityPrice || 10000;
      totalAmount =
        basePrice * body.adults + basePrice * 0.5 * (body.children || 0);
      finalPrice = totalAmount;
    }

    const newBooking = new Booking({
      bookingId,
      packageRootId: pkg._id.toString(),
      packageName: pkg.packageName,
      userId,
      planId: pkg.planId,
      interestId: pkg.interestId,
      destination: pkg.destination,
      startFrom: pkg.startFrom,
      packageImg: pkg.packageImg,
      noOfDays: pkg.noOfDays,
      noOfNight: pkg.noOfNight,
      noOfAdult: pkg.noOfAdult,
      noOfChild: pkg.noOfChild,
      noAdult: body.adults,
      noChild: body.children || 0,
      checkStartDate: body.travelDate,
      totalPackagePrice: totalAmount,
      finalPrice: finalPrice,
      gstPrice: body.gstPrice || 0,
      gstPer: body.gstPer || 0,
      discountPrice: body.couponDiscount || 0,
      couponCode: body.couponCode || null,
      redeemCoin: body.redeemCoin || 0,
      status: "pending",
    });

    // Initialize EMI Details (Required)
    const emiMonths = body.emiMonths || 3; // Fallback to 3 if not provided but validated above
    const emiAmount = body.emiAmount || Math.floor(finalPrice / emiMonths);
    const totalEmiAmount = body.totalEmiAmount || finalPrice;

    const schedule = [];
    const bookingDate = new Date();

    for (let i = 1; i <= emiMonths; i++) {
      const dueDate = new Date(bookingDate);
      dueDate.setDate(dueDate.getDate() + (i - 1) * 30); // 30 day cycles

      // Adjust the last installment for rounding
      let currentAmount = emiAmount;
      if (i === emiMonths) {
        currentAmount = totalEmiAmount - emiAmount * (emiMonths - 1);
      }

      schedule.push({
        installmentNumber: i,
        amount: currentAmount,
        dueDate,
        status: "pending",
      });
    }

    newBooking.emiDetails = {
      isEmiBooking: true,
      totalTenure: emiMonths,
      monthlyAmount: emiAmount,
      totalAmount: totalEmiAmount,
      paidCount: 0,
      nextDueDate: schedule[0].dueDate,
      schedule: schedule as any,
    };

    await newBooking.save();

    return successResponse(
      {
        booking: {
          id: bookingId,
          bookingNumber,
          packageId: body.packageId,
          packageName: pkg.packageName,
          packageImages: pkg.packageImg || [],
          travelDate: body.travelDate,
          noOfDays: pkg.noOfDays,
          noOfNights: pkg.noOfNight,
          adults: body.adults,
          children: body.children || 0,
          totalAmount: finalPrice, // Use finalPrice (after discounts) for payment
          totalPackagePrice: totalAmount, // Original price before discounts
          gstPrice: body.gstPrice || 0,
          couponDiscount: body.couponDiscount || 0,
          redeemCoin: body.redeemCoin || 0,
          status: "pending",
          paymentStatus: "pending",
          isEmiBooking: true,
          emiDetails: {
            monthlyAmount: newBooking.emiDetails.monthlyAmount,
            totalTenure: newBooking.emiDetails.totalTenure,
            paidCount: newBooking.emiDetails.paidCount,
          },
          createdAt: new Date(),
        },
      },
      "Booking created successfully",
      201
    );
  } catch (error) {
    console.error("Create booking error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500
    );
  }
}
