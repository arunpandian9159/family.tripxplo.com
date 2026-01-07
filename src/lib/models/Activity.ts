import mongoose, { Document, Model } from 'mongoose';

interface IParticipantInfo {
  minParticipants: number;
  maxParticipants: number;
  ageRestriction: number;
}

export interface IActivity extends Document {
  activityId: string;
  name: string;
  image: string;
  price: number;
  dayType: 'Half' | 'Full' | 'Quarter';
  description: string;
  level: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  participantInfo: IParticipantInfo;
  duration: number;
  destinationId: string;
  isPrivate: boolean;
}

const ActivitySchema = new mongoose.Schema<IActivity>({
  activityId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, default: 0 },
  dayType: { type: String, enum: ['Half', 'Full', 'Quarter'], default: 'Half' },
  description: { type: String },
  level: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
  tags: { type: [String], default: [] },
  participantInfo: {
    minParticipants: { type: Number, default: 0 },
    maxParticipants: { type: Number, default: 0 },
    ageRestriction: { type: Number, default: 0 },
  },
  duration: { type: Number, default: 0 },
  destinationId: { type: String },
  isPrivate: { type: Boolean, default: false },
});

// Indexes (activityId already has unique: true which creates an index)
ActivitySchema.index({ destinationId: 1 });

const Activity: Model<IActivity> =
  mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema, 'activity');

export default Activity;
