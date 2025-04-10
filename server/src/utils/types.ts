import { Document } from "mongoose";

type JobStatus = "Applied" | "Interviewing" | "Offered" | "Rejected";

export interface IJobApplication extends Document {
  company: string;
  role: string;
  status: JobStatus;
  appliedDate: Date;
  link?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

