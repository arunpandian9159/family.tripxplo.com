import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Package from '@/lib/models/Package';
import HotelRoom from '@/lib/models/HotelRoom';
import { paginatedResponse, errorResponse, ErrorCodes } from '@/lib/api-response';
import { parseQueryParams } from '@/lib/api-middleware';

// GET /api/packages/search - Search packages with filters
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const params = parseQueryParams(request);
    const { page, limit, query, destination, minPrice, maxPrice, minDays, maxDays, sort } = params;
    const skip = (page - 1) * limit;

    // Build filter query
    const filterQuery: Record<string, unknown> = { status: true };

    if (query) {
      filterQuery.packageName = { $regex: query, $options: 'i' };
    }

    if (destination) {
      filterQuery['destination.destinationId'] = destination;
    }

    if (minPrice) {
      filterQuery.activityPrice = { $gte: parseInt(minPrice as string) };
    }

    if (maxPrice) {
      filterQuery.activityPrice = { 
        ...(filterQuery.activityPrice as Record<string, unknown> || {}), 
        $lte: parseInt(maxPrice as string) 
      };
    }

    if (minDays) {
      filterQuery.noOfDays = { $gte: parseInt(minDays as string) };
    }

    if (maxDays) {
      filterQuery.noOfDays = { 
        ...(filterQuery.noOfDays as Record<string, unknown> || {}), 
        $lte: parseInt(maxDays as string) 
      };
    }

    // Build sort query
    let sortQuery: Record<string, 1 | -1> = { sort: -1, createdAt: -1 };
    if (sort === 'price_asc') {
      sortQuery = { activityPrice: 1 };
    } else if (sort === 'price_desc') {
      sortQuery = { activityPrice: -1 };
    } else if (sort === 'days_asc') {
      sortQuery = { noOfDays: 1 };
    } else if (sort === 'days_desc') {
      sortQuery = { noOfDays: -1 };
    }

    const packages = await Package.aggregate([
      { $match: filterQuery },
      {
        $lookup: {
          from: 'destination',
          localField: 'destination.destinationId',
          foreignField: 'destinationId',
          as: 'destinationDetails',
        },
      },
      {
        $lookup: {
          from: 'plan',
          localField: 'planId',
          foreignField: 'planId',
          as: 'planDetails',
        },
      },
      {
        $addFields: {
          destinations: {
            $map: {
              input: '$destination',
              as: 'dest',
              in: {
                $mergeObjects: [
                  '$$dest',
                  {
                    $arrayElemAt: [{
                      $filter: {
                        input: '$destinationDetails',
                        as: 'dd',
                        cond: { $eq: ['$$dd.destinationId', '$$dest.destinationId'] },
                      },
                    }, 0],
                  },
                ],
              },
            },
          },
          planName: { $arrayElemAt: ['$planDetails.planName', 0] },
        },
      },
      { $sort: sortQuery },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          packageId: 1,
          packageName: 1,
          packageImg: 1,
          noOfDays: 1,
          noOfNight: 1,
          startFrom: 1,
          planName: 1,
          hotel: 1,
          destinations: {
            $map: {
              input: '$destinations',
              as: 'd',
              in: { id: '$$d.destinationId', name: '$$d.destinationName', noOfNights: '$$d.noOfNight' },
            },
          },
          offer: 1,
          status: 1,
        },
      },
    ]);

    const total = await Package.countDocuments(filterQuery);

    // Get hotel room details
    const allHotelRoomIds = packages.flatMap(p => p.hotel?.map((h: { hotelRoomId: string }) => h.hotelRoomId) || []);
    const hotelRoomData = await HotelRoom.find({ hotelRoomId: { $in: allHotelRoomIds } }).lean();

    const formattedPackages = packages.map((pkg) => {
      let price = 0;
      if (pkg.startFrom) {
        const parsed = parseFloat(pkg.startFrom);
        if (!isNaN(parsed) && parsed > 0) price = parsed;
      }
      if (price === 0 && pkg.hotel?.length > 0) {
        const hotelPrices = pkg.hotel.map((h: { hotelRoomId: string }) => {
          const room = hotelRoomData.find((r) => (r as { hotelRoomId?: string }).hotelRoomId === h.hotelRoomId);
          if (!room) return 0;
          const roomWithMealPlan = room as { mealPlan?: Array<{ roomPrice?: number }> };
          const mealPlanArray = roomWithMealPlan.mealPlan;
          if (mealPlanArray && mealPlanArray.length > 0) {
            const prices = mealPlanArray.map((mp) => mp.roomPrice || 0).filter((p) => p > 0);
            return prices.length > 0 ? Math.min(...prices) : 0;
          }
          return 0;
        }).filter((p: number) => p > 0);
        if (hotelPrices.length > 0) price = Math.round(hotelPrices.reduce((a: number, b: number) => a + b, 0) / 2);
      }

      return {
        id: pkg.packageId, name: pkg.packageName, images: pkg.packageImg || [], noOfDays: pkg.noOfDays,
        noOfNights: pkg.noOfNight, price, startFrom: pkg.startFrom, destinations: pkg.destinations || [],
        offer: pkg.offer || 0, status: pkg.status, planName: pkg.planName || '',
        hotelCount: pkg.hotel?.length || 0,
      };
    });

    return paginatedResponse(formattedPackages, total, page, limit, 'Search results retrieved successfully');
  } catch (error) {
    console.error('Search packages error:', error);
    return errorResponse('Internal server error', ErrorCodes.INTERNAL_ERROR, 500);
  }
}

