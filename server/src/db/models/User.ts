import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface User extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  resetPasswordToken?: string;
  resetPasswordTokenExpiry?: Date;
  refreshTokens: string[];
}

const userSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    verificationToken: {
      type: String,
      required: false,
      select: false,
    },
    verificationTokenExpiry: {
      type: String,
      required: false,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      required: false,
      select: false,
    },
    resetPasswordTokenExpiry: {
      type: String,
      required: false,
      select: false,
    },
    refreshTokens: [{ type: String, select: false }],
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model<User>("User", userSchema);

export default UserModel;
