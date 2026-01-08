export interface VehicleDetail {
  _id: string;
  vehicleId: string;
  vehicleName: string;
  image: string;
  isAc: boolean;
  luggage: number;
  seater: number;
  maxPax: number;
  vehicleCompany: string;
  acType: "Private" | string;
  itineraryName: string[];
  transferInfo: string[];
  inclusion: string[];
  noOfDays: number;
  price: number;
  destinationId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  // Price calculation fields (added by external API)
  totalAdultPrice?: number;
  gstAdultPrice?: number;
  totalChildPrice?: number;
  gstChildPrice?: number;
  totalExtraAdultPrice?: number;
  gstExtraAdultPrice?: number;
}

export type VehicleDetails = VehicleDetail[];
