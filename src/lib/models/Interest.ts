import mongoose, { Document, Model } from 'mongoose';

export interface IInterest extends Document {
  interestId: string;
  interestName: string;
  image: string;
  sort: number;
  perRoom: number;
  isFirst: boolean;
}

const InterestSchema = new mongoose.Schema<IInterest>({
  interestId: { type: String, required: true, unique: true },
  interestName: { type: String, required: true },
  image: { type: String },
  sort: { type: Number, default: 0 },
  perRoom: { type: Number, default: 0 },
  isFirst: { type: Boolean, default: false },
});

// Note: interestId already has unique: true which creates an index

const Interest: Model<IInterest> =
  mongoose.models.Interest || mongoose.model<IInterest>('Interest', InterestSchema, 'interest');

export default Interest;
