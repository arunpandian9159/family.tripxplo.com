import mongoose, { Document, Model } from 'mongoose';

interface IDestinationRef {
  destinationId: string;
  noOfNight: number;
}

interface IHotelRef {
  hotelRoomId: string;
  mealPlan: 'ep' | 'cp' | 'map' | 'ap';
  noOfNight: number;
  startDateWise: number;
  endDateWise: number;
  sort: number;
  isAddOn: boolean;
}

interface IActivityEvent {
  slot: number;
  activityType: 'free' | 'allocated' | 'travel';
  activityId?: string;
  timePeriod: 'morning' | 'noon' | 'evening' | 'noon-evening' | 'full-day';
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

export interface IPackage extends Document {
  packageId: string;
  packageName: string;
  slug?: string;
  planId?: string;
  interestId?: string;
  destination: IDestinationRef[];
  redeemPoint: number;
  sort: number;
  startFrom: string;
  perRoom: number;
  packageImg: string[];
  noOfDays: number;
  noOfNight: number;
  noOfAdult: number;
  noOfChild: number;
  offer: number;
  hotel: IHotelRef[];
  availableHotel: string[];
  vehicle: string[];
  availableVehicle: string[];
  startDate: string[];
  endDate: string[];
  period: IPeriod[];
  story?: string;
  inclusion: string[];
  exclusion: string[];
  activity: IActivity[];
  availableActivity: string[];
  activityPrice: number;
  additionalFees: number;
  marketingPer: number;
  transPer: number;
  agentCommissionPer: number;
  gstPer: number;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema = new mongoose.Schema<IPackage>(
  {
    packageId: { type: String, required: true, unique: true },
    packageName: { type: String, required: true },
    slug: { type: String, sparse: true, index: true },
    planId: { type: String },
    interestId: { type: String },
    destination: {
      type: [{ destinationId: { type: String }, noOfNight: { type: Number, default: 0 } }],
      default: [],
    },
    redeemPoint: { type: Number, default: 0 },
    sort: { type: Number, default: 0 },
    startFrom: { type: String },
    perRoom: { type: Number, default: 0 },
    packageImg: { type: [String], default: [] },
    noOfDays: { type: Number, default: 0 },
    noOfNight: { type: Number, default: 0 },
    noOfAdult: { type: Number, default: 0 },
    noOfChild: { type: Number, default: 0 },
    offer: { type: Number, default: 0 },
    hotel: {
      type: [
        {
          hotelRoomId: { type: String },
          mealPlan: { type: String, enum: ['ep', 'cp', 'map', 'ap'], default: 'ep' },
          noOfNight: { type: Number, default: 0 },
          startDateWise: { type: Number, default: 0 },
          endDateWise: { type: Number, default: 0 },
          sort: { type: Number, default: 0 },
          isAddOn: { type: Boolean, default: false },
        },
      ],
      default: [],
    },
    availableHotel: { type: [String], default: [] },
    vehicle: { type: [String], default: [] },
    availableVehicle: { type: [String], default: [] },
    startDate: { type: [String], default: [] },
    endDate: { type: [String], default: [] },
    period: { type: [{ startDate: String, endDate: String }], default: [] },
    story: { type: String },
    inclusion: { type: [String], default: [] },
    exclusion: { type: [String], default: [] },
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
                enum: ['free', 'allocated', 'travel'],
                default: 'allocated',
              },
              activityId: { type: String, default: null },
              timePeriod: {
                type: String,
                enum: ['morning', 'noon', 'evening', 'noon-evening', 'full-day'],
                default: 'morning',
              },
            },
          ],
        },
      ],
      default: [],
    },
    availableActivity: { type: [String], default: [] },
    activityPrice: { type: Number, default: 0 },
    additionalFees: { type: Number, default: 0 },
    marketingPer: { type: Number, default: 0 },
    transPer: { type: Number, default: 0 },
    agentCommissionPer: { type: Number, default: 0 },
    gstPer: { type: Number, default: 5 },
    status: { type: Boolean, default: false },
  },
  { timestamps: true }
);

PackageSchema.index({ status: 1, sort: -1 });
PackageSchema.index({ packageName: 'text' });

const Package: Model<IPackage> =
  mongoose.models.Package || mongoose.model<IPackage>('Package', PackageSchema, 'package');

export default Package;
