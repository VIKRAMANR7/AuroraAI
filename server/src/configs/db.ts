import mongoose from "mongoose";

async function connectDB() {
  await mongoose.connect(`${process.env.MONGODB_URI!}/auroraai`);
  console.log("MongoDB connected");
}

export default connectDB;
