import mongoose, { Document, Model } from 'mongoose';

export interface IInclusion extends Document {
  inclusionId: string;
  name: string;
  image: string;
}

const InclusionSchema = new mongoose.Schema<IInclusion>({
  inclusionId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String },
});

// Note: inclusionId already has unique: true which creates an index

const Inclusion: Model<IInclusion> =
  mongoose.models.Inclusion ||
  mongoose.model<IInclusion>('Inclusion', InclusionSchema, 'inclusion');

export default Inclusion;
