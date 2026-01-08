// number
// string
export interface PackDestination {
  destinationId: string;
  noOfNight: number;
  _id: string;
  destinationType: string;
  rankNo: number;
  destinationName: string;
  __v: number;
}
export interface Activity {
  day: number;
  from: string;
  to: string;
  startDateWise: number;
  event: ActivityEvent[];
  _id: string;
  fullStartDate: string;
}
export interface ActivityEvent {
  slot: number;
  activityType: string;
  activityId: string | null;
  timePeriod: string;
  _id: string;
  name: string;
  image: string;
  price: number;
  destinationId: string;
  description: string;
  __v: number;
}
interface Period {
  startDate: string;
  endDate: string;
  _id: string;
}
export interface HotelMeal {
  hotelRoomId: string;
  mealPlan: "cp" | "map" | "ap" | "ep";
  noOfNight: number;
  startDateWise: number;
  endDateWise: number;
  sort: number;
  isAddOn: false;
  _id: string;
  hotelId: string;
  hotelName: string;
  location: HotelMealLocation;
  viewPoint: string[];
  image: string;
  contract: HotelMealContact;
  __v: number;
  review: number;
  hotelRoomType: string;
  maxAdult: number;
  maxChild: number;
  maxInf: number;
  roomCapacity: number;
  isAc: boolean;
  hotelMealId: string;
  roomPrice: number;
  gstPer: number;
  adultPrice: number;
  childPrice: number;
  seasonType: string;
  startDate: string[];
  endDate: string[];
  yStartDate: string;
  yEndDate: string;
  fullStartDate: string;
  fullEndDate: string;
  totalAdultPrice: number;
  gstAdultPrice: number;
  totalChildPrice: number;
  gstChildPrice: number;
  totalExtraAdultPrice: number;
  gstExtraAdultPrice: number;
}
export interface HotelMealLocation {
  destinationId: string;
  lat: string;
  address: string;
  state: string;
  country: string;
  _id: string;
}
export interface HotelMealContact {
  businessEmail: string;
  additionalEmail: string;
  maintainerPhoneNo: number;
  _id: string;
}
export interface Vehicle {
  _id: string;
  vehicleId: string;
  vehicleName: string;
  image: string;
  isAc: true;
  luggage: number;
  seater: number;
  maxPax: number;
  vehicleCompany: string;
  acType: string;
  itineraryName: string[];
  transferInfo: string[];
  inclusion: string[];
  noOfDays: number;
  price: number;
  destinationId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface Inclusion {
  _id: string;
  inclusionId: string;
  name: string;
  image: string;
  __v: number;
}
export interface Exclusion {
  _id: string;
  exclusionId: string;
  name: string;
  __v: number;
}
export interface PackType {
  _id: string;
  packageId: string;
  slug?: string;
  packageName: string;
  destination: PackDestination[];
  startFrom: string;
  packageImg: string[];
  noOfDays: number;
  noOfNight: number;
  activity: Activity[];
  marketingPer: number;
  agentCommissionPer: number;
  gstPer: number;
  period: Period[];
  hotelMeal: HotelMeal[];
  totalRoomPrice: number;
  totalAdditionalFee: number;
  totalTransportFee: number;
  totalVehiclePrice: number;
  totalActivityPrice: number;
  totalCalculationPrice: number;
  AgentAmount: number;
  totalPackagePrice: number;
  gstPrice: number;
  finalPackagePrice: number;
  roomCount: number;
  totalAdultCount: number;
  totalChildCount: number;
  fullStartDate: string;
  fullEndDate: string;
  checkStartDate: string;
  checkEndDate: string;
  planName: string;
  vehicleCount: number;
  vehicleDetail: Vehicle[];
  inclusionDetail: Inclusion[];
  exclusionDetail: Exclusion[];
  hotelCount: number;
  activityCount: number;
  perPerson: number;
}
