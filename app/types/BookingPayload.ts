import { Activity, Vehicle } from "./pack";
import { HotelMeal } from "./pack";

export interface BookingPayloadType {
  startDate: string;
  paymentType: string;
  redeemCoin: number;
  noAdult: number;
  noChild: number;
  noRoomCount: number;
  noExtraAdult: number;
  couponCode: string | null;
  packageId: string;
  activity: Activity[];
  hotelMeal: HotelMeal[];
  fullStartDate: string;
  fullEndDate: string;
  checkStartDate: string;
  checkEndDate: string;
  vehicleDetail: Vehicle[];
  // Price fields
  finalPackagePrice?: number;
  totalPackagePrice?: number;
  gstPrice?: number;
  gstPer?: number;
  couponDiscount?: number;
}
