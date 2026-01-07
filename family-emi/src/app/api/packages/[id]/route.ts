import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Package from '@/lib/models/Package';
import HotelRoom from '@/lib/models/HotelRoom';
import Hotel from '@/lib/models/Hotel';
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
function getSeasonType(startDate: string, mealPlan: { seasonType: string; startDate: string[]; endDate: string[] }): boolean {
  if (!startDate || !mealPlan.startDate || !mealPlan.endDate) return false;
  const travelDate = new Date(startDate);
  for (let i = 0; i < mealPlan.startDate.length; i++) {
    const seasonStart = new Date(mealPlan.startDate[i]);
    const seasonEnd = new Date(mealPlan.endDate[i]);
    if (travelDate >= seasonStart && travelDate <= seasonEnd) return true;
  }
  return false;
}

function formatDate(daysOffset: number, startDate: string): string {
  const date = new Date(startDate);
  date.setDate(date.getDate() + daysOffset);
  return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
}

function formatDateYYYY(daysOffset: number, startDate: string): string {
  const date = new Date(startDate);
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
}

// GET /api/packages/:id - Get package details by ID with price calculation
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    const url = new URL(request.url);

    const searchParams: SearchParams = {
      startDate: url.searchParams.get('startDate') || undefined,
      noAdult: url.searchParams.get('noAdult') ? parseInt(url.searchParams.get('noAdult')!) : 2,
      noChild: url.searchParams.get('noChild') ? parseInt(url.searchParams.get('noChild')!) : 0,
      noRoomCount: url.searchParams.get('noRoomCount') ? parseInt(url.searchParams.get('noRoomCount')!) : 1,
      noExtraAdult: url.searchParams.get('noExtraAdult') ? parseInt(url.searchParams.get('noExtraAdult')!) : 0,
    };

    const noAdult = searchParams.noAdult || 2;
    const noChild = searchParams.noChild || 0;
    const noRoomCount = searchParams.noRoomCount || 1;
    const noExtraAdult = searchParams.noExtraAdult || 0;
    const startDate = searchParams.startDate || new Date().toISOString().split('T')[0];

    // Get the basic package data
    const packages = await Package.aggregate([
      { $match: { packageId: id } },
      { $lookup: { from: 'destination', localField: 'destination.destinationId', foreignField: 'destinationId', as: 'destinationDetails' } },
      { $lookup: { from: 'inclusion', localField: 'inclusion', foreignField: 'inclusionId', as: 'inclusionDetail' } },
      { $lookup: { from: 'exclusion', localField: 'exclusion', foreignField: 'exclusionId', as: 'exclusionDetail' } },
      { $lookup: { from: 'plan', localField: 'planId', foreignField: 'planId', as: 'planDetails' } },
      { $lookup: { from: 'activity', localField: 'activity.event.activityId', foreignField: 'activityId', as: 'activityDetails' } },
      { $lookup: { from: 'hotelRoom', localField: 'hotel.hotelRoomId', foreignField: 'hotelRoomId', as: 'hotelRoomDetails' } },
      { $lookup: { from: 'hotel', localField: 'hotelRoomDetails.hotelId', foreignField: 'hotelId', as: 'hotelDetails' } },
      { $lookup: { from: 'vehicle', localField: 'vehicle', foreignField: 'vehicleId', as: 'vehicleDetails' } },
      {
        $addFields: {
          destination: {
            $map: {
              input: '$destination', as: 'dest',
              in: {
                $mergeObjects: ['$$dest', {
                  $arrayElemAt: [{ $filter: { input: '$destinationDetails', as: 'dd', cond: { $eq: ['$$dd.destinationId', '$$dest.destinationId'] } } }, 0],
                }],
              },
            },
          },
          activity: {
            $map: {
              input: '$activity', as: 'act',
              in: {
                $mergeObjects: ['$$act', {
                  event: {
                    $map: {
                      input: '$$act.event', as: 'evt',
                      in: {
                        $mergeObjects: ['$$evt', {
                          $arrayElemAt: [{ $filter: { input: '$activityDetails', as: 'ad', cond: { $eq: ['$$ad.activityId', '$$evt.activityId'] } } }, 0],
                        }],
                      },
                    },
                  },
                }],
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
    const hotelRoomIds = (pkg.hotel || []).map((h: { hotelRoomId: string }) => h.hotelRoomId);
    const hotelRoomData = await HotelRoom.find({ hotelRoomId: { $in: hotelRoomIds } }).lean();
    const hotelDetails = await Hotel.find({ hotelId: { $in: hotelRoomData.map(r => r.hotelId) } }).lean();
    const vehicleDetails = await Vehicle.find({ vehicleId: { $in: pkg.vehicle || [] } }).lean();

    // Calculate hotel meal pricing
    const hotelMeal: Array<Record<string, unknown>> = [];
    (pkg.hotel || []).forEach((hotel: { hotelRoomId: string; mealPlan: string; noOfNight: number; startDateWise: number; endDateWise: number; sort: number; isAddOn: boolean }) => {
      const roomData = hotelRoomData.find((r) => r.hotelRoomId === hotel.hotelRoomId);
      if (!roomData) return;
      const hotelDetail = hotelDetails.find((h) => h.hotelId === roomData.hotelId);
      let selectedMealPlan = roomData.mealPlan?.find((mp: { mealPlan: string; startDate: string[]; endDate: string[]; seasonType: string }) =>
        mp.mealPlan === hotel.mealPlan && startDate && getSeasonType(startDate, mp)
      );
      if (!selectedMealPlan) selectedMealPlan = roomData.mealPlan?.find((mp: { mealPlan: string }) => mp.mealPlan === hotel.mealPlan);
      if (!selectedMealPlan && roomData.mealPlan?.length > 0) selectedMealPlan = roomData.mealPlan[0];
      if (!selectedMealPlan) return;

      const noOfNight = hotel.noOfNight || 1;
      const totalAdultPrice = selectedMealPlan.roomPrice * noRoomCount * noOfNight;
      const gstAdultPrice = Math.round(totalAdultPrice * (selectedMealPlan.gstPer / 100));
      const totalChildPrice = selectedMealPlan.childPrice * noChild * noOfNight;
      const gstChildPrice = Math.round(totalChildPrice * (selectedMealPlan.gstPer / 100));
      const totalExtraAdultPrice = selectedMealPlan.adultPrice * noExtraAdult * noOfNight;
      const gstExtraAdultPrice = Math.round(totalExtraAdultPrice * (selectedMealPlan.gstPer / 100));

      hotelMeal.push({
        hotelRoomId: hotel.hotelRoomId, mealPlan: hotel.mealPlan || selectedMealPlan.mealPlan, noOfNight,
        startDateWise: hotel.startDateWise, endDateWise: hotel.endDateWise,
        yStartDate: formatDateYYYY(hotel.startDateWise || 0, startDate), yEndDate: formatDateYYYY(hotel.endDateWise || 0, startDate),
        fullStartDate: formatDate(hotel.startDateWise || 0, startDate), fullEndDate: formatDate(hotel.endDateWise || 0, startDate),
        sort: hotel.sort, isAddOn: hotel.isAddOn, _id: hotelDetail?._id, hotelId: roomData.hotelId,
        hotelName: hotelDetail?.hotelName, location: hotelDetail?.location, viewPoint: hotelDetail?.viewPoint,
        image: hotelDetail?.image, contract: hotelDetail?.contract, review: hotelDetail?.review,
        hotelRoomType: roomData.hotelRoomType, maxAdult: roomData.maxAdult, maxChild: roomData.maxChild,
        maxInf: roomData.maxInf, roomCapacity: roomData.roomCapacity, isAc: roomData.isAc,
        hotelMealId: selectedMealPlan.hotelMealId, roomPrice: selectedMealPlan.roomPrice, gstPer: selectedMealPlan.gstPer,
        adultPrice: selectedMealPlan.adultPrice, childPrice: selectedMealPlan.childPrice, seasonType: selectedMealPlan.seasonType,
        startDatePrice: selectedMealPlan.startDate, endDatePrice: selectedMealPlan.endDate,
        totalAdultPrice, gstAdultPrice, totalChildPrice, gstChildPrice, totalExtraAdultPrice, gstExtraAdultPrice,
      });
    });

    // Continued in next section...
    const vehicleDetail = vehicleDetails.map((v) => ({
      _id: v._id, vehicleId: v.vehicleId, vehicleName: v.vehicleName, image: v.image, isAc: v.isAc,
      luggage: v.luggage, seater: v.seater, maxPax: v.maxPax, vehicleCompany: v.vehicleCompany, acType: v.acType,
      itineraryName: v.itineraryName, transferInfo: v.transferInfo, inclusion: v.inclusion, noOfDays: v.noOfDays,
      price: v.price || 0, destinationId: v.destinationId,
    }));

    // Calculate totals
    const totalRoomPrice = hotelMeal.reduce((total, hm) => total + ((hm.totalAdultPrice as number) || 0) + ((hm.totalChildPrice as number) || 0) + ((hm.totalExtraAdultPrice as number) || 0) + ((hm.gstAdultPrice as number) || 0) + ((hm.gstChildPrice as number) || 0) + ((hm.gstExtraAdultPrice as number) || 0), 0);
    const totalAdditionalFee = (pkg.noOfNight || 0) * noRoomCount * (pkg.additionalFees || 0);
    const totalTransportFee = (pkg.transPer || 0) * (noAdult + noExtraAdult + noChild);
    const totalVehiclePrice = vehicleDetail.reduce((total, v) => total + (v.price || 0), 0);
    let totalActivityPrice = pkg.activityPrice || 0;
    if (totalActivityPrice === 0) totalActivityPrice = (pkg.activity || []).reduce((total: number, act: { event: Array<{ price?: number }> }) => total + (act.event || []).reduce((evtTotal: number, evt: { price?: number }) => evtTotal + (evt.price || 0), 0), 0);
    const marketingPer = pkg.marketingPer || 0;
    const agentCommissionPer = pkg.agentCommissionPer || 0;
    const gstPer = pkg.gstPer || 5;
    const totalCalculationPrice = totalRoomPrice + totalAdditionalFee + totalTransportFee + marketingPer + totalVehiclePrice + totalActivityPrice;
    const agentAmount = Math.round(totalCalculationPrice * (agentCommissionPer / 100));
    const totalPackagePrice = totalCalculationPrice + agentAmount;
    const gstPrice = Math.round(totalPackagePrice * (gstPer / 100));
    const finalPackagePrice = totalPackagePrice + gstPrice;
    const totalAdultCount = noAdult + noExtraAdult;
    let perPerson = totalAdultCount > 0 ? Math.round(totalPackagePrice / totalAdultCount) : totalPackagePrice;
    if (perPerson <= 0 && pkg.activityPrice > 0) perPerson = pkg.activityPrice;
    const hotelCount = hotelMeal.length || pkg.hotel?.length || 0;
    const vehicleCount = vehicleDetail.length || pkg.vehicle?.length || 0;
    const activityCount = pkg.activity?.length || 0;
    const fullStartDate = new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const endDateObj = new Date(startDate); endDateObj.setDate(endDateObj.getDate() + (pkg.noOfNight || 0));
    const fullEndDate = endDateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const checkEndDate = endDateObj.toISOString().split('T')[0];
    const activityWithDates = (pkg.activity || []).map((act: { day: number; from: string; to: string; startDateWise: number; event: Array<Record<string, unknown>>; _id: string }) => {
      const actDate = new Date(startDate); actDate.setDate(actDate.getDate() + (act.startDateWise || 0));
      return { ...act, fullStartDate: actDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short' }) };
    });

    const result = {
      _id: pkg._id, packageId: pkg.packageId, slug: pkg.slug, packageName: pkg.packageName, packageImg: pkg.packageImg,
      noOfDays: pkg.noOfDays, noOfNight: pkg.noOfNight, startFrom: pkg.startFrom, destination: pkg.destination,
      period: pkg.period, activity: activityWithDates, offer: pkg.offer, status: pkg.status, planId: pkg.planId,
      planName: pkg.planName, interestId: pkg.interestId, perRoom: pkg.perRoom, redeemPoint: pkg.redeemPoint,
      inclusionDetail: pkg.inclusionDetail, exclusionDetail: pkg.exclusionDetail, availableHotel: pkg.availableHotel,
      availableVehicle: pkg.availableVehicle, availableActivity: pkg.availableActivity, hotelMeal, vehicleDetail,
      roomCount: noRoomCount, totalAdultCount, totalChildCount: noChild, totalRoomPrice, totalAdditionalFee,
      totalTransportFee, totalVehiclePrice, totalActivityPrice, totalCalculationPrice, marketingPer, agentCommissionPer,
      gstPer, additionalFees: pkg.additionalFees, transPer: pkg.transPer, agentAmount, totalPackagePrice,
      gstPrice, finalPackagePrice, perPerson, hotelCount, vehicleCount, activityCount, fullStartDate, fullEndDate,
      checkStartDate: startDate, checkEndDate,
    };

    return successResponse({ result: [result] }, 'Package retrieved successfully');
  } catch (error) {
    console.error('Get package error:', error);
    return errorResponse('Internal server error', ErrorCodes.INTERNAL_ERROR, 500);
  }
}

