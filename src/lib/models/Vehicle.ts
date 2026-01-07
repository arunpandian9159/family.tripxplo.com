import mongoose, { Document, Model } from 'mongoose';

export interface IVehicle extends Document {
  vehicleId: string;
  vehicleName: string;
  price: number;
  seater: number;
  isAc: boolean;
  luggage: number;
  maxPax: number;
  vehicleCompany: string;
  acType: string;
  itineraryName: string[];
  transferInfo: string[];
  inclusion: string[];
  noOfDays: number;
  destinationId: string;
  image: string;
}

const VehicleSchema = new mongoose.Schema<IVehicle>(
  {
    vehicleId: { type: String, required: true, unique: true },
    vehicleName: { type: String, required: true },
    price: { type: Number, default: 0 },
    seater: { type: Number, default: 0 },
    isAc: { type: Boolean, default: false },
    luggage: { type: Number, default: 0 },
    maxPax: { type: Number, default: 0 },
    vehicleCompany: { type: String },
    acType: { type: String },
    itineraryName: { type: [String], default: [] },
    transferInfo: { type: [String], default: [] },
    inclusion: { type: [String], default: [] },
    noOfDays: { type: Number, default: 0 },
    destinationId: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

const Vehicle: Model<IVehicle> =
  mongoose.models.Vehicle || mongoose.model<IVehicle>('Vehicle', VehicleSchema, 'vehicle');

export default Vehicle;
