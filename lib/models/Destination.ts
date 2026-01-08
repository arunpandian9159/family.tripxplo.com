import mongoose, { Document, Model } from "mongoose";

export interface IDestination extends Document {
  destinationId: string;
  destinationType: "International" | "Domestic";
  image: string;
  rankNo: number;
  destinationName: string;
}

const DestinationSchema = new mongoose.Schema<IDestination>({
  destinationId: { type: String, required: true, unique: true },
  destinationType: {
    type: String,
    enum: ["International", "Domestic"],
    default: "Domestic",
  },
  image: { type: String },
  rankNo: { type: Number, default: 0 },
  destinationName: { type: String, required: true },
});

// Index for text search (destinationId already has unique: true which creates an index)
DestinationSchema.index({ destinationName: "text" });

const Destination: Model<IDestination> =
  mongoose.models.Destination ||
  mongoose.model<IDestination>("Destination", DestinationSchema, "destination");

export default Destination;
