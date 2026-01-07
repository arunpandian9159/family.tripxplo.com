// Package types for family-emi
export interface PackageDestination {
  destinationId: string;
  destinationName: string;
  noOfNight: number;
}

export interface FeaturedPackage {
  _id: string;
  packageId: string;
  packageName: string;
  packageImg: string[];
  noOfDays: number;
  noOfNight: number;
  perPerson: number;
  destination: PackageDestination[];
  offer: number;
  status: boolean;
  planName?: string;
  hotelCount?: number;
  vehicleCount?: number;
  activityCount?: number;
  startFrom?: string;
}

export interface SearchPackage extends FeaturedPackage {
  startFrom?: string;
}

export interface HotelMeal {
  hotelRoomId: string;
  mealPlan: string;
  noOfNight: number;
  hotelName?: string;
  location?: {
    destinationId: string;
    address: string;
    state: string;
    country: string;
  };
  image?: string;
  review?: number;
  hotelRoomType?: string;
  maxAdult?: number;
  maxChild?: number;
  roomCapacity?: number;
  isAc?: boolean;
  roomPrice?: number;
  fullStartDate?: string;
  fullEndDate?: string;
  totalAdultPrice?: number;
  totalChildPrice?: number;
  totalExtraAdultPrice?: number;
}

export interface VehicleDetail {
  vehicleId: string;
  vehicleName: string;
  image?: string;
  isAc?: boolean;
  seater?: number;
  luggage?: number;
  maxPax?: number;
  price?: number;
  itineraryName?: string[];
  transferInfo?: string[];
  inclusion?: string[];
}

export interface ActivityEvent {
  activityId?: string;
  activityName?: string;
  activityImg?: string;
  timePeriod?: string;
  activityType?: string;
  description?: string;
  price?: number;
}

export interface Activity {
  day: number;
  from?: string;
  to?: string;
  fullStartDate?: string;
  event: ActivityEvent[];
}

export interface InclusionExclusion {
  inclusionId?: string;
  exclusionId?: string;
  name: string;
  description?: string;
}

export interface PackageDetail {
  _id: string;
  packageId: string;
  slug?: string;
  packageName: string;
  packageImg: string[];
  noOfDays: number;
  noOfNight: number;
  startFrom?: string;
  destination: Array<{
    destinationId: string;
    destinationName: string;
    noOfNight: number;
  }>;
  period?: Array<{ startDate: string; endDate: string }>;
  activity: Activity[];
  offer: number;
  status: boolean;
  planId?: string;
  planName?: string;
  inclusionDetail: InclusionExclusion[];
  exclusionDetail: InclusionExclusion[];
  hotelMeal: HotelMeal[];
  vehicleDetail: VehicleDetail[];
  roomCount: number;
  totalAdultCount: number;
  totalChildCount: number;
  totalRoomPrice: number;
  totalAdditionalFee: number;
  totalTransportFee: number;
  totalVehiclePrice: number;
  totalActivityPrice: number;
  totalCalculationPrice: number;
  marketingPer: number;
  agentCommissionPer: number;
  gstPer: number;
  agentAmount: number;
  totalPackagePrice: number;
  gstPrice: number;
  finalPackagePrice: number;
  perPerson: number;
  hotelCount: number;
  vehicleCount: number;
  activityCount: number;
  fullStartDate: string;
  fullEndDate: string;
  checkStartDate: string;
  checkEndDate: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

export interface SearchFilters {
  destination?: string;
  minPrice?: number;
  maxPrice?: number;
  minDays?: number;
  maxDays?: number;
  sort?: 'price_asc' | 'price_desc' | 'days_asc' | 'days_desc' | 'default';
  query?: string;
}
