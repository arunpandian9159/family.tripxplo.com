import mongoose, { Document, Model } from "mongoose";

export interface IVehicle extends Document {
  vehicleId: string;
  vehicleName: string;
  image: string;
  isAc: boolean;
  luggage: number;
  seater: number;
  maxPax: number;
  vehicleCompany: string;
  acType?: string;
  itineraryName: string[];
  transferInfo: string[];
  inclusion: string[];
  noOfDays: number;
  price: number;
  destinationId: string;
  createdAt: Date;
  updatedAt: Date;
}

const VehicleSchema = new mongoose.Schema<IVehicle>(
  {
    vehicleId: { type: String, required: true, unique: true },
    vehicleName: { type: String, required: true },
    image: { type: String },
    isAc: { type: Boolean, default: false },
    luggage: { type: Number, default: 0 },
    seater: { type: Number, default: 0 },
    maxPax: { type: Number, default: 0 },
    vehicleCompany: { type: String },
    acType: { type: String, default: null },
    itineraryName: { type: [String], default: [] },
    transferInfo: { type: [String], default: [] },
    inclusion: { type: [String], default: [] },
    noOfDays: { type: Number, default: 0 },
    price: { type: Number },
    destinationId: { type: String },
  },
  { timestamps: true },
);

// Indexes (vehicleId already has unique: true which creates an index)
VehicleSchema.index({ destinationId: 1 });

const Vehicle: Model<IVehicle> =
  mongoose.models.Vehicle ||
  mongoose.model<IVehicle>("Vehicle", VehicleSchema, "vehicle");

export default Vehicle;
