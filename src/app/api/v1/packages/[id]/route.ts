import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Package from '@/lib/models/Package';
import HotelRoom from '@/lib/models/HotelRoom';
import Vehicle from '@/lib/models/Vehicle';
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-response';

interface RouteParams {
  params: Promise<{ id: string }>;
}

interface SearchParams {
  startDate?: string;
  noAdult?: number;
  noChild?: number;
  noRoomCount?: number;
  noExtraAdult?: number;
}

// Determine season type based on date
function getSeasonType(
  startDate: string,
  mealPlan: { seasonType: string; startDate: string[]; endDate: string[] }
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

// Format date for display (like old backend's hotelDateFormat)
function formatDate(daysOffset: number, startDate: string): string {
  const date = new Date(startDate);
  date.setDate(date.getDate() + daysOffset);
  return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
}

// Format date as YYYY-MM-DD (like old backend's hotelDateYYYYFormat)
function formatDateYYYY(daysOffset: number, startDate: string): string {
  const date = new Date(startDate);
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
}

// GET /api/v1/packages/:id - Get package details by ID with price calculation
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const { id } = await params;
    const url = new URL(request.url);

    // Parse query parameters
    const searchParams: SearchParams = {
      startDate: url.searchParams.get('startDate') || undefined,
      noAdult: url.searchParams.get('noAdult') ? parseInt(url.searchParams.get('noAdult')!) : 2,
      noChild: url.searchParams.get('noChild') ? parseInt(url.searchParams.get('noChild')!) : 0,
      noRoomCount: url.searchParams.get('noRoomCount')
        ? parseInt(url.searchParams.get('noRoomCount')!)
        : 1,
      noExtraAdult: url.searchParams.get('noExtraAdult')
        ? parseInt(url.searchParams.get('noExtraAdult')!)
        : 0,
    };

    const hotelsParam = url.searchParams.get('hotels'); // Format: "index:hotelId:roomId,index:hotelId:roomId" or "index:hotelId"
    const vehicleParam = url.searchParams.get('vehicle'); // Format: "vehicleId"
    const requestedHotels: Record<number, string> = {};
    const requestedRooms: Record<number, string> = {};

    if (hotelsParam) {
      hotelsParam.split(',').forEach(part => {
        const parts = part.split(':');
        const index = parseInt(parts[0]);
        const hotelId = parts[1];
        const roomId = parts[2]; // May be undefined for old format
        if (!isNaN(index) && hotelId) {
          requestedHotels[index] = hotelId;
          if (roomId) {
            requestedRooms[index] = roomId;
          }
        }
      });
    }

    const noAdult = searchParams.noAdult || 2;
    const noChild = searchParams.noChild || 0;
    const noRoomCount = searchParams.noRoomCount || 1;
    const noExtraAdult = searchParams.noExtraAdult || 0;
    const startDate = searchParams.startDate || new Date().toISOString().split('T')[0];

    // First get the basic package data
    const packages = await Package.aggregate([
      { $match: { packageId: id } },
      // Lookup destination details
      {
        $lookup: {
          from: 'destination',
          localField: 'destination.destinationId',
          foreignField: 'destinationId',
          as: 'destinationDetails',
        },
      },
      // Lookup inclusion details
      {
        $lookup: {
          from: 'inclusion',
          localField: 'inclusion',
          foreignField: 'inclusionId',
          as: 'inclusionDetail',
        },
      },
      // Lookup exclusion details
      {
        $lookup: {
          from: 'exclusion',
          localField: 'exclusion',
          foreignField: 'exclusionId',
          as: 'exclusionDetail',
        },
      },
      // Lookup plan details
      {
        $lookup: {
          from: 'plan',
          localField: 'planId',
          foreignField: 'planId',
          as: 'planDetails',
        },
      },
      // Lookup activity details
      {
        $lookup: {
          from: 'activity',
          localField: 'activity.event.activityId',
          foreignField: 'activityId',
          as: 'activityDetails',
        },
      },
      // Lookup hotel room details
      {
        $lookup: {
          from: 'hotelRoom',
          localField: 'hotel.hotelRoomId',
          foreignField: 'hotelRoomId',
          as: 'hotelRoomDetails',
        },
      },
      // Lookup hotel details
      {
        $lookup: {
          from: 'hotel',
          localField: 'hotelRoomDetails.hotelId',
          foreignField: 'hotelId',
          as: 'hotelDetails',
        },
      },
      // Lookup vehicle details
      {
        $lookup: {
          from: 'vehicle',
          localField: 'vehicle',
          foreignField: 'vehicleId',
          as: 'vehicleDetails',
        },
      },
      // Merge destination details
      {
        $addFields: {
          destination: {
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
          // Merge activity events with activity details
          activity: {
            $map: {
              input: '$activity',
              as: 'act',
              in: {
                $mergeObjects: [
                  '$$act',
                  {
                    event: {
                      $map: {
                        input: '$$act.event',
                        as: 'evt',
                        in: {
                          $mergeObjects: [
                            '$$evt',
                            {
                              $arrayElemAt: [
                                {
                                  $filter: {
                                    input: '$activityDetails',
                                    as: 'ad',
                                    cond: { $eq: ['$$ad.activityId', '$$evt.activityId'] },
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
                ],
              },
            },
          },
          planName: { $arrayElemAt: ['$planDetails.planName', 0] },
        },
      },
    ]);

    if (!packages || packages.length === 0) {
      return errorResponse('Package not found', ErrorCodes.PACKAGE_NOT_FOUND, 404);
    }

    const pkg = packages[0];

    // Get hotel room data with meal plans
    const hotelRoomIds = (pkg.hotel || []).map((h: { hotelRoomId: string }) => h.hotelRoomId);
    let hotelRoomData = await HotelRoom.find({ hotelRoomId: { $in: hotelRoomIds } }).lean();

    // Fetch details for requested replacement hotels
    if (Object.keys(requestedHotels).length > 0) {
      const replacementHotelIds = Object.values(requestedHotels);

      // Find rooms for these hotels
      const replacementRooms = await HotelRoom.find({
        hotelId: { $in: replacementHotelIds },
      }).lean();

      // Also need to fetch the hotel details for these new rooms
      const replacementHotelDetails = await connectDB().then(() =>
        import('@/lib/models/Hotel').then(mod =>
          mod.default.find({ hotelId: { $in: replacementHotelIds } }).lean()
        )
      );

      // Add to our local data lists
      hotelRoomData = [...hotelRoomData, ...replacementRooms];
      pkg.hotelDetails = [...(pkg.hotelDetails || []), ...replacementHotelDetails];
    }

    // Calculate hotel meal pricing - matches old backend logic
    const hotelMeal: Array<Record<string, unknown>> = [];

    // Iterate with index to check for replacements
    (pkg.hotel || []).forEach((hotel: any, index: number) => {
      let activeHotelRoomId = hotel.hotelRoomId;

      // Check if this slot has a requested replacement
      if (requestedHotels[index]) {
        const wantedHotelId = requestedHotels[index];
        const wantedRoomId = requestedRooms[index];

        // If a specific room ID was provided in URL, use it directly
        if (wantedRoomId) {
          const exactRoom = hotelRoomData.find((r: any) => r.hotelRoomId === wantedRoomId);
          if (exactRoom) {
            activeHotelRoomId = wantedRoomId;
          }
        } else {
          // Fallback: find best room in the hotel (old behavior)
          const currentRoom = hotelRoomData.find((r: any) => r.hotelRoomId === activeHotelRoomId);

          const bestReplacement = hotelRoomData.find((r: any) => {
            if (r.hotelId !== wantedHotelId) return false;
            // Try to match room type if we can
            if (currentRoom && r.hotelRoomType === currentRoom.hotelRoomType) return true;
            return true; // Fallback to any room in that hotel
          });

          if (bestReplacement) {
            activeHotelRoomId = bestReplacement.hotelRoomId;
          }
        }
      }

      const roomData = hotelRoomData.find(
        (r: { hotelRoomId: string }) => r.hotelRoomId === activeHotelRoomId
      ) as
        | {
            hotelRoomId: string;
            hotelId: string;
            hotelRoomType: string;
            maxAdult: number;
            maxChild: number;
            maxInf: number;
            roomCapacity: number;
            isAc: boolean;
            mealPlan: Array<{
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
          }
        | undefined;

      if (!roomData) return;

      // Find hotel details
      const hotelDetail = (pkg.hotelDetails || []).find(
        (h: { hotelId: string }) => h.hotelId === roomData.hotelId
      );

      // Find the matching meal plan with correct season
      let selectedMealPlan = roomData.mealPlan?.find(
        mp => mp.mealPlan === hotel.mealPlan && startDate && getSeasonType(startDate, mp)
      );

      // Fallback to any meal plan with matching type
      if (!selectedMealPlan) {
        selectedMealPlan = roomData.mealPlan?.find(mp => mp.mealPlan === hotel.mealPlan);
      }

      // Fallback to first available meal plan
      if (!selectedMealPlan && roomData.mealPlan?.length > 0) {
        selectedMealPlan = roomData.mealPlan[0];
      }

      if (!selectedMealPlan) return;

      const noOfNight = hotel.noOfNight || 1;

      // Calculate prices - CORRECT FORMULAS from old backend:
      // totalAdultPrice = roomPrice * noRoomCount * noOfNight (room cost for base occupancy)
      // totalChildPrice = childPrice * noChild * noOfNight
      // totalExtraAdultPrice = adultPrice * noExtraAdult * noOfNight (extra adult cost)
      const totalAdultPrice = selectedMealPlan.roomPrice * noRoomCount * noOfNight;
      const gstAdultPrice = Math.round(totalAdultPrice * (selectedMealPlan.gstPer / 100));

      const totalChildPrice = selectedMealPlan.childPrice * noChild * noOfNight;
      const gstChildPrice = Math.round(totalChildPrice * (selectedMealPlan.gstPer / 100));

      const totalExtraAdultPrice = selectedMealPlan.adultPrice * noExtraAdult * noOfNight;
      const gstExtraAdultPrice = Math.round(totalExtraAdultPrice * (selectedMealPlan.gstPer / 100));

      hotelMeal.push({
        hotelRoomId: hotel.hotelRoomId,
        mealPlan: hotel.mealPlan || selectedMealPlan.mealPlan,
        noOfNight,
        startDateWise: hotel.startDateWise,
        endDateWise: hotel.endDateWise,
        yStartDate: formatDateYYYY(hotel.startDateWise || 0, startDate),
        yEndDate: formatDateYYYY(hotel.endDateWise || 0, startDate),
        fullStartDate: formatDate(hotel.startDateWise || 0, startDate),
        fullEndDate: formatDate(hotel.endDateWise || 0, startDate),
        sort: hotel.sort,
        isAddOn: hotel.isAddOn,
        _id: hotelDetail?._id,
        hotelId: roomData.hotelId,
        hotelName: hotelDetail?.hotelName,
        location: hotelDetail?.location,
        viewPoint: hotelDetail?.viewPoint,
        image: hotelDetail?.image,
        contract: hotelDetail?.contract,
        review: hotelDetail?.review,
        hotelRoomType: roomData.hotelRoomType,
        maxAdult: roomData.maxAdult,
        maxChild: roomData.maxChild,
        maxInf: roomData.maxInf,
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
    });

    // Get vehicle details - check for replacement vehicle from URL
    let vehicleDetailsSource = pkg.vehicleDetails || [];

    // If a specific vehicle was requested via URL param, fetch it
    if (vehicleParam) {
      const requestedVehicle = await Vehicle.findOne({ vehicleId: vehicleParam }).lean();
      if (requestedVehicle) {
        // Replace the vehicle list with the requested vehicle
        vehicleDetailsSource = [requestedVehicle];
      }
    }

    const vehicleDetail = vehicleDetailsSource.map(
      (v: {
        vehicleId: string;
        vehicleName: string;
        price: number;
        seater: number;
        isAc: boolean;
        luggage: number;
        maxPax: number;
        vehicleCompany: string;
        acType: string;
        itineraryName: string[];
        transferInfo: string[];
        inclusion: string[];
        noOfDays: number;
        destinationId: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
        _id: string;
        image: string;
      }) => ({
        _id: v._id,
        vehicleId: v.vehicleId,
        vehicleName: v.vehicleName,
        image: v.image,
        isAc: v.isAc,
        luggage: v.luggage,
        seater: v.seater,
        maxPax: v.maxPax,
        vehicleCompany: v.vehicleCompany,
        acType: v.acType,
        itineraryName: v.itineraryName,
        transferInfo: v.transferInfo,
        inclusion: v.inclusion,
        noOfDays: v.noOfDays,
        price: v.price || 0,
        destinationId: v.destinationId,
        createdAt: v.createdAt,
        updatedAt: v.updatedAt,
        __v: v.__v,
      })
    );

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
      0
    );

    // totalAdditionalFee = noOfNight * noRoomCount * additionalFees
    const totalAdditionalFee = (pkg.noOfNight || 0) * noRoomCount * (pkg.additionalFees || 0);
    // totalTransportFee = transPer * (noAdult + noExtraAdult + noChild)
    const totalTransportFee = (pkg.transPer || 0) * (noAdult + noExtraAdult + noChild);
    const totalVehiclePrice = vehicleDetail.reduce(
      (total: number, v: { price: number }) => total + (v.price || 0),
      0
    );

    // Calculate activity price - use package's activityPrice or sum from events
    let totalActivityPrice = pkg.activityPrice || 0;
    if (totalActivityPrice === 0) {
      totalActivityPrice = (pkg.activity || []).reduce(
        (total: number, act: { event: Array<{ price?: number }> }) => {
          const eventTotal = (act.event || []).reduce(
            (evtTotal: number, evt: { price?: number }) => evtTotal + (evt.price || 0),
            0
          );
          return total + eventTotal;
        },
        0
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
    const agentAmount = Math.round(totalCalculationPrice * (agentCommissionPer / 100));
    const totalPackagePrice = totalCalculationPrice + agentAmount;
    const gstPrice = Math.round(totalPackagePrice * (gstPer / 100));
    const finalPackagePrice = totalPackagePrice + gstPrice;

    const totalAdultCount = noAdult + noExtraAdult;
    const totalChildCount = noChild;

    // perPerson is calculated from totalPackagePrice (before GST), not finalPackagePrice
    let perPerson =
      totalAdultCount > 0 ? Math.round(totalPackagePrice / totalAdultCount) : totalPackagePrice;
    if (perPerson <= 0 && pkg.activityPrice > 0) {
      perPerson = pkg.activityPrice;
    }

    // Calculate counts - matches old backend logic
    const hotelCount = hotelMeal.length || pkg.hotel?.length || 0;
    const vehicleCount = vehicleDetail.length || pkg.vehicle?.length || 0;
    const activityCount = pkg.activity?.length || 0;

    // Format dates
    const fullStartDate = new Date(startDate).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
    const endDateObj = new Date(startDate);
    endDateObj.setDate(endDateObj.getDate() + (pkg.noOfNight || 0));
    const fullEndDate = endDateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
    const checkEndDate = endDateObj.toISOString().split('T')[0];

    // Add fullStartDate to each activity day
    const activityWithDates = (pkg.activity || []).map(
      (act: {
        day: number;
        from: string;
        to: string;
        startDateWise: number;
        event: Array<Record<string, unknown>>;
        _id: string;
      }) => {
        const actDate = new Date(startDate);
        actDate.setDate(actDate.getDate() + (act.startDateWise || 0));
        return {
          ...act,
          fullStartDate: actDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
        };
      }
    );

    // Build the result object matching the old backend format
    const result = {
      _id: pkg._id,
      packageId: pkg.packageId,
      slug: pkg.slug,
      packageName: pkg.packageName,
      packageImg: pkg.packageImg,
      noOfDays: pkg.noOfDays,
      noOfNight: pkg.noOfNight,
      startFrom: pkg.startFrom,
      destination: pkg.destination,
      period: pkg.period,
      activity: activityWithDates,
      offer: pkg.offer,
      status: pkg.status,
      planId: pkg.planId,
      planName: pkg.planName,
      interestId: pkg.interestId,
      perRoom: pkg.perRoom,
      redeemPoint: pkg.redeemPoint,
      inclusionDetail: pkg.inclusionDetail,
      exclusionDetail: pkg.exclusionDetail,
      availableHotel: pkg.availableHotel,
      availableVehicle: pkg.availableVehicle,
      availableActivity: pkg.availableActivity,
      hotelMeal,
      vehicleDetail,
      roomCount: noRoomCount,
      totalAdultCount,
      totalChildCount,
      totalRoomPrice,
      totalAdditionalFee,
      totalTransportFee,
      totalVehiclePrice,
      totalActivityPrice,
      totalCalculationPrice,
      marketingPer,
      agentCommissionPer,
      gstPer,
      additionalFees: pkg.additionalFees,
      transPer: pkg.transPer,
      agentAmount,
      totalPackagePrice,
      gstPrice,
      finalPackagePrice,
      perPerson,
      hotelCount,
      vehicleCount,
      activityCount,
      fullStartDate,
      fullEndDate,
      checkStartDate: startDate,
      checkEndDate,
    };

    // Return the package data in the format expected by the frontend
    return successResponse({ result: [result] }, 'Package retrieved successfully');
  } catch (error) {
    console.error('Get package error:', error);
    return errorResponse('Internal server error', ErrorCodes.INTERNAL_ERROR, 500);
  }
}
