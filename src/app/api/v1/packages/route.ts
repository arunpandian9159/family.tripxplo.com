import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Package from '@/lib/models/Package';
import HotelRoom from '@/lib/models/HotelRoom';
import { paginatedResponse, errorResponse, ErrorCodes } from '@/lib/api-response';

// Interface for tripxplo.com compatible search params
interface TripxploSearchParams {
  destinationId?: string;
  interestId?: string;
  perRoom?: number;
  startDate?: string;
  noAdult?: number;
  noChild?: number;
  noRoomCount?: number;
  noExtraAdult?: number;
  limit?: number;
  offset?: number;
  priceOrder?: number; // 1 = asc, -1 = desc
}

// GET /api/v1/packages - Search packages (tripxplo.com compatible endpoint)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const url = new URL(request.url);

    // Parse tripxplo.com compatible params
    const params: TripxploSearchParams = {
      destinationId: url.searchParams.get('destinationId') || undefined,
      interestId: url.searchParams.get('interestId') || undefined,
      perRoom: url.searchParams.get('perRoom') ? parseInt(url.searchParams.get('perRoom')!) : 2,
      startDate: url.searchParams.get('startDate') || undefined,
      noAdult: url.searchParams.get('noAdult') ? parseInt(url.searchParams.get('noAdult')!) : 2,
      noChild: url.searchParams.get('noChild') ? parseInt(url.searchParams.get('noChild')!) : 0,
      noRoomCount: url.searchParams.get('noRoomCount')
        ? parseInt(url.searchParams.get('noRoomCount')!)
        : 1,
      noExtraAdult: url.searchParams.get('noExtraAdult')
        ? parseInt(url.searchParams.get('noExtraAdult')!)
        : 0,
      limit: url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : 10,
      offset: url.searchParams.get('offset') ? parseInt(url.searchParams.get('offset')!) : 0,
      priceOrder: url.searchParams.get('priceOrder')
        ? parseInt(url.searchParams.get('priceOrder')!)
        : 1,
    };

    // Calculate pagination
    const limit = params.limit || 10;
    const offset = params.offset || 0;
    const page = Math.floor(offset / limit) + 1;

    // Build filter query
    const filterQuery: Record<string, unknown> = { status: true };

    // Filter by destinationId (tripxplo.com format)
    if (params.destinationId) {
      filterQuery['destination.destinationId'] = params.destinationId;
    }

    // Filter by interestId (tripxplo.com format)
    if (params.interestId) {
      filterQuery.interestId = params.interestId;
    }

    // Filter by perRoom if specified
    if (params.perRoom) {
      filterQuery.perRoom = { $lte: params.perRoom };
    }

    // Build sort query based on priceOrder
    let sortQuery: Record<string, 1 | -1> = { sort: -1, createdAt: -1 };
    if (params.priceOrder === 1) {
      sortQuery = { activityPrice: 1, sort: -1 };
    } else if (params.priceOrder === -1) {
      sortQuery = { activityPrice: -1, sort: -1 };
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
        $lookup: {
          from: 'interest',
          localField: 'interestId',
          foreignField: 'interestId',
          as: 'interestDetails',
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
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: '$destinationDetails',
                          as: 'dd',
                          cond: { $eq: ['$$dd.destinationId', '$$dest.destinationId'] },
                        },
                      },
                      0,
                    ],
                  },
                ],
              },
            },
          },
          planName: { $arrayElemAt: ['$planDetails.planName', 0] },
          interestName: { $arrayElemAt: ['$interestDetails.interestName', 0] },
        },
      },
      { $sort: sortQuery },
      { $skip: offset },
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
          planId: 1,
          interestId: 1,
          interestName: 1,
          perRoom: 1,
          hotel: 1,
          destinations: {
            $map: {
              input: '$destinations',
              as: 'd',
              in: {
                id: '$$d.destinationId',
                name: '$$d.destinationName',
                noOfNights: '$$d.noOfNight',
              },
            },
          },
          offer: 1,
          status: 1,
        },
      },
    ]);

    const total = await Package.countDocuments(filterQuery);

    // Get hotel room details for price calculation
    const allHotelRoomIds = packages.flatMap(
      p => p.hotel?.map((h: { hotelRoomId: string }) => h.hotelRoomId) || []
    );
    const hotelRoomData = await HotelRoom.find({ hotelRoomId: { $in: allHotelRoomIds } }).lean();

    const formattedPackages = packages.map(pkg => {
      let price = 0;
      if (pkg.startFrom) {
        const parsed = parseFloat(pkg.startFrom);
        if (!isNaN(parsed) && parsed > 0) price = parsed;
      }
      if (price === 0 && pkg.hotel?.length > 0) {
        const hotelPrices = pkg.hotel
          .map((h: { hotelRoomId: string }) => {
            const room = hotelRoomData.find(
              r => (r as { hotelRoomId?: string }).hotelRoomId === h.hotelRoomId
            );
            if (!room) return 0;
            const roomWithMealPlan = room as { mealPlan?: Array<{ roomPrice?: number }> };
            const mealPlanArray = roomWithMealPlan.mealPlan;
            if (mealPlanArray && mealPlanArray.length > 0) {
              const prices = mealPlanArray.map(mp => mp.roomPrice || 0).filter(p => p > 0);
              return prices.length > 0 ? Math.min(...prices) : 0;
            }
            return 0;
          })
          .filter((p: number) => p > 0);
        if (hotelPrices.length > 0)
          price = Math.round(hotelPrices.reduce((a: number, b: number) => a + b, 0) / 2);
      }

      return {
        id: pkg.packageId,
        name: pkg.packageName,
        images: pkg.packageImg || [],
        noOfDays: pkg.noOfDays,
        noOfNights: pkg.noOfNight,
        price,
        startFrom: pkg.startFrom,
        destinations: pkg.destinations || [],
        offer: pkg.offer || 0,
        status: pkg.status,
        planName: pkg.planName || '',
        planId: pkg.planId,
        interestId: pkg.interestId,
        interestName: pkg.interestName,
        perRoom: pkg.perRoom,
        hotelCount: pkg.hotel?.length || 0,
      };
    });

    return paginatedResponse(
      formattedPackages,
      total,
      page,
      limit,
      'Packages retrieved successfully'
    );
  } catch (error) {
    console.error('Get packages error:', error);
    return errorResponse('Internal server error', ErrorCodes.INTERNAL_ERROR, 500);
  }
}
