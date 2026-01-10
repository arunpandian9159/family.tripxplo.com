import mongoose, { Document, Model } from "mongoose";

interface IDestinationRef {
  destinationId: string;
  destinationName: string;
  noOfNight: number;
}

interface IHotelMeal {
  hotelRoomId: string;
  hotelId?: string;
  hotelName?: string;
  image?: string;
  hotelRoomType?: string;
  viewPoint?: string[];
  location?: {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    lat?: string;
    lon?: string;
  };
  mealPlan: "ep" | "cp" | "map" | "ap";
  noOfNight: number;
  startDateWise: number;
  endDateWise: number;
  sort: number;
  price: number;
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
  isAddOn: boolean;
  review?: number;
  isAc?: boolean;
}

interface IActivityEvent {
  slot: number;
  activityType: "free" | "allocated" | "travel";
  activityId?: string;
  name?: string;
  image?: string;
  description?: string;
  timePeriod: "morning" | "noon" | "evening" | "noon-evening" | "full-day";
  price: number;
}

interface IActivity {
  day: number;
  from: string;
  to: string;
  startDateWise: number;
  event: IActivityEvent[];
}

interface IPeriod {
  startDate: string;
  endDate: string;
}

interface IEmiSchedule {
  installmentNumber: number;
  amount: number;
  dueDate: Date;
  status: "pending" | "paid" | "failed";
  paymentId?: string;
  transactionId?: string;
  paidAt?: Date;
}

interface IEmiDetails {
  isEmiBooking: boolean;
  totalTenure: number;
  monthlyAmount: number;
  totalAmount: number;
  paidCount: number;
  nextDueDate: Date;
  schedule: IEmiSchedule[];
}

export interface IBooking extends Document {
  bookingId: string;
  packageRootId: string;
  packageName: string;
  userId: string;
  planId?: string;
  planName?: string;
  interestId?: string;
  interestName?: string;
  destination: IDestinationRef[];
  startFrom: string;
  perRoom: number;
  packageImg: string[];
  noOfDays: number;
  noOfNight: number;
  noOfAdult: number;
  noOfChild: number;
  noAdult: number;
  noChild: number;
  noExtraAdult: number;
  noRoomCount: number;
  offer: number;
  hotelMeal: IHotelMeal[];
  vehicleDetail: any[];
  period: IPeriod[];
  activity: any[];
  bonusRedeemCoin: number;
  vehicleCount: number;
  hotelCount: number;
  activityCount: number;
  inclusionDetail: any[];
  exclusionDetail: any[];
  additionalFees: number;
  marketingPer: number;
  transPer: number;
  agentCommissionPer: number;
  gstPer: number;
  status:
    | "pending"
    | "waiting"
    | "approval"
    | "completed"
    | "failed"
    | "cancel";
  checkStartDate: string;
  checkEndDate: string;
  fullStartDate: string;
  fullEndDate: string;
  totalRoomPrice: number;
  totalAdditionalFee: number;
  totalTransportFee: number;
  totalVehiclePrice: number;
  totalActivityPrice: number;
  totalCalculationPrice: number;
  agentAmount: number;
  totalPackagePrice: number;
  gstPrice: number;
  perPerson: number;
  packagePrice: number;
  couponCode?: string;
  discountType?: "percentage" | "amount";
  discountValue: number;
  paymentDate?: string;
  discountPrice: number;
  finalPrice: number;
  isPrepaid: boolean;
  claimRedeemCoin: number;
  redeemCoin: number;
  redeemAmount: number;
  balanceAmount: number;
  emiDetails?: IEmiDetails;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new mongoose.Schema<IBooking>(
  {
    bookingId: { type: String, required: true, unique: true },
    packageRootId: { type: String },
    packageName: { type: String },
    userId: { type: String, required: true },
    planId: { type: String },
    planName: { type: String },
    interestId: { type: String },
    interestName: { type: String },
    destination: {
      type: [
        {
          destinationId: { type: String },
          destinationName: { type: String },
          noOfNight: { type: Number, default: 0 },
        },
      ],
      default: [],
    },
    startFrom: { type: String },
    perRoom: { type: Number, default: 0 },
    packageImg: { type: [String], default: [] },
    noOfDays: { type: Number, default: 0 },
    noOfNight: { type: Number, default: 0 },
    noOfAdult: { type: Number, default: 0 },
    noOfChild: { type: Number, default: 0 },
    noAdult: { type: Number, default: 0 },
    noChild: { type: Number, default: 0 },
    noExtraAdult: { type: Number, default: 0 },
    noRoomCount: { type: Number, default: 0 },
    offer: { type: Number, default: 0 },
    hotelMeal: {
      type: [
        {
          hotelRoomId: { type: String },
          hotelId: { type: String },
          hotelName: { type: String },
          image: { type: String },
          hotelRoomType: { type: String },
          viewPoint: { type: [String], default: [] },
          location: {
            address: { type: String },
            city: { type: String },
            state: { type: String },
            country: { type: String },
            lat: { type: String },
            lon: { type: String },
          },
          mealPlan: {
            type: String,
            enum: ["ep", "cp", "map", "ap"],
            default: "ep",
          },
          noOfNight: { type: Number, default: 0 },
          startDateWise: { type: Number, default: 0 },
          endDateWise: { type: Number, default: 0 },
          sort: { type: Number, default: 0 },
          price: { type: Number, default: 0 },
          yStartDate: { type: String },
          yEndDate: { type: String },
          fullStartDate: { type: String },
          fullEndDate: { type: String },
          totalAdultPrice: { type: Number, default: 0 },
          gstAdultPrice: { type: Number, default: 0 },
          totalChildPrice: { type: Number, default: 0 },
          gstChildPrice: { type: Number, default: 0 },
          totalExtraAdultPrice: { type: Number, default: 0 },
          gstExtraAdultPrice: { type: Number, default: 0 },
          isAddOn: { type: Boolean, default: false },
          review: { type: Number },
          isAc: { type: Boolean },
        },
      ],
      default: [],
    },
    vehicleDetail: { type: [mongoose.Schema.Types.Mixed as any], default: [] },
    period: {
      type: [{ startDate: String, endDate: String }],
      default: [],
    },
    activity: {
      type: [
        {
          day: { type: Number, default: 0 },
          from: { type: String },
          to: { type: String },
          startDateWise: { type: Number, default: 0 },
          event: [
            {
              slot: { type: Number, default: 0 },
              activityType: {
                type: String,
                enum: ["free", "allocated", "travel"],
                default: "allocated",
              },
              activityId: { type: String, default: null },
              name: { type: String },
              image: { type: String },
              description: { type: String },
              timePeriod: {
                type: String,
                enum: [
                  "morning",
                  "noon",
                  "evening",
                  "noon-evening",
                  "full-day",
                ],
                default: "morning",
              },
              price: { type: Number, default: 0 },
            },
          ],
        },
      ],
      default: [],
    },
    bonusRedeemCoin: { type: Number, default: 0 },
    vehicleCount: { type: Number, default: 0 },
    hotelCount: { type: Number, default: 0 },
    activityCount: { type: Number, default: 0 },
    inclusionDetail: {
      type: [mongoose.Schema.Types.Mixed as any],
      default: [],
    },
    exclusionDetail: {
      type: [mongoose.Schema.Types.Mixed as any],
      default: [],
    },
    additionalFees: { type: Number, default: 0 },
    marketingPer: { type: Number, default: 0 },
    transPer: { type: Number, default: 0 },
    agentCommissionPer: { type: Number, default: 0 },
    gstPer: { type: Number, default: 5 },
    status: {
      type: String,
      enum: ["pending", "waiting", "approval", "completed", "failed", "cancel"],
      default: "waiting",
    },
    checkStartDate: { type: String },
    checkEndDate: { type: String },
    fullStartDate: { type: String },
    fullEndDate: { type: String },
    totalRoomPrice: { type: Number, default: 0 },
    totalAdditionalFee: { type: Number, default: 0 },
    totalTransportFee: { type: Number, default: 0 },
    totalVehiclePrice: { type: Number, default: 0 },
    totalActivityPrice: { type: Number, default: 0 },
    totalCalculationPrice: { type: Number, default: 0 },
    agentAmount: { type: Number, default: 0 },
    totalPackagePrice: { type: Number, default: 0 },
    gstPrice: { type: Number, default: 0 },
    perPerson: { type: Number, default: 0 },
    packagePrice: { type: Number, default: 0 },
    couponCode: { type: String, default: null },
    discountType: {
      type: String,
      enum: ["percentage", "amount", null],
      default: null,
    },
    discountValue: { type: Number, default: 0 },
    paymentDate: { type: String },
    discountPrice: { type: Number, default: 0 },
    finalPrice: { type: Number, default: 0 },
    isPrepaid: { type: Boolean, default: false },
    claimRedeemCoin: { type: Number, default: 0 },
    redeemCoin: { type: Number, default: 0 },
    redeemAmount: { type: Number, default: 0 },
    balanceAmount: { type: Number, default: 0 },
    emiDetails: {
      isEmiBooking: { type: Boolean, default: false },
      totalTenure: { type: Number, default: 0 },
      monthlyAmount: { type: Number, default: 0 },
      totalAmount: { type: Number, default: 0 },
      paidCount: { type: Number, default: 0 },
      nextDueDate: { type: Date },
      schedule: [
        {
          installmentNumber: { type: Number },
          amount: { type: Number },
          dueDate: { type: Date },
          status: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
          },
          paymentId: { type: String },
          transactionId: { type: String },
          paidAt: { type: Date },
        },
      ],
    },
  },
  { timestamps: true }
);

// Indexes (bookingId already has unique: true which creates an index)
BookingSchema.index({ userId: 1, createdAt: -1 });
BookingSchema.index({ status: 1 });

const Booking: Model<IBooking> =
  mongoose.models.Booking ||
  mongoose.model<IBooking>("Booking", BookingSchema, "booking");

export default Booking;
