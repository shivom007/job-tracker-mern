import express from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import limiter from "./utils/limiter";
import errorMiddleware from "./middlewares/errorMiddleware";
import connectDB from "./config/db";
import jobApplicationRoutes from "./routes/jobApplicationRoutes";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(limiter);

app.use("/api/applications", jobApplicationRoutes);

app.use(errorMiddleware);

export default app;
