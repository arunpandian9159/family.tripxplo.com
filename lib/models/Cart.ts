import mongoose, { Document, Model } from "mongoose";

export interface ICartItem {
  itemId: string;
  packageId: string;
  quantity: number;
  travelDate: string;
  adults: number;
  children: number;
  totalPrice: number;
  addedAt: Date;
}

export interface ICart extends Document {
  cartId: string;
  userId: string;
  items: ICartItem[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  packageId: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  travelDate: { type: String, required: true },
  adults: { type: Number, required: true, min: 1 },
  children: { type: Number, default: 0 },
  totalPrice: { type: Number, default: 0 },
  addedAt: { type: Date, default: Date.now },
});

const CartSchema = new mongoose.Schema<ICart>(
  {
    cartId: { type: String, required: true, unique: true },
    userId: { type: String, required: true, unique: true },
    items: { type: [CartItemSchema], default: [] },
    totalAmount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Note: cartId and userId already have unique: true which creates indexes

const Cart: Model<ICart> =
  mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema, "cart");

export default Cart;
