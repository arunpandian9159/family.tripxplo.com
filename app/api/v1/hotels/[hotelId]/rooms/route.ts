import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import HotelRoom from "@/lib/models/HotelRoom";
import Hotel from "@/lib/models/Hotel";
import Amenities from "@/lib/models/Amenities";
import { successResponse, errorResponse, ErrorCodes } from "@/lib/api-response";

interface RouteParams {
  params: Promise<{ hotelId: string }>;
}

// Check if a date falls within a season's date ranges
// This matches the old backend's complex season filtering logic
function isDateInSeason(
  checkDate: string,
  startDates: string[],
  endDates: string[],
): boolean {
  if (!checkDate || !startDates || !endDates) return false;

  const travelDate = new Date(checkDate);

  for (let i = 0; i < startDates.length; i++) {
    const seasonStart = new Date(startDates[i]);
    const seasonEnd = new Date(endDates[i]);

    if (travelDate >= seasonStart && travelDate <= seasonEnd) {
      return true;
    }
  }

  return false;
}

// Calculate meal plan prices based on old backend formula
function calculateMealPlanPrices(
  mealPlan: {
    hotelMealId: string;
    mealPlan: string;
    roomPrice: number;
    gstPer: number;
    adultPrice: number;
    childPrice: number;
    seasonType: string;
    startDate: string[];
    endDate: string[];
    hotelRoomId: string;
  },
  noOfNight: number,
  noRoomCount: number,
  noOfChild: number,
  noExtraAdult: number,
) {
  const roomPrice = mealPlan.roomPrice || 0;
  const childPrice = mealPlan.childPrice || 0;
  const adultPrice = mealPlan.adultPrice || 0;
  const gstPer = mealPlan.gstPer || 0;

  // Price formulas from old backend:
  // totalAdultPrice = roomPrice * noRoomCount * noOfNight
  // totalChildPrice = childPrice * noOfChild * noOfNight
  // totalExtraAdultPrice = adultPrice * noExtraAdult * noOfNight
  const totalAdultPrice = roomPrice * noRoomCount * noOfNight;
  const gstAdultPrice = Math.round(totalAdultPrice * (gstPer / 100));

  const totalChildPrice = childPrice * noOfChild * noOfNight;
  const gstChildPrice = Math.round(totalChildPrice * (gstPer / 100));

  const totalExtraAdultPrice = adultPrice * noExtraAdult * noOfNight;
  const gstExtraAdultPrice = Math.round(totalExtraAdultPrice * (gstPer / 100));

  return {
    ...mealPlan,
    totalAdultPrice,
    gstAdultPrice,
    totalChildPrice,
    gstChildPrice,
    totalExtraAdultPrice,
    gstExtraAdultPrice,
  };
}

// GET /api/v1/hotels/[hotelId]/rooms - Get rooms for a hotel with price calculations
// This matches the old backend endpoint: /:hotelId/hotel/get
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const { hotelId } = await params;
    const { searchParams } = new URL(request.url);

    const startDate = searchParams.get("startDate") || "";
    const noOfNight = parseInt(searchParams.get("noOfNight") || "1");
    const noOfChild = parseInt(searchParams.get("noOfChild") || "0");
    const noRoomCount = parseInt(searchParams.get("noRoomCount") || "1");
    const noExtraAdult = parseInt(searchParams.get("noExtraAdult") || "0");

    // Get the hotel details first
    const hotel = await Hotel.findOne({ hotelId }).lean();

    if (!hotel) {
      return errorResponse("Hotel not found", ErrorCodes.NOT_FOUND, 404);
    }

    // Get all rooms for this hotel
    const rooms = await HotelRoom.find({ hotelId }).lean();

    if (!rooms || rooms.length === 0) {
      return successResponse([], "No rooms found for this hotel");
    }

    // Process each room with its meal plans and amenities
    const roomsWithDetails = await Promise.all(
      rooms.map(async (room) => {
        // Get amenities for this room
        const roomAmenityIds = room.amenities || [];
        const roomAmenities = await Amenities.find({
          amenitiesId: { $in: roomAmenityIds },
        }).lean();

        // Filter meal plans by season date if startDate is provided
        let filteredMealPlans = room.mealPlan || [];

        if (startDate && filteredMealPlans.length > 0) {
          filteredMealPlans = filteredMealPlans.filter(
            (mp: { startDate: string[]; endDate: string[] }) =>
              isDateInSeason(startDate, mp.startDate, mp.endDate),
          );
        }

        // Calculate prices for each meal plan
        const mealPlansWithPrices = filteredMealPlans.map(
          (mp: {
            hotelMealId: string;
            mealPlan: string;
            roomPrice: number;
            gstPer: number;
            adultPrice: number;
            childPrice: number;
            seasonType: string;
            startDate: string[];
            endDate: string[];
            hotelRoomId: string;
          }) =>
            calculateMealPlanPrices(
              mp,
              noOfNight,
              noRoomCount,
              noOfChild,
              noExtraAdult,
            ),
        );

        return {
          _id: room._id,
          hotelId: room.hotelId,
          hotelRoomId: room.hotelRoomId,
          hotelRoomType: room.hotelRoomType,
          maxAdult: room.maxAdult,
          maxChild: room.maxChild,
          maxInf: room.maxInf,
          roomCapacity: room.roomCapacity,
          isAc: room.isAc,
          amenities: room.amenities,
          mealPlan: mealPlansWithPrices,
          __v: room.__v,
          // Hotel name from old backend
          hotelName: hotel.hotelName,
          amenitiesDetails: roomAmenities,
        };
      }),
    );

    return successResponse(roomsWithDetails, "Rooms retrieved successfully");
  } catch (error) {
    console.error("Get hotel rooms error:", error);
    return errorResponse(
      "Internal server error",
      ErrorCodes.INTERNAL_ERROR,
      500,
    );
  }
}
