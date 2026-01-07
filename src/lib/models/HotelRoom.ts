import mongoose, { Document, Model } from 'mongoose';

interface IMealPlan {
  hotelId: string;
  hotelRoomId: string;
  hotelMealId: string;
  mealPlan: 'ep' | 'cp' | 'map' | 'ap';
  roomPrice: number;
  gstPer: number;
  adultPrice: number;
  childPrice: number;
  seasonType: 'offSeason' | 'onSeason' | 'splitSeason' | 'peakSeason' | 'weekEnd' | 'weekDay';
  startDate: string[];
  endDate: string[];
}

export interface IHotelRoom extends Document {
  hotelId: string;
  hotelRoomId: string;
  hotelRoomType: string;
  maxAdult: number;
  maxChild: number;
  maxInf: number;
  roomCapacity: number;
  isAc: boolean;
  mealPlan: IMealPlan[];
  amenities: string[];
}

const HotelRoomSchema = new mongoose.Schema<IHotelRoom>({
  hotelId: { type: String, required: true },
  hotelRoomId: { type: String, required: true, unique: true },
  hotelRoomType: { type: String },
  maxAdult: { type: Number },
  maxChild: { type: Number },
  maxInf: { type: Number },
  roomCapacity: { type: Number },
  isAc: { type: Boolean, default: false },
  mealPlan: {
    type: [
      {
        hotelId: { type: String },
        hotelRoomId: { type: String },
        hotelMealId: { type: String },
        mealPlan: { type: String, enum: ['ep', 'cp', 'map', 'ap'], default: 'ep' },
        roomPrice: { type: Number },
        gstPer: { type: Number, default: 0 },
        adultPrice: { type: Number },
        childPrice: { type: Number },
        seasonType: {
          type: String,
          enum: ['offSeason', 'onSeason', 'splitSeason', 'peakSeason', 'weekEnd', 'weekDay'],
          default: 'offSeason',
        },
        startDate: { type: [String], default: [] },
        endDate: { type: [String], default: [] },
      },
    ],
    default: [],
  },
  amenities: { type: [String], default: [] },
});

HotelRoomSchema.index({ hotelId: 1 });

const HotelRoom: Model<IHotelRoom> =
  mongoose.models.HotelRoom ||
  mongoose.model<IHotelRoom>('HotelRoom', HotelRoomSchema, 'hotelRoom');

export default HotelRoom;
