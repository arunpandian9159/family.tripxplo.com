import { HotelMealContact, HotelMealLocation } from "./pack";

export interface HotelChangeDataType {
  _id: string;
  hotelId: string;
  hotelName: string;
  location: HotelMealLocation;
  viewPoint: string[];
  image: string;
  contract: HotelMealContact;
  amenities: string[];
  __v: number;
  review: number;
  hotelRoom: HotelRoom[];
}
export interface HotelRoom {
  _id: string;
  hotelId: string;
  hotelRoomId: string;
  hotelRoomType: string;
  maxAdult: number;
  maxChild: number;
  maxInf: number;
  roomCapacity: number;
  isAc: boolean;
  amenities: string[]; // full data required
  mealPlan: HotelMealType[];
  __v: number;
  amenitiesDetails: AmenitiesType[]
}
export interface AmenitiesType {
  _id: string;
  amenitiesId: string;
  name: string;
  image: string;
  __v: number;
}
export interface HotelMealType {
  hotelId: string;
  hotelRoomId: string;
  hotelMealId: string;
  mealPlan: "cp" | "map" | "ap" | "ep";
  roomPrice: number;
  gstPer: number;
  adultPrice: number;
  childPrice: number;
  seasonType: string;
  startDate: string[];
  endDate: string[];
  _id: string;
  totalAdultPrice: number;
  gstAdultPrice: number;
  totalChildPrice: number;
  gstChildPrice: number;
  totalExtraAdultPrice: number;
  gstExtraAdultPrice: number;
}
