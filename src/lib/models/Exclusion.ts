import mongoose, { Document, Model } from 'mongoose';

export interface IExclusion extends Document {
  exclusionId: string;
  name: string;
  image?: string;
}

const ExclusionSchema = new mongoose.Schema<IExclusion>({
  exclusionId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  // image property is not in tripxplo.com model but adding it optional just in case, wait,
  // checking tripxplo.com/lib/models/Exclusion.ts again...
  // It only has exclusionId and name. I will stick to that.
});

// Note: exclusionId already has unique: true which creates an index

const Exclusion: Model<IExclusion> =
  mongoose.models.Exclusion ||
  mongoose.model<IExclusion>('Exclusion', ExclusionSchema, 'exclusion');

export default Exclusion;
