export interface PackageQuery {
  category: string;
  destination: string;
  date: string;
  stay: Stay;
}

export interface Stay {
  room: number;
  adult: number;
  children: number;
}

export interface DestinationType {
  destinationId: string;
  destinationName: string;
  destinationType: string;
  rankNo: number;

  _id: string;
}

export type DestinationState = {
  inputFocused: boolean;
  query: string;
  searchedDestinations: DestinationType[];
  selectedDestination: DestinationType | null;
};

export type searchPackage = {
  pack: string;
  date: Date;
  destination: string;
  specs: {
    room: number;
    adults: number;
    child: number;
  };
};

export type DestinationAction =
  | { type: "SET_QUERY"; payload: string }
  | { type: "SET_SEARCHED_DESTINATIONS"; payload: DestinationType[] }
  | { type: "SET_INPUT_FOCUSED"; payload: boolean }
  | { type: "SET_SELECTED_DESTINATION"; payload: DestinationType | null };

export interface Interest {
  image: string;
  interestId: string;
  interestName: string;
  isFirst: boolean;
  sort: number;
  _id: string;
}

export interface Coupon {
  code: string;
  couponId: string;
  couponName: string;
  description: string | null;
  isPublic: boolean;
  userId: string | null;
  validDate: string;
  value: number;
  valueType: string;
  __v: number;
  _id: string;
}

export interface UserProfile {
  fullName: string;
  dob: string;
  email: string;
  mobileNo: string;
  pinCode: string;
  profileImg: string;
  gender: string;
}
