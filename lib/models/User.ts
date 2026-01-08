import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  userId: string;
  email: string;
  userType: "b2b" | "customer";
  password: string;
  fullName: string;
  mobileNo?: number;
  wishList: string[];
  gender: "male" | "female" | "other";
  dob?: string;
  address?: string;
  city?: string;
  pinCode?: string;
  profileImg: string;
  status: boolean;
  redeemCoins: number;
  claimRedeemCoins: number;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    userId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    userType: { type: String, enum: ["b2b", "customer"], default: "customer" },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    mobileNo: { type: Number },
    wishList: { type: [String], default: [] },
    gender: {
      type: String,
      enum: ["male", "female", "other", "Male", "Female", "Other"],
      default: "male",
    },
    dob: { type: String },
    address: { type: String },
    city: { type: String },
    pinCode: { type: String },
    profileImg: {
      type: String,
      default:
        "https://png.pngtree.com/png-clipart/20210915/ourmid/pngtree-user-avatar-login-interface-abstract-blue-icon-png-image_3917504.jpg",
    },
    status: { type: Boolean, default: false },
    redeemCoins: { type: Number, default: 200 },
    claimRedeemCoins: { type: Number, default: 0 },
    refreshToken: { type: String },
  },
  { timestamps: true },
);

// Hash password before saving
UserSchema.pre("save", async function () {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    return;
  }

  // Skip if password is already hashed (bcrypt hashes start with $2)
  if (this.password && this.password.startsWith("$2")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Note: userId and email already have unique: true which creates indexes

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema, "users");

export default User;
