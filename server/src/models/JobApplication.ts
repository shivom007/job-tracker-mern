import mongoose, { Document, Schema } from 'mongoose';
import { IJobApplication } from '../utils/types';


const JobApplicationSchema: Schema = new Schema<IJobApplication>(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      default: 'Applied',
    },
    appliedDate: {
      type: Date,
      required: true,
    },
    link: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const JobApplication = mongoose.model<IJobApplication>('Application', JobApplicationSchema);

export default JobApplication;
