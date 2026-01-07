import { HotelChangeDataType, HotelMealType, HotelRoom } from '@/app/types/hotel';
import { HotelMeal, PackType, Vehicle } from '@/app/types/pack';
import { VehicleDetail } from '@/app/types/vehicle';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PackageSliceType {
  data: PackType;
  isLoading: boolean;
  error: string;
  isActivityUpdated: boolean;
  isHotelUpdated: boolean;
  isVehicleUpdated: boolean;
}

interface changeActivityType {
  slot: number;
  day: number;
  activity: any[];
}

export interface PackageGetQuery {
  packageId: string; // Can be either packageId or slug
  startDate: string;
  noAdult: number;
  noChild: number;
  noRoomCount: number;
  noExtraAdult: number;
  hotels?: string;
}

interface ChangeVehicleType {
  prevVehicle: VehicleDetail;
  newVehicle: VehicleDetail;
}

const initialState: PackageSliceType = {
  isLoading: true,
  data: {} as PackType,
  error: '',
  isActivityUpdated: false,
  isHotelUpdated: false,
  isVehicleUpdated: false,
};

// Local API base URL
const API_BASE_URL = '/api/v1';

// Detect if the identifier is a Package ID or slug
// Package IDs have pattern: uppercase letters + numbers + dashes (e.g., GOKODCO-D2QO-3D2N4A)
// Slugs are lowercase with format: name-Nn-Nd-hash (e.g., romantic-manali-3n4d-a7xp)
function isPackageId(identifier: string): boolean {
  // Package IDs are typically uppercase with a specific pattern
  // Check if it's all uppercase/numbers/dashes and matches the ID pattern
  return (
    /^[A-Z0-9]+-[A-Z0-9]+-\d+D\d+N\d+A$/.test(identifier) || /^[A-Z][A-Z0-9-]+$/.test(identifier)
  );
}

export const fetchPackage = createAsyncThunk(
  'package/fetchPackage',
  async (payload: PackageGetQuery) => {
    const params: any = {
      startDate: payload.startDate || '',
      noAdult: (payload.noAdult || 2).toString(),
      noChild: (payload.noChild || 0).toString(),
      noRoomCount: (payload.noRoomCount || 1).toString(),
      noExtraAdult: (payload.noExtraAdult || 0).toString(),
    };
    if (payload.hotels) {
      params.hotels = payload.hotels;
    }
    const queryParams = new URLSearchParams(params).toString();

    const identifier = payload.packageId;

    // Determine which endpoint to use
    let url: string;
    if (isPackageId(identifier)) {
      // Use existing Package ID endpoint
      url = `${API_BASE_URL}/packages/${identifier}?${queryParams}`;
    } else {
      // Use new slug endpoint
      url = `${API_BASE_URL}/packages/bySlug/${identifier}?${queryParams}`;
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // If slug lookup fails with 404, try as Package ID (fallback for edge cases)
      if (!response.ok && !isPackageId(identifier)) {
        console.log('Slug lookup failed, trying as Package ID...');
        const fallbackUrl = `${API_BASE_URL}/packages/${identifier}?${queryParams}`;
        const fallbackResponse = await fetch(fallbackUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!fallbackResponse.ok) {
          throw new Error(`HTTP error! status: ${fallbackResponse.status}`);
        }

        const fallbackData = await fallbackResponse.json();
        // Handle various response formats (same as main response)
        if (fallbackData.success && fallbackData.data?.result) {
          return {
            result: Array.isArray(fallbackData.data.result)
              ? fallbackData.data.result
              : [fallbackData.data.result],
          };
        }
        if (fallbackData.success && fallbackData.result) {
          return {
            result: Array.isArray(fallbackData.result)
              ? fallbackData.result
              : [fallbackData.result],
          };
        }
        if (fallbackData.result) {
          return {
            result: Array.isArray(fallbackData.result)
              ? fallbackData.result
              : [fallbackData.result],
          };
        }
        return {
          result: Array.isArray(fallbackData)
            ? (fallbackData as PackType[])
            : [fallbackData as PackType],
        };
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle various response formats:
      // 1. Local API: { success: true, data: { result: [...] } }
      // 2. External API: { success: true, result: { ... } } (result is object, not array)
      // 3. Direct array response

      if (data.success && data.data?.result) {
        // Local API format
        return { result: Array.isArray(data.data.result) ? data.data.result : [data.data.result] };
      }
      if (data.success && data.result) {
        // External API format - result can be object or array
        return { result: Array.isArray(data.result) ? data.result : [data.result] };
      }
      if (data.result) {
        // Fallback for result field
        return { result: Array.isArray(data.result) ? data.result : [data.result] };
      }
      // If data is the package directly or an array
      return { result: Array.isArray(data) ? (data as PackType[]) : [data as PackType] };
    } catch (error) {
      console.error('Error fetching package:', error);
      throw new Error('Failed to fetch package');
    }
  }
);

export const calculatePrice = createAsyncThunk(
  'package/calculatePrice',
  async (payload: { package: PackType }) => {
    // Call the local API for price calculation
    const url = `${API_BASE_URL}/packages/price/quote`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { result: data.data || data.result || data };
    } catch (error) {
      console.error('Error calculating price:', error);
      throw new Error('Failed to calculate price');
    }
  }
);

const packageSlice = createSlice({
  name: 'package',
  initialState,
  reducers: {
    initializePackage: (state: PackageSliceType) => {
      state.isLoading = true;
      state.data = {} as PackType;
      state.error = '';
      state.isActivityUpdated = false;
      state.isHotelUpdated = false;
      state.isVehicleUpdated = false;
    },
    changeActivity: (state: PackageSliceType, action: PayloadAction<changeActivityType>) => {
      state.isLoading = true;
      const { slot, day, activity } = action.payload;
      const updatedData = state.data?.activity?.map(dayItem => {
        if (dayItem.day === day) {
          const updatedEvents = dayItem.event.map((slotItem: any) => {
            if (slotItem.slot === slot) {
              return { ...slotItem, ...activity, activityType: 'allocated' };
            } else {
              return slotItem;
            }
          });
          return { ...dayItem, event: updatedEvents };
        } else {
          return dayItem;
        }
      });
      state.isActivityUpdated = true;
      state.data.activity = updatedData;
    },
    changeHotel: (
      state: PackageSliceType,
      action: PayloadAction<{
        mealPlan: HotelMealType;
        hotelRoom: HotelRoom;
        hotel: HotelChangeDataType;
        prevHotel: HotelMeal;
      }>
    ) => {
      state.isLoading = true;
      const { mealPlan, hotelRoom, hotel, prevHotel } = action.payload;
      const updatedData = state.data?.hotelMeal?.map(hotelItem => {
        if (
          hotelItem.hotelId === prevHotel.hotelId &&
          hotelItem.hotelRoomType === prevHotel.hotelRoomType &&
          hotelItem.sort === prevHotel.sort
        ) {
          return {
            hotelRoomId: mealPlan.hotelRoomId,
            mealPlan: mealPlan.mealPlan,
            noOfNight: prevHotel.noOfNight,
            startDateWise: prevHotel.startDateWise,
            endDateWise: prevHotel.endDateWise,
            sort: prevHotel.sort,
            isAddOn: prevHotel.isAddOn,
            _id: hotel._id,
            hotelId: hotel.hotelId,
            hotelName: hotel.hotelName,
            location: hotel.location,
            viewPoint: hotel.viewPoint,
            image: hotel.image,
            contract: hotel.contract,
            __v: hotel.__v,
            review: hotel.review,
            hotelRoomType: hotelRoom.hotelRoomType,
            maxAdult: hotelRoom.maxAdult,
            maxChild: hotelRoom.maxChild,
            maxInf: hotelRoom.maxInf,
            roomCapacity: hotelRoom.roomCapacity,
            isAc: hotelRoom.isAc,
            hotelMealId: mealPlan.hotelMealId,
            roomPrice: mealPlan.roomPrice,
            gstPer: mealPlan.gstPer,
            adultPrice: mealPlan.adultPrice,
            childPrice: mealPlan.childPrice,
            seasonType: mealPlan.seasonType,
            startDate: mealPlan.startDate,
            endDate: mealPlan.endDate,
            yStartDate: prevHotel.yStartDate,
            yEndDate: prevHotel.yEndDate,
            fullStartDate: prevHotel.fullStartDate,
            fullEndDate: prevHotel.fullEndDate,
            totalAdultPrice: mealPlan.totalAdultPrice,
            gstAdultPrice: mealPlan.gstAdultPrice,
            totalChildPrice: mealPlan.totalChildPrice,
            gstChildPrice: mealPlan.gstChildPrice,
            totalExtraAdultPrice: mealPlan.totalExtraAdultPrice,
            gstExtraAdultPrice: mealPlan.gstExtraAdultPrice,
          };
        } else {
          return hotelItem;
        }
      });
      state.isHotelUpdated = true;
      state.data.hotelMeal = updatedData;
    },
    changeRoom: (
      state: PackageSliceType,
      action: PayloadAction<{
        mealPlan: HotelMealType;
        hotelRoom: HotelRoom;
        prevHotel: HotelMeal;
      }>
    ) => {
      state.isLoading = true;
      const { mealPlan, hotelRoom, prevHotel } = action.payload;
      const updatedData = state.data?.hotelMeal?.map(hotelItem => {
        if (
          hotelItem.hotelId === prevHotel.hotelId &&
          hotelItem.hotelRoomId === prevHotel.hotelRoomId
        ) {
          return {
            hotelRoomId: mealPlan.hotelRoomId,
            mealPlan: mealPlan.mealPlan,
            noOfNight: prevHotel.noOfNight,
            startDateWise: prevHotel.startDateWise,
            endDateWise: prevHotel.endDateWise,
            sort: prevHotel.sort,
            isAddOn: prevHotel.isAddOn,
            _id: prevHotel._id,
            hotelId: prevHotel.hotelId,
            hotelName: prevHotel.hotelName,
            location: prevHotel.location,
            viewPoint: prevHotel.viewPoint,
            image: prevHotel.image,
            contract: prevHotel.contract,
            __v: prevHotel.__v,
            review: prevHotel.review,
            hotelRoomType: hotelRoom.hotelRoomType,
            maxAdult: hotelRoom.maxAdult,
            maxChild: hotelRoom.maxChild,
            maxInf: hotelRoom.maxInf,
            roomCapacity: hotelRoom.roomCapacity,
            isAc: hotelRoom.isAc,
            hotelMealId: mealPlan.hotelMealId,
            roomPrice: mealPlan.roomPrice,
            gstPer: mealPlan.gstPer,
            adultPrice: mealPlan.adultPrice,
            childPrice: mealPlan.childPrice,
            seasonType: mealPlan.seasonType,
            startDate: mealPlan.startDate,
            endDate: mealPlan.endDate,
            fullStartDate: prevHotel.fullStartDate,
            fullEndDate: prevHotel.fullEndDate,
            yStartDate: prevHotel.yStartDate,
            yEndDate: prevHotel.yEndDate,
            totalAdultPrice: mealPlan.totalAdultPrice,
            gstAdultPrice: mealPlan.gstAdultPrice,
            totalChildPrice: mealPlan.totalChildPrice,
            gstChildPrice: mealPlan.gstChildPrice,
            totalExtraAdultPrice: mealPlan.totalExtraAdultPrice,
            gstExtraAdultPrice: mealPlan.gstExtraAdultPrice,
          };
        } else {
          return hotelItem;
        }
      });
      state.isHotelUpdated = true;
      state.data.hotelMeal = updatedData;
    },
    changeVehicle: (state: PackageSliceType, action: PayloadAction<ChangeVehicleType>) => {
      state.isLoading = true;
      const { prevVehicle, newVehicle } = action.payload;

      const updatedVehicles = state.data?.vehicleDetail?.map((vehicle): Vehicle => {
        if (vehicle.vehicleId === prevVehicle.vehicleId) {
          return {
            _id: newVehicle._id,
            vehicleId: newVehicle.vehicleId,
            vehicleName: newVehicle.vehicleName,
            image: newVehicle.image,
            isAc: true, // Explicitly set to true to match Vehicle type
            luggage: newVehicle.luggage,
            seater: newVehicle.seater,
            maxPax: newVehicle.maxPax,
            vehicleCompany: newVehicle.vehicleCompany,
            acType: newVehicle.acType,
            itineraryName: newVehicle.itineraryName,
            transferInfo: newVehicle.transferInfo,
            inclusion: newVehicle.inclusion,
            noOfDays: newVehicle.noOfDays,
            price: newVehicle.price,
            destinationId: newVehicle.destinationId,
            createdAt: newVehicle.createdAt,
            updatedAt: newVehicle.updatedAt,
            __v: newVehicle.__v,
          } as Vehicle;
        }
        return vehicle;
      });

      state.isVehicleUpdated = true;
      state.data.vehicleDetail = updatedVehicles;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchPackage.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(fetchPackage.fulfilled, (state, action) => {
      state.data = action.payload?.result[0];
      state.isLoading = false;
      state.error = '';
    });
    builder.addCase(fetchPackage.rejected, (state, action) => {
      state.isLoading = false;
      state.data = {} as PackType;
      state.error = action.error.message || 'Error fetching package data';
    });
    builder.addCase(calculatePrice.fulfilled, (state, action) => {
      state.data = {
        ...state.data,
        ...action.payload.result,
      };
      state.isLoading = false;
      state.error = '';
    });
    builder.addCase(calculatePrice.pending, (state, action) => {
      state.isLoading = true;
      state.error = '';
    });
    builder.addCase(calculatePrice.rejected, (state, action) => {
      state.data = {
        ...state.data,
      };
      state.isLoading = false;
      state.error = 'error occured while calculating price';
    });
  },
});

export const { changeActivity, changeRoom, changeHotel, initializePackage, changeVehicle } =
  packageSlice.actions;

export default packageSlice.reducer;

export const changeActivityAndCalculatePrice = (payload: changeActivityType) => {
  return async (dispatch: any, getState: any) => {
    dispatch(changeActivity(payload));
    const { package: packageState } = getState();
    await dispatch(calculatePrice({ package: packageState.data }));
  };
};

export const changeHotelAndCalculatePrice = (payload: {
  mealPlan: HotelMealType;
  hotelRoom: HotelRoom;
  hotel: HotelChangeDataType;
  prevHotel: HotelMeal;
}) => {
  return async (dispatch: any, getState: any) => {
    dispatch(changeHotel(payload));
    const { package: packageState } = getState();
    await dispatch(calculatePrice({ package: packageState.data }));
  };
};

export const changeVehicleAndCalculatePrice = (payload: ChangeVehicleType) => {
  return async (dispatch: any, getState: any) => {
    dispatch(changeVehicle(payload));
    const { package: packageState } = getState();
    await dispatch(calculatePrice({ package: packageState.data }));
  };
};

export const changeRoomAndCalculatePrice = (payload: {
  mealPlan: HotelMealType;
  hotelRoom: HotelRoom;
  prevHotel: HotelMeal;
}) => {
  return async (dispatch: any, getState: any) => {
    dispatch(changeRoom(payload));
    const { package: packageState } = getState();
    await dispatch(calculatePrice({ package: packageState.data }));
  };
};
