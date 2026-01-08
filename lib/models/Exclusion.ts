import mongoose, { Document, Model } from "mongoose";

export interface IExclusion extends Document {
  exclusionId: string;
  name: string;
}

const ExclusionSchema = new mongoose.Schema<IExclusion>({
  exclusionId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
});

// Note: exclusionId already has unique: true which creates an index

const Exclusion: Model<IExclusion> =
  mongoose.models.Exclusion ||
  mongoose.model<IExclusion>("Exclusion", ExclusionSchema, "exclusion");

export default Exclusion;
