import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import Package from "@/lib/models/Package";
import HotelRoom from "@/lib/models/HotelRoom";
import Vehicle from "@/lib/models/Vehicle";
import { getUserIdFromRequest } from "@/lib/auth";
import {
  successResponse,
  errorResponse,
  ErrorCodes,
  ErrorMessages,
} from "@/lib/api-response";

// Default params for wishlist price calculation
const DEFAULT_PARAMS = {
  noAdult: 2,
  noChild: 0,
  noRoomCount: 1,
  noExtraAdult: 0,
};

// Calculate hotel meal pricing - simplified version for wishlist
function calculateHotelMealPricing(
  hotelRoomData: {
    hotelRoomId: string;
    mealPlan: Array<{
      mealPlan: string;
      roomPrice: number;
      gstPer: number;
      adultPrice: number;
      childPrice: number;
    }>;
  }[],
  packageHotel: { hotelRoomId: string; mealPlan: string; noOfNight: number }[],
) {
  const hotelMealDetails: Array<{
    totalAdultPrice: number;
    gstAdultPrice: number;
    totalChildPrice: number;
    gstChildPrice: number;
    totalExtraAdultPrice: number;
    gstExtraAdultPrice: number;
  }> = [];

  for (const hotel of packageHotel) {
    const roomData = hotelRoomData.find(
      (r) => r.hotelRoomId === hotel.hotelRoomId,
    );
    if (!roomData) continue;

    // Find matching meal plan
    const selectedMealPlan = roomData.mealPlan.find(
      (mp) => mp.mealPlan === hotel.mealPlan,
    );
    if (!selectedMealPlan) continue;

    const noOfNight = hotel.noOfNight;
    const noRoomCount = DEFAULT_PARAMS.noRoomCount;
    const noChild = DEFAULT_PARAMS.noChild;
    const noExtraAdult = DEFAULT_PARAMS.noExtraAdult;

    // Calculate prices
    const totalAdultPrice =
      selectedMealPlan.roomPrice * noRoomCount * noOfNight;
    const gstAdultPrice = Math.round(
      totalAdultPrice * (selectedMealPlan.gstPer / 100),
    );

    const totalChildPrice = selectedMealPlan.childPrice * noChild * noOfNight;
    const gstChildPrice = Math.round(
      totalChildPrice * (selectedMealPlan.gstPer / 100),
    );

    const totalExtraAdultPrice =
      selectedMealPlan.adultPrice * noExtraAdult * noOfNight;
    const gstExtraAdultPrice = Math.round(
      totalExtraAdultPrice * (selectedMealPlan.gstPer / 100),
    );

    hotelMealDetails.push({
      totalAdultPrice,
      gstAdultPrice,
      totalChildPrice,
      gstChildPrice,
      totalExtraAdultPrice,
      gstExtraAdultPrice,
    });
  }

  return hotelMealDetails;
}

// GET /api/v1/user/wishlist - Get user wishlist
export async function GET(request: NextRequest) {
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

    const user = await User.findOne({ userId }).lean();

    if (!user || !user.wishList || user.wishList.length === 0) {
      return successResponse(
        { wishlist: [] },
        "Wishlist retrieved successfully",
      );
    }

    // Get packages with destination and plan details
    const packages = await Package.aggregate([
      { $match: { packageId: { $in: user.wishList }, status: true } },
      {
        $lookup: {
          from: "destination",
          localField: "destination.destinationId",
          foreignField: "destinationId",
          as: "destinationDetails",
        },
      },
      {
        $lookup: {
          from: "plan",
          localField: "planId",
          foreignField: "planId",
          as: "planDetails",
        },
      },
      {
        $addFields: {
          destinations: {
            $map: {
              input: "$destination",
              as: "d",
              in: {
                id: "$$d.destinationId",
                noOfNights: "$$d.noOfNight",
              },
            },
          },
          planName: { $arrayElemAt: ["$planDetails.planName", 0] },
        },
      },
    ]);

    // Get hotel room details for price calculation
    const allHotelRoomIds = packages.flatMap(
      (p) => p.hotel?.map((h: { hotelRoomId: string }) => h.hotelRoomId) || [],
    );
    const hotelRoomData = await HotelRoom.find({
      hotelRoomId: { $in: allHotelRoomIds },
    }).lean();

    // Get vehicle details for price calculation
    const allVehicleIds = packages.flatMap((p) => p.vehicle || []);
    const vehicleData = await Vehicle.find({
      vehicleId: { $in: allVehicleIds },
    }).lean();

    // Calculate prices for each package
    const wishlist = packages.map((pkg) => {
      // Calculate hotel meal pricing
      const hotelMeal = calculateHotelMealPricing(
        hotelRoomData as {
          hotelRoomId: string;
          mealPlan: Array<{
            mealPlan: string;
            roomPrice: number;
            gstPer: number;
            adultPrice: number;
            childPrice: number;
          }>;
        }[],
        pkg.hotel || [],
      );

      // Get vehicle details for this package
      const vehicleDetail = vehicleData
        .filter((v) => pkg.vehicle?.includes(v.vehicleId))
        .map((v) => ({ price: v.price || 0 }));

      // Calculate totals
      const totalRoomPrice = hotelMeal.reduce(
        (total, hm) =>
          total +
          (hm.totalAdultPrice || 0) +
          (hm.totalChildPrice || 0) +
          (hm.totalExtraAdultPrice || 0) +
          (hm.gstAdultPrice || 0) +
          (hm.gstChildPrice || 0) +
          (hm.gstExtraAdultPrice || 0),
        0,
      );

      const totalAdditionalFee =
        (pkg.noOfNight || 0) *
        DEFAULT_PARAMS.noRoomCount *
        (pkg.additionalFees || 0);
      const totalTransportFee =
        (pkg.transPer || 0) *
        (DEFAULT_PARAMS.noAdult +
          DEFAULT_PARAMS.noExtraAdult +
          DEFAULT_PARAMS.noChild);
      const totalVehiclePrice = vehicleDetail.reduce(
        (total, v) => total + (v.price || 0),
        0,
      );

      // Calculate activity price
      let totalActivityPrice = pkg.activityPrice || 0;
      if (totalActivityPrice === 0) {
        totalActivityPrice = (pkg.activity || []).reduce(
          (total: number, act: { event: Array<{ price?: number }> }) => {
            const eventTotal = (act.event || []).reduce(
              (evtTotal: number, evt: { price?: number }) =>
                evtTotal + (evt.price || 0),
              0,
            );
            return total + eventTotal;
          },
          0,
        );
      }

      const marketingPer = pkg.marketingPer || 0;
      const agentCommissionPer = pkg.agentCommissionPer || 0;

      const totalCalculationPrice =
        totalRoomPrice +
        totalAdditionalFee +
        totalTransportFee +
        marketingPer +
        totalVehiclePrice +
        totalActivityPrice;
      const agentAmount = Math.round(
        totalCalculationPrice * (agentCommissionPer / 100),
      );
      const totalPackagePrice = totalCalculationPrice + agentAmount;

      const totalAdultCount =
        DEFAULT_PARAMS.noAdult + DEFAULT_PARAMS.noExtraAdult;

      // Calculate perPerson
      let perPerson =
        totalAdultCount > 0
          ? Math.round(totalPackagePrice / totalAdultCount)
          : totalPackagePrice;
      if (perPerson <= 0 && pkg.activityPrice > 0) {
        perPerson = pkg.activityPrice;
      }

      // Calculate counts
      const hotelCount = hotelMeal.length || pkg.hotel?.length || 0;
      const vehicleCount = vehicleDetail.length || pkg.vehicle?.length || 0;
      const activityCount = pkg.activity?.length || 0;

      return {
        packageId: pkg.packageId,
        name: pkg.packageName,
        images: pkg.packageImg || [],
        noOfDays: pkg.noOfDays,
        noOfNights: pkg.noOfNight,
        startFrom:
          typeof pkg.startFrom === "string"
            ? parseFloat(pkg.startFrom) || 0
            : pkg.startFrom || 0,
        perPerson: perPerson,
        offer: pkg.offer || 0,
        destinations: pkg.destinations || [],
        hotelCount,
        vehicleCount,
        activityCount,
        planName: pkg.planName || null,
      };
    });

    return successResponse({ wishlist }, "Wishlist retrieved successfully");
  } catch (error) {
    console.error("Get wishlist error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500,
    );
  }
}
