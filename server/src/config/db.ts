import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    console.error("MongoDB URI is not defined in .env file");
    process.exit(1);
  }

  try {
    mongoose.set("strictQuery", true);
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`Error: ${err.message}`);
    } else {
      console.error("Unknown error occurred while connecting to MongoDB");
      process.exit(1);
    }
  }

  mongoose.connection.on("error", (err) => {
    console.error(`MongoDB connection error: ${err}`);
  });

  mongoose.connection.on("disconnected", () => {
    console.error("MongoDB disconnected. Attempting to reconnect...");
    connectDB().catch((err) => {
      console.error(`Reconnection error: ${err}`);
    });
  });
};

export default connectDB;
