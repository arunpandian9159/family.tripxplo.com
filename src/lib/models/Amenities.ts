import mongoose, { Document, Model } from 'mongoose';

export interface IAmenities extends Document {
  amenitiesId: string;
  name: string;
  image: string;
}

const AmenitiesSchema = new mongoose.Schema<IAmenities>({
  amenitiesId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String },
});

// Note: amenitiesId already has unique: true which creates an index

const Amenities: Model<IAmenities> =
  mongoose.models.Amenities ||
  mongoose.model<IAmenities>('Amenities', AmenitiesSchema, 'amenities');

export default Amenities;
