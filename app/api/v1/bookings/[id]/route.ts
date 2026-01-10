import { NextRequest } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Booking from "@/lib/models/Booking";
import Package from "@/lib/models/Package";
import Vehicle from "@/lib/models/Vehicle";
import Activity from "@/lib/models/Activity";
import HotelRoom from "@/lib/models/HotelRoom";
import Hotel from "@/lib/models/Hotel";
import Inclusion from "@/lib/models/Inclusion";
import Exclusion from "@/lib/models/Exclusion";
import { getUserIdFromRequest } from "@/lib/auth";
import {
  successResponse,
  errorResponse,
  ErrorCodes,
  ErrorMessages,
} from "@/lib/api-response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/v1/bookings/:id - Get booking details
export async function GET(request: NextRequest, { params }: RouteParams) {
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

    const { id } = await params;
    const booking = await Booking.findOne({ bookingId: id, userId }).lean();

    if (!booking) {
      return errorResponse(
        ErrorMessages[ErrorCodes.BOOKING_NOT_FOUND],
        ErrorCodes.BOOKING_NOT_FOUND,
        404
      );
    }

    // Map status for frontend compatibility
    const mapStatus = (status: string) => {
      const statusMap: Record<string, string> = {
        completed: "confirmed",
        approval: "confirmed",
        waiting: "waiting",
        pending: "pending",
        failed: "failed",
        cancel: "failed",
      };
      return statusMap[status] || status;
    };

    // Hydrate booking status with package details if needed
    let hotelMeal = booking.hotelMeal || [];
    let activity = booking.activity || [];
    let vehicleDetail = booking.vehicleDetail || [];
    let inclusionDetail = (booking as any).inclusionDetail || [];
    let exclusionDetail = (booking as any).exclusionDetail || [];

    // Try to get missing details from the original package
    if (booking.packageRootId) {
      const pkg = await (Package as any).findById(booking.packageRootId).lean();
      if (pkg) {
        // Hydrate hotels
        const hotelRoomIds = hotelMeal.map((hm: any) => hm.hotelRoomId);
        const rooms = await (HotelRoom as any)
          .find({ hotelRoomId: { $in: hotelRoomIds } })
          .lean();
        const hotelIds = rooms.map((r: any) => r.hotelId);
        const hotels = await (Hotel as any)
          .find({ hotelId: { $in: hotelIds } })
          .lean();

        hotelMeal = hotelMeal.map((bm: any) => {
          const room = rooms.find((r: any) => r.hotelRoomId === bm.hotelRoomId);
          const hotelDetail = room
            ? hotels.find((h: any) => h.hotelId === room.hotelId)
            : null;

          return {
            ...bm,
            hotelName: bm.hotelName || hotelDetail?.hotelName,
            image: bm.image || hotelDetail?.image,
            hotelRoomType: bm.hotelRoomType || room?.hotelRoomType,
            viewPoint: bm.viewPoint || hotelDetail?.viewPoint,
            location: bm.location || hotelDetail?.location,
            review: bm.review || hotelDetail?.review,
            isAc: bm.isAc !== undefined ? bm.isAc : room?.isAc,
            hotelId: bm.hotelId || hotelDetail?.hotelId,
          };
        });

        // Hydrate activities
        // Get all activity IDs from the package template to fetch their details
        const activityIds = (pkg.activity || []).flatMap((a: any) =>
          (a.event || []).map((e: any) => e.activityId)
        );
        const allActivities = await (Activity as any)
          .find({ activityId: { $in: activityIds } })
          .lean();

        activity = activity.map((ba: any) => {
          return {
            ...ba,
            event: (ba.event || []).map((be: any) => {
              const pe = allActivities.find(
                (a: any) => a.activityId === be.activityId
              );
              if (pe) {
                return {
                  ...be,
                  name: be.name || pe.name,
                  image: be.image || pe.image,
                  description: be.description || pe.description,
                };
              }
              return be;
            }),
          };
        });

        // Hydrate vehicles
        const vehicleIds = vehicleDetail.map((bv: any) =>
          typeof bv === "string" ? bv : bv.vehicleId || bv._id
        );

        // Filter valid ObjectIds to avoid Mongoose casting errors for UUIDs
        const validObjectIds = vehicleIds.filter((id: string) =>
          mongoose.Types.ObjectId.isValid(id)
        );

        const allVehicles = await (Vehicle as any)
          .find({
            $or: [
              { vehicleId: { $in: vehicleIds } },
              { _id: { $in: validObjectIds } },
            ],
          })
          .lean();

        vehicleDetail = vehicleDetail.map((bv: any) => {
          const vId = typeof bv === "string" ? bv : bv.vehicleId || bv._id;
          const pv = allVehicles.find(
            (v: any) => v.vehicleId === vId || v._id?.toString() === vId
          );
          if (pv) {
            return {
              ...pv,
              ...(typeof bv === "object" ? bv : {}),
            };
          }
          return bv;
        });

        // Hydrate inclusions/exclusions if they are empty
        if (
          inclusionDetail.length === 0 &&
          pkg.inclusion &&
          pkg.inclusion.length > 0
        ) {
          inclusionDetail = await (Inclusion as any)
            .find({ inclusionId: { $in: pkg.inclusion } })
            .lean();
        }
        if (
          exclusionDetail.length === 0 &&
          pkg.exclusion &&
          pkg.exclusion.length > 0
        ) {
          exclusionDetail = await (Exclusion as any)
            .find({ exclusionId: { $in: pkg.exclusion } })
            .lean();
        }
      }
    }

    // Return booking data in format expected by frontend components
    return successResponse(
      {
        // Core IDs
        bookingId: booking.bookingId,
        bookingNumber: `TRP${booking._id.toString().slice(-8).toUpperCase()}`,
        packageRootId: booking.packageRootId,

        // Package info
        packageName: booking.packageName,
        packageImg: booking.packageImg || [],
        planId: booking.planId,
        planName: booking.planName || "Standard",
        interestId: booking.interestId,
        interestName: booking.interestName,

        // Duration
        noOfDays: booking.noOfDays,
        noOfNight: booking.noOfNight,

        // Dates
        checkStartDate: booking.checkStartDate,
        checkEndDate: booking.checkEndDate,
        fullStartDate: booking.fullStartDate || booking.checkStartDate,
        fullEndDate: booking.fullEndDate || booking.checkEndDate,

        // Destinations and location
        destination: booking.destination || [],
        startFrom: booking.startFrom,

        // Guest counts
        noAdult: booking.noAdult || booking.noOfAdult || 0,
        noChild: booking.noChild || booking.noOfChild || 0,
        noOfAdult: booking.noOfAdult || 0,
        noOfChild: booking.noOfChild || 0,
        noExtraAdult: booking.noExtraAdult || 0,
        noRoomCount: booking.noRoomCount || 0,
        perRoom: booking.perRoom || 0,

        // Counts
        hotelCount: booking.hotelCount || 0,
        activityCount: booking.activityCount || 0,
        vehicleCount: booking.vehicleCount || 0,

        // Pricing
        finalPrice: booking.finalPrice || 0,
        totalPackagePrice: booking.totalPackagePrice || 0,
        packagePrice: booking.packagePrice || 0,
        discountPrice: booking.discountPrice || 0,
        gstPrice: booking.gstPrice || 0,
        gstPer: booking.gstPer || 5,
        perPerson: booking.perPerson || 0,
        balanceAmount: booking.balanceAmount || 0,
        redeemAmount: booking.redeemAmount || 0,
        redeemCoin: booking.redeemCoin || 0,

        // Status
        status: mapStatus(booking.status),
        isPrepaid: booking.isPrepaid || false,
        paymentStatus: booking.isPrepaid ? "paid" : "pending",
        paymentDate: booking.paymentDate,

        // Coupon
        couponCode: booking.couponCode,
        discountType: booking.discountType,
        discountValue: booking.discountValue || 0,

        // Detailed booking info
        hotelMeal,
        vehicleDetail,
        activity,
        inclusionDetail,
        exclusionDetail,
        period: booking.period || [],

        // Meta
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,

        // EMI
        isEmiBooking: booking.emiDetails?.isEmiBooking || false,
        emiMonths: booking.emiDetails?.totalTenure || 0,
        emiAmount: booking.emiDetails?.monthlyAmount || 0,
        paidEmis: booking.emiDetails?.paidCount || 0,
        emiDetails: booking.emiDetails,
      },
      "Booking retrieved successfully"
    );
  } catch (error) {
    console.error("Get booking error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500
    );
  }
}
