import mongoose, { Document, Model } from "mongoose";

export interface IPlan extends Document {
  planId: string;
  planName: string;
}

const PlanSchema = new mongoose.Schema<IPlan>({
  planId: { type: String, required: true, unique: true },
  planName: { type: String, required: true },
});

// Note: planId already has unique: true which creates an index

const Plan: Model<IPlan> =
  mongoose.models.Plan || mongoose.model<IPlan>("Plan", PlanSchema, "plan");

export default Plan;
