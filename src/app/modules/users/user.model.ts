import mongoose, { Schema } from "mongoose";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface.js";

//! auth provider Embedding------------------------------
const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  { versionKey: false, _id: false },
);

//! * user schema--------------------------------------
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    auths: [authProviderSchema],
    // bookings: { type: Schema.Types.ObjectId },
    // guides: { type: Schema.Types.ObjectId },
  },
  { timestamps: true, versionKey: false },
);

export const UserModel = mongoose.model("users", userSchema);
