import mongoose, { Document, Model } from "mongoose";

export interface ICoupon extends Document {
  couponId: string;
  couponName: string;
  code: string;
  description?: string;
  isPublic: boolean;
  userId?: string;
  valueType: "percentage" | "amount";
  value: number;
  validDate: string;
}

const CouponSchema = new mongoose.Schema<ICoupon>({
  couponId: { type: String, required: true, unique: true },
  couponName: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: { type: String, default: null },
  isPublic: { type: Boolean, default: true },
  userId: { type: String, default: null },
  valueType: {
    type: String,
    enum: ["percentage", "amount"],
    default: "percentage",
  },
  value: { type: Number, default: 0 },
  validDate: { type: String },
});

// Note: couponId and code already have unique: true which creates indexes

const Coupon: Model<ICoupon> =
  mongoose.models.Coupon ||
  mongoose.model<ICoupon>("Coupon", CouponSchema, "coupon");

export default Coupon;
