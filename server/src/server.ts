import dotenv from "dotenv";
import connectDB from "./config/db";
import app from "./app";
dotenv.config();

const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV || "development";

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
    });
  } catch (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }
};

startServer();
