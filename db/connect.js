import mongoose from "mongoose";

export default async function connectDB(url) {
  try {
    const connection = await mongoose.connect(url);

    console.log(`🟢 MongoDB Connected: ${connection.connection.host}`);

    return connection;
  } catch (error) {
    console.error("🔴 MongoDB Connection Failed:", error.message);

    throw error;
  }
}
