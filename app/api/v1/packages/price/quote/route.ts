import { NextRequest } from "next/server";
import { successResponse, errorResponse, ErrorCodes } from "@/lib/api-response";

interface HotelMealItem {
  totalAdultPrice?: number;
  totalChildPrice?: number;
  totalExtraAdultPrice?: number;
  gstAdultPrice?: number;
  gstChildPrice?: number;
  gstExtraAdultPrice?: number;
}

interface VehicleItem {
  price?: number;
}

interface ActivityEvent {
  price?: number;
}

interface ActivityItem {
  event?: ActivityEvent[];
}

interface PackageData {
  hotelMeal?: HotelMealItem[];
  vehicleDetail?: VehicleItem[];
  activity?: ActivityItem[];
  additionalFees?: number;
  transPer?: number;
  marketingPer?: number;
  agentCommissionPer?: number;
  gstPer?: number;
  activityPrice?: number;
  totalAdultCount?: number;
  noOfAdult?: number;
}

// POST /api/v1/packages/price/quote - Calculate package price
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const packageData: PackageData = body.package;

    if (!packageData) {
      return errorResponse(
        "Package data is required",
        ErrorCodes.VALIDATION_ERROR,
        400,
      );
    }

    // Calculate totals from hotel meals
    const totalRoomPrice = (packageData.hotelMeal || []).reduce(
      (total: number, hm: HotelMealItem) =>
        total +
        (hm.totalAdultPrice || 0) +
        (hm.totalChildPrice || 0) +
        (hm.totalExtraAdultPrice || 0) +
        (hm.gstAdultPrice || 0) +
        (hm.gstChildPrice || 0) +
        (hm.gstExtraAdultPrice || 0),
      0,
    );

    // Calculate vehicle price
    const totalVehiclePrice = (packageData.vehicleDetail || []).reduce(
      (total: number, v: VehicleItem) => total + (v.price || 0),
      0,
    );

    // Calculate activity price
    let totalActivityPrice = packageData.activityPrice || 0;
    if (totalActivityPrice === 0) {
      totalActivityPrice = (packageData.activity || []).reduce(
        (total: number, act: ActivityItem) => {
          const eventTotal = (act.event || []).reduce(
            (evtTotal: number, evt: ActivityEvent) =>
              evtTotal + (evt.price || 0),
            0,
          );
          return total + eventTotal;
        },
        0,
      );
    }

    // If additionalFees is passed as raw, calculate it: noOfNight * noRoomCount * additionalFees
    // If it's already calculated (totalAdditionalFee), use that
    const totalAdditionalFee =
      (packageData as any).totalAdditionalFee ??
      packageData.additionalFees ??
      0;
    // If transPer is passed as raw, calculate it: transPer * (noAdult + noExtraAdult + noChild)
    // If it's already calculated (totalTransportFee), use that
    const totalTransportFee =
      (packageData as any).totalTransportFee ?? packageData.transPer ?? 0;
    const marketingPer = packageData.marketingPer || 0;
    const agentCommissionPer = packageData.agentCommissionPer || 0;
    const gstPer = packageData.gstPer || 5;

    const totalCalculationPrice =
      totalRoomPrice +
      totalAdditionalFee +
      totalTransportFee +
      marketingPer +
      totalVehiclePrice +
      totalActivityPrice;
    const AgentAmount = Math.round(
      totalCalculationPrice * (agentCommissionPer / 100),
    );
    const totalPackagePrice = totalCalculationPrice + AgentAmount;
    const gstPrice = Math.round(totalPackagePrice * (gstPer / 100));
    const finalPackagePrice = totalPackagePrice + gstPrice;

    const totalAdultCount =
      packageData.totalAdultCount || packageData.noOfAdult || 2;
    // perPerson is calculated from totalPackagePrice (before GST), not finalPackagePrice
    const perPerson =
      totalAdultCount > 0
        ? Math.round(totalPackagePrice / totalAdultCount)
        : totalPackagePrice;

    const result = {
      totalRoomPrice,
      totalAdditionalFee,
      totalTransportFee,
      totalVehiclePrice,
      totalActivityPrice,
      totalCalculationPrice,
      marketingPer,
      agentCommissionPer,
      gstPer,
      AgentAmount,
      totalPackagePrice,
      gstPrice,
      finalPackagePrice,
      perPerson,
    };

    return successResponse(result, "Price calculated successfully");
  } catch (error) {
    console.error("Calculate price error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500,
    );
  }
}
