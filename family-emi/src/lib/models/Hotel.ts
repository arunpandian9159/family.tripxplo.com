import mongoose, { Document, Model } from 'mongoose';

interface ILocation {
  destinationId: string;
  lat: string;
  lon: string;
  address: string;
  state: string;
  country: string;
}

interface IHotelContacts {
  businessEmail: string;
  additionalEmail: string;
  maintainerPhoneNo: number;
}

export interface IHotel extends Document {
  hotelId: string;
  hotelName: string;
  location: ILocation;
  viewPoint: string[];
  image: string;
  review: number;
  contract: IHotelContacts;
  amenities: string[];
}

const LocationSchema = new mongoose.Schema({
  destinationId: { type: String },
  lat: { type: String },
  lon: { type: String },
  address: { type: String },
  state: { type: String },
  country: { type: String },
});

const HotelContactsSchema = new mongoose.Schema({
  businessEmail: { type: String },
  additionalEmail: { type: String },
  maintainerPhoneNo: { type: Number },
});

const HotelSchema = new mongoose.Schema<IHotel>({
  hotelId: { type: String, required: true, unique: true },
  hotelName: { type: String, required: true },
  location: { type: LocationSchema },
  viewPoint: { type: [String], default: [] },
  image: { type: String },
  review: { type: Number, default: 0 },
  contract: { type: HotelContactsSchema },
  amenities: { type: [String], default: [] },
});

const Hotel: Model<IHotel> = mongoose.models.Hotel || mongoose.model<IHotel>('Hotel', HotelSchema, 'hotel');

export default Hotel;

