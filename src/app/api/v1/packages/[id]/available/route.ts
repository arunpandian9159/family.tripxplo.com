import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Package from '@/lib/models/Package';
import Hotel from '@/lib/models/Hotel';
import HotelRoom from '@/lib/models/HotelRoom';
import Amenities from '@/lib/models/Amenities';
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-response';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Check if a date falls within a season's date ranges
// This matches the old backend's complex season filtering logic in MongoDB aggregation
function isDateInSeason(checkDate: string, startDates: string[], endDates: string[]): boolean {
  if (!checkDate || !startDates || !endDates) return false;

  const travelDate = new Date(checkDate);

  // Iterate through all season date ranges (matching old backend's $reduce logic)
  for (let i = 0; i < startDates.length; i++) {
    const seasonStart = new Date(startDates[i]);
    const seasonEnd = new Date(endDates[i]);

    // Check if travel date is within this season range
    // Old backend: $gte: [startDate, '$$mealDetails.startDate'] AND $lte: [startDate, '$$mealDetails.endDate']
    if (travelDate >= seasonStart && travelDate <= seasonEnd) {
      return true;
    }
  }

  return false;
}

// Calculate meal plan prices based on old backend formula
// Matches: getPackageByAvailableHotel aggregation in old backend
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
  noExtraAdult: number
) {
  const roomPrice = mealPlan.roomPrice || 0;
  const childPrice = mealPlan.childPrice || 0;
  const adultPrice = mealPlan.adultPrice || 0;
  const gstPer = mealPlan.gstPer || 0;

  // Price formulas from old backend (getPackageByAvailableHotel):
  // totalAdultPrice: { $multiply: ['$$finalMeal.roomPrice', noRoomCount, noOfNight] }
  // totalChildPrice: { $multiply: ['$$finalMeal.childPrice', noOfChild, noOfNight] }
  // totalExtraAdultPrice: { $multiply: ['$$finalMeal.adultPrice', noExtraAdult, noOfNight] }
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

// GET /api/v1/packages/:id/available - Get available hotels for a package
// This matches the old backend endpoint: /:packageId/available/get (getPackageByAvailableHotel)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const { id: packageId } = await params;
    const { searchParams } = new URL(request.url);

    const startDate = searchParams.get('startDate') || '';
    const noOfNight = parseInt(searchParams.get('noOfNight') || '1');
    const noOfChild = parseInt(searchParams.get('noOfChild') || '0');
    const noRoomCount = parseInt(searchParams.get('noRoomCount') || '1');
    const noExtraAdult = parseInt(searchParams.get('noExtraAdult') || '0');

    // Get the package to find available hotels
    const pkg = await Package.findOne({ packageId }).lean();

    if (!pkg) {
      return errorResponse('Package not found', ErrorCodes.PACKAGE_NOT_FOUND, 404);
    }

    const availableHotelIds = pkg.availableHotel || [];

    if (availableHotelIds.length === 0) {
      return successResponse([{ hotelDetail: [] }], 'No available hotels');
    }

    // Get all available hotels
    const hotels = await Hotel.find({ hotelId: { $in: availableHotelIds } }).lean();

    // For each hotel, get the rooms and their meal plans
    // This matches the old backend's nested $lookup structure
    const hotelDetails = await Promise.all(
      hotels.map(async hotel => {
        // Get rooms for this hotel (matches old backend's hotelRoomDetails lookup)
        const rooms = await HotelRoom.find({ hotelId: hotel.hotelId }).lean();

        // Get amenities for this hotel
        const amenityIds = hotel.amenities || [];
        const amenities = await Amenities.find({ amenitiesId: { $in: amenityIds } }).lean();

        // Process each room with its meal plans (matches old backend's hotelRoom mapping)
        const hotelRooms = await Promise.all(
          rooms.map(async room => {
            // Get amenities for this room (matches old backend's amenitiesDetails lookup)
            const roomAmenityIds = room.amenities || [];
            const roomAmenities = await Amenities.find({
              amenitiesId: { $in: roomAmenityIds },
            }).lean();

            // Filter meal plans by season date if startDate is provided
            // This matches old backend's $filter with $reduce for season date checking
            let filteredMealPlans = room.mealPlan || [];

            if (startDate && filteredMealPlans.length > 0) {
              const seasonallyValid = filteredMealPlans.filter(
                (mp: { startDate: string[]; endDate: string[] }) =>
                  isDateInSeason(startDate, mp.startDate, mp.endDate)
              );

              if (seasonallyValid.length > 0) {
                filteredMealPlans = seasonallyValid;
              }
            }

            // Calculate prices for each meal plan (matches old backend's $mergeObjects with price calculations)
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
              }) => calculateMealPlanPrices(mp, noOfNight, noRoomCount, noOfChild, noExtraAdult)
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
              amenitiesDetails: roomAmenities,
            };
          })
        );

        // Return hotel with rooms (matches old backend's hotelDetail structure)
        return {
          _id: hotel._id,
          hotelId: hotel.hotelId,
          hotelName: hotel.hotelName,
          location: hotel.location,
          viewPoint: hotel.viewPoint,
          image: hotel.image,
          contract: hotel.contract,
          amenities: hotel.amenities,
          __v: hotel.__v,
          review: hotel.review,
          hotelRoom: hotelRooms,
          destinationId: hotel.location?.destinationId,
          // Include hotel amenities details
          amenitiesDetails: amenities,
        };
      })
    );

    // Return in old backend format: [{ hotelDetail: [...] }]
    return successResponse(
      [{ hotelDetail: hotelDetails }],
      'Available hotels retrieved successfully'
    );
  } catch (error) {
    console.error('Get available hotels error:', error);
    return errorResponse('Internal server error', ErrorCodes.INTERNAL_ERROR, 500);
  }
}
