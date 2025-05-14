import mongoose from "mongoose";
import { MONGODB_URI } from "../lib/constants";

export const connectDB = async () => {
  try {
    console.log(`Connecting to MongoDB...`);
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};
