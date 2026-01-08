import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Package from "@/lib/models/Package";
import HotelRoom from "@/lib/models/HotelRoom";
import Vehicle from "@/lib/models/Vehicle";
import {
  paginatedResponse,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";
import { PipelineStage } from "mongoose";

interface SearchParams {
  destinationId?: string;
  interestId?: string;
  planId?: string;
  perRoom?: number;
  priceOrder?: number;
  startDate?: string;
  noAdult?: number;
  noChild?: number;
  noRoomCount?: number;
  noExtraAdult?: number;
  offset?: number;
  limit?: number;
  query?: string;
  minDays?: number;
  maxDays?: number;
}

// Parse query parameters from the request
function parseSearchParams(request: NextRequest): SearchParams {
  const url = new URL(request.url);

  return {
    destinationId: url.searchParams.get("destinationId") || undefined,
    interestId: url.searchParams.get("interestId") || undefined,
    planId: url.searchParams.get("planId") || undefined,
    perRoom: url.searchParams.get("perRoom")
      ? parseInt(url.searchParams.get("perRoom")!)
      : 2,
    priceOrder: url.searchParams.get("priceOrder")
      ? parseInt(url.searchParams.get("priceOrder")!)
      : 1,
    startDate: url.searchParams.get("startDate") || undefined,
    noAdult: url.searchParams.get("noAdult")
      ? parseInt(url.searchParams.get("noAdult")!)
      : 2,
    noChild: url.searchParams.get("noChild")
      ? parseInt(url.searchParams.get("noChild")!)
      : 0,
    noRoomCount: url.searchParams.get("noRoomCount")
      ? parseInt(url.searchParams.get("noRoomCount")!)
      : 1,
    noExtraAdult: url.searchParams.get("noExtraAdult")
      ? parseInt(url.searchParams.get("noExtraAdult")!)
      : 0,
    offset: url.searchParams.get("offset")
      ? parseInt(url.searchParams.get("offset")!)
      : 0,
    limit: url.searchParams.get("limit")
      ? parseInt(url.searchParams.get("limit")!)
      : 10,
    query:
      url.searchParams.get("q") || url.searchParams.get("query") || undefined,
    minDays: url.searchParams.get("minDays")
      ? parseInt(url.searchParams.get("minDays")!)
      : undefined,
    maxDays: url.searchParams.get("maxDays")
      ? parseInt(url.searchParams.get("maxDays")!)
      : undefined,
  };
}

// Determine season type based on date
function getSeasonType(
  startDate: string,
  mealPlan: { seasonType: string; startDate: string[]; endDate: string[] },
): boolean {
  if (!startDate || !mealPlan.startDate || !mealPlan.endDate) return false;

  const travelDate = new Date(startDate);

  for (let i = 0; i < mealPlan.startDate.length; i++) {
    const seasonStart = new Date(mealPlan.startDate[i]);
    const seasonEnd = new Date(mealPlan.endDate[i]);

    if (travelDate >= seasonStart && travelDate <= seasonEnd) {
      return true;
    }
  }

  return false;
}

// Calculate hotel meal pricing - matches old backend logic
function calculateHotelMealPricing(
  hotelRoomData: {
    hotelRoomId: string;
    hotelRoomType: string;
    maxAdult: number;
    maxChild: number;
    roomCapacity: number;
    isAc: boolean;
    mealPlan: Array<{
      hotelId: string;
      hotelMealId: string;
      mealPlan: string;
      roomPrice: number;
      gstPer: number;
      adultPrice: number;
      childPrice: number;
      seasonType: string;
      startDate: string[];
      endDate: string[];
    }>;
  }[],
  packageHotel: {
    hotelRoomId: string;
    mealPlan: string;
    noOfNight: number;
    startDateWise: number;
    endDateWise: number;
    sort: number;
    isAddOn: boolean;
  }[],
  params: SearchParams,
) {
  const hotelMealDetails: Array<Record<string, unknown>> = [];

  for (const hotel of packageHotel) {
    const roomData = hotelRoomData.find(
      (r) => r.hotelRoomId === hotel.hotelRoomId,
    );
    if (!roomData) continue;

    // Find the matching meal plan with correct season
    let selectedMealPlan = roomData.mealPlan.find(
      (mp) =>
        mp.mealPlan === hotel.mealPlan &&
        params.startDate &&
        getSeasonType(params.startDate, mp),
    );

    // Fallback to any meal plan with matching type
    if (!selectedMealPlan) {
      selectedMealPlan = roomData.mealPlan.find(
        (mp) => mp.mealPlan === hotel.mealPlan,
      );
    }

    if (!selectedMealPlan) continue;

    const noOfNight = hotel.noOfNight;
    const noRoomCount = params.noRoomCount || 1;
    const noChild = params.noChild || 0;
    const noExtraAdult = params.noExtraAdult || 0;

    // Calculate prices - CORRECT FORMULAS from old backend:
    // totalAdultPrice = roomPrice * noRoomCount * noOfNight (room cost for base occupancy)
    // totalChildPrice = childPrice * noChild * noOfNight
    // totalExtraAdultPrice = adultPrice * noExtraAdult * noOfNight (extra adult cost)
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
      hotelRoomId: hotel.hotelRoomId,
      mealPlan: hotel.mealPlan,
      noOfNight,
      startDateWise: hotel.startDateWise,
      endDateWise: hotel.endDateWise,
      sort: hotel.sort,
      isAddOn: hotel.isAddOn,
      hotelId: selectedMealPlan.hotelId,
      hotelRoomType: roomData.hotelRoomType,
      maxAdult: roomData.maxAdult,
      maxChild: roomData.maxChild,
      roomCapacity: roomData.roomCapacity,
      isAc: roomData.isAc,
      hotelMealId: selectedMealPlan.hotelMealId,
      roomPrice: selectedMealPlan.roomPrice,
      gstPer: selectedMealPlan.gstPer,
      adultPrice: selectedMealPlan.adultPrice,
      childPrice: selectedMealPlan.childPrice,
      seasonType: selectedMealPlan.seasonType,
      startDate: selectedMealPlan.startDate,
      endDate: selectedMealPlan.endDate,
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

// Check if a date falls within any of the package's available periods
function isDateAvailable(
  travelDateStr: string,
  periods: Array<{ startDate: string; endDate: string }> | undefined,
): boolean {
  // If no date filter provided, package is available
  if (!travelDateStr) return true;

  // If no periods defined or empty array, package is always available
  if (!periods || periods.length === 0) return true;

  const travelDate = new Date(travelDateStr);
  if (isNaN(travelDate.getTime())) return true; // Invalid date, show all

  for (const period of periods) {
    if (!period.startDate || !period.endDate) continue;

    const periodStart = new Date(period.startDate);
    const periodEnd = new Date(period.endDate);

    // Skip invalid dates
    if (isNaN(periodStart.getTime()) || isNaN(periodEnd.getTime())) continue;

    // Check if travel date is within the period
    if (travelDate >= periodStart && travelDate <= periodEnd) {
      return true;
    }
  }

  // If all periods have dates but none match, package is not available
  const hasValidPeriods = periods.some((p) => p.startDate && p.endDate);
  return !hasValidPeriods; // If no valid periods, treat as always available
}

// GET /api/v1/packages - Get all packages with pagination and filters
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const params = parseSearchParams(request);
    const {
      destinationId,
      interestId,
      planId,
      priceOrder,
      startDate,
      offset = 0,
      limit = 10,
      query,
      minDays,
      maxDays,
      noAdult = 2,
      noChild = 0,
      noRoomCount = 1,
      noExtraAdult = 0,
    } = params;

    const page = Math.floor(offset / limit) + 1;

    // Build filter query
    const filterQuery: Record<string, unknown> = { status: true };

    if (query) {
      filterQuery.packageName = { $regex: query, $options: "i" };
    }

    if (destinationId) {
      filterQuery["destination.destinationId"] = destinationId;
    }

    if (interestId) {
      filterQuery.interestId = interestId;
    }

    if (planId) {
      filterQuery.planId = planId;
    }

    if (minDays) {
      filterQuery.noOfDays = { $gte: minDays };
    }

    if (maxDays) {
      filterQuery.noOfDays = {
        ...((filterQuery.noOfDays as Record<string, unknown>) || {}),
        $lte: maxDays,
      };
    }

    // Build sort query based on priceOrder
    let sortQuery: Record<string, 1 | -1> = { sort: -1, createdAt: -1 };
    if (priceOrder === 1) {
      sortQuery = { activityPrice: 1, sort: -1 };
    } else if (priceOrder === -1) {
      sortQuery = { activityPrice: -1, sort: -1 };
    }

    // Build date availability filter stages for aggregation pipeline
    const dateFilterStages: PipelineStage[] = [];

    if (startDate) {
      // Add a field to check if package is available for the selected date
      // Packages with empty/missing period array are always available
      dateFilterStages.push({
        $addFields: {
          isDateAvailable: {
            $cond: {
              if: {
                $or: [
                  { $eq: [{ $size: { $ifNull: ["$period", []] } }, 0] },
                  { $not: { $isArray: "$period" } },
                ],
              },
              // Empty or no period array means always available
              then: true,
              // Otherwise check if startDate falls within any period
              else: {
                $anyElementTrue: {
                  $map: {
                    input: { $ifNull: ["$period", []] },
                    as: "p",
                    in: {
                      $and: [
                        { $lte: ["$$p.startDate", startDate] },
                        { $gte: ["$$p.endDate", startDate] },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Filter to only include available packages
      dateFilterStages.push({
        $match: { isDateAvailable: true },
      });
    }

    // Get packages with lookups
    const packages = await Package.aggregate([
      { $match: filterQuery },
      ...dateFilterStages,
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
        $lookup: {
          from: "activity",
          localField: "activity.event.activityId",
          foreignField: "activityId",
          as: "activityDetails",
        },
      },
      {
        $addFields: {
          destination: {
            $map: {
              input: "$destination",
              as: "dest",
              in: {
                $mergeObjects: [
                  "$$dest",
                  {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$destinationDetails",
                          as: "dd",
                          cond: {
                            $eq: ["$$dd.destinationId", "$$dest.destinationId"],
                          },
                        },
                      },
                      0,
                    ],
                  },
                ],
              },
            },
          },
          planName: { $arrayElemAt: ["$planDetails.planName", 0] },
          // Enrich activity events with activity details
          activity: {
            $map: {
              input: "$activity",
              as: "act",
              in: {
                day: "$$act.day",
                from: "$$act.from",
                to: "$$act.to",
                startDateWise: "$$act.startDateWise",
                event: {
                  $map: {
                    input: "$$act.event",
                    as: "evt",
                    in: {
                      $mergeObjects: [
                        "$$evt",
                        {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: "$activityDetails",
                                as: "ad",
                                cond: {
                                  $eq: ["$$ad.activityId", "$$evt.activityId"],
                                },
                              },
                            },
                            0,
                          ],
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
      { $sort: sortQuery },
      { $skip: offset },
      { $limit: limit },
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
    const packagesWithPrices = packages.map((pkg) => {
      // Calculate hotel meal pricing
      const hotelMeal = calculateHotelMealPricing(
        hotelRoomData as {
          hotelRoomId: string;
          hotelRoomType: string;
          maxAdult: number;
          maxChild: number;
          roomCapacity: number;
          isAc: boolean;
          mealPlan: Array<{
            hotelId: string;
            hotelMealId: string;
            mealPlan: string;
            roomPrice: number;
            gstPer: number;
            adultPrice: number;
            childPrice: number;
            seasonType: string;
            startDate: string[];
            endDate: string[];
          }>;
        }[],
        pkg.hotel || [],
        params,
      );

      // Get vehicle details for this package
      const vehicleDetail = vehicleData
        .filter((v) => pkg.vehicle?.includes(v.vehicleId))
        .map((v) => ({
          vehicleId: v.vehicleId,
          vehicleName: v.vehicleName,
          price: v.price || 0,
          seater: v.seater,
          isAc: v.isAc,
        }));

      // Calculate totals
      const totalRoomPrice = hotelMeal.reduce(
        (total, hm) =>
          total +
          ((hm.totalAdultPrice as number) || 0) +
          ((hm.totalChildPrice as number) || 0) +
          ((hm.totalExtraAdultPrice as number) || 0) +
          ((hm.gstAdultPrice as number) || 0) +
          ((hm.gstChildPrice as number) || 0) +
          ((hm.gstExtraAdultPrice as number) || 0),
        0,
      );

      // totalAdditionalFee = noOfNight * noRoomCount * additionalFees
      const totalAdditionalFee =
        (pkg.noOfNight || 0) * noRoomCount * (pkg.additionalFees || 0);
      // totalTransportFee = transPer * (noAdult + noExtraAdult + noChild)
      const totalTransportFee =
        (pkg.transPer || 0) * (noAdult + noExtraAdult + noChild);
      const totalVehiclePrice = vehicleDetail.reduce(
        (total, v) => total + (v.price || 0),
        0,
      );

      // Calculate activity price - use package's activityPrice or sum from events
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
      const gstPer = pkg.gstPer || 5;

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
      const gstPrice = Math.round(totalPackagePrice * (gstPer / 100));
      const finalPackagePrice = totalPackagePrice + gstPrice;

      const totalAdultCount = noAdult + noExtraAdult;

      // perPerson is calculated from totalPackagePrice (before GST), not finalPackagePrice
      // If totalPackagePrice is 0 (no hotel data found), use activityPrice as fallback
      let perPerson =
        totalAdultCount > 0
          ? Math.round(totalPackagePrice / totalAdultCount)
          : totalPackagePrice;
      if (perPerson <= 0 && pkg.activityPrice > 0) {
        perPerson = pkg.activityPrice;
      }

      // Calculate counts - matches old backend logic:
      // hotelCount = size of hotelMeal array (number of hotel room stays in package)
      // vehicleCount = size of vehicleDetails array (number of vehicles)
      // activityCount = size of activity array (number of DAYS with activities, not unique activities)
      const hotelCount = hotelMeal.length || pkg.hotel?.length || 0;
      const vehicleCount = vehicleDetail.length || pkg.vehicle?.length || 0;

      // activityCount = size of activity array (number of DAYS with activities)
      const activityCount = pkg.activity?.length || 0;

      return {
        _id: pkg._id,
        packageId: pkg.packageId,
        packageName: pkg.packageName,
        packageImg: pkg.packageImg,
        noOfDays: pkg.noOfDays,
        noOfNight: pkg.noOfNight,
        startFrom: pkg.startFrom,
        destination: pkg.destination,
        period: pkg.period,
        activity: pkg.activity,
        offer: pkg.offer,
        status: pkg.status,
        planName: pkg.planName,
        hotelMeal,
        vehicleDetail,
        totalRoomPrice,
        totalAdditionalFee,
        totalTransportFee,
        totalVehiclePrice,
        totalActivityPrice,
        totalCalculationPrice,
        marketingPer,
        agentCommissionPer,
        gstPer,
        AgentAmount: agentAmount,
        totalPackagePrice,
        gstPrice,
        finalPackagePrice,
        perPerson,
        hotelCount,
        vehicleCount,
        activityCount,
      };
    });

    // Count total available packages (including date filter)
    let total: number;
    if (startDate) {
      // Use aggregation to count with date filter
      const countResult = await Package.aggregate([
        { $match: filterQuery },
        {
          $addFields: {
            isDateAvailable: {
              $cond: {
                if: {
                  $or: [
                    { $eq: [{ $size: { $ifNull: ["$period", []] } }, 0] },
                    { $not: { $isArray: "$period" } },
                  ],
                },
                then: true,
                else: {
                  $anyElementTrue: {
                    $map: {
                      input: { $ifNull: ["$period", []] },
                      as: "p",
                      in: {
                        $and: [
                          { $lte: ["$$p.startDate", startDate] },
                          { $gte: ["$$p.endDate", startDate] },
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
        },
        { $match: { isDateAvailable: true } },
        { $count: "total" },
      ]);
      total = countResult[0]?.total || 0;
    } else {
      total = await Package.countDocuments(filterQuery);
    }
    const totalPages = Math.ceil(total / limit);

    return paginatedResponse(
      packagesWithPrices,
      total,
      page,
      limit,
      "Packages retrieved successfully",
      { hasNextPage: page < totalPages, offset },
    );
  } catch (error) {
    console.error("Get packages error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500,
    );
  }
}
