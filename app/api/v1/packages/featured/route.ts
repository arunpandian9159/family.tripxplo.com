import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Package from "@/lib/models/Package";
import HotelRoom from "@/lib/models/HotelRoom";
import { successResponse, errorResponse, ErrorCodes } from "@/lib/api-response";
import { parseQueryParams } from "@/lib/api-middleware";

// GET /api/v1/packages/featured - Get featured packages (Family theme only)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { limit } = parseQueryParams(request);

    // Family theme interestId - only show Family themed packages
    const FAMILY_INTEREST_ID = "f9416600-db43-4f32-91f2-659ef08e3509";

    const packages = await Package.aggregate([
      { $match: { status: true, interestId: FAMILY_INTEREST_ID } },
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
        },
      },
      { $sort: { sort: -1, createdAt: -1 } },
      { $limit: limit },
      {
        $project: {
          packageId: 1,
          packageName: 1,
          packageImg: 1,
          noOfDays: 1,
          noOfNight: 1,
          startFrom: 1,
          activityPrice: 1,
          hotel: 1,
          vehicle: 1,
          activity: 1,
          planName: 1,
          destinations: {
            $map: {
              input: "$destinations",
              as: "d",
              in: {
                id: "$$d.destinationId",
                name: "$$d.destinationName",
                noOfNights: "$$d.noOfNight",
              },
            },
          },
          offer: 1,
          status: 1,
          perPerson: 1,
          finalPackagePrice: 1,
          totalPackagePrice: 1,
        },
      },
    ]);

    // Get hotel room details to calculate base prices
    const allHotelRoomIds = packages.flatMap(
      (p) => p.hotel?.map((h: { hotelRoomId: string }) => h.hotelRoomId) || []
    );
    const hotelRoomData = await HotelRoom.find({
      hotelRoomId: { $in: allHotelRoomIds },
    }).lean();

    const formattedPackages = packages.map((pkg) => {
      // Calculate a base price per person
      let price = 0;

      // Try to get price from startFrom field
      if (pkg.startFrom) {
        const parsed = parseFloat(pkg.startFrom);
        if (!isNaN(parsed) && parsed > 0) {
          price = parsed;
        }
      }

      // If no startFrom price, calculate from hotel rooms
      if (price === 0 && pkg.hotel?.length > 0) {
        const hotelPrices = pkg.hotel
          .map((h: { hotelRoomId: string }) => {
            const room = hotelRoomData.find(
              (r) =>
                (r as { hotelRoomId?: string }).hotelRoomId === h.hotelRoomId
            );
            if (!room) return 0;

            const roomWithMealPlan = room as {
              mealPlan?: Array<{ roomPrice?: number }>;
            };
            if (
              roomWithMealPlan.mealPlan &&
              roomWithMealPlan.mealPlan.length > 0
            ) {
              // Get the lowest room price from meal plans
              const prices = roomWithMealPlan.mealPlan
                .map((mp) => mp.roomPrice || 0)
                .filter((p) => p > 0);
              return prices.length > 0 ? Math.min(...prices) : 0;
            }
            return 0;
          })
          .filter((p: number) => p > 0);

        if (hotelPrices.length > 0) {
          // Sum of minimum room prices / 2 (assuming 2 adults per room)
          price = Math.round(
            hotelPrices.reduce((a: number, b: number) => a + b, 0) / 2
          );
        }
      }

      // Fallback to activityPrice if still no price
      if (price === 0 && pkg.activityPrice > 0) {
        price = pkg.activityPrice;
      }

      return {
        id: pkg.packageId,
        name: pkg.packageName,
        images: pkg.packageImg || [],
        noOfDays: pkg.noOfDays,
        noOfNights: pkg.noOfNight,
        price: price,
        destinations: pkg.destinations || [],
        offer: pkg.offer || 0,
        status: pkg.status,
        perPerson: pkg.perPerson,
        finalPackagePrice: pkg.finalPackagePrice,
        totalPackagePrice: pkg.totalPackagePrice,
        planName: pkg.planName || "",
        hotelCount: pkg.hotel?.length || 0,
        vehicleCount: pkg.vehicle?.length || 0,
        activityCount: pkg.activity?.length || 0,
      };
    });

    return successResponse(
      { packages: formattedPackages },
      "Featured packages retrieved successfully"
    );
  } catch (error) {
    console.error("Get featured packages error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500
    );
  }
}
