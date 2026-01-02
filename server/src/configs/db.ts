import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  mongoose.connection.on("connected", () => {
    console.log("Database connected");
  });

  mongoose.connection.on("error", (err: Error) => {
    console.error("MongoDB connection error:", err.message);
  });

  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    throw new Error("MONGODB_URI is not defined");
  }

  await mongoose.connect(`${mongoURI}/auroraai`);
}
