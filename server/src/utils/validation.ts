import { z } from 'zod';
import { IJobApplication } from './types';

// Define the schema for a job application using Zod
const jobApplicationSchema = z.object({
  company: z.string().min(1, { message: "Company name is required" }),
  role: z.string().min(1, { message: "Role is required" }),
  status: z.enum(['Applied', 'Interviewing', 'Offered', 'Rejected'], {
    message: "Invalid status value",
  }),
  appliedDate: z.date(),
  link: z.string().url().optional(),
});

function validateJobApplication(data: IJobApplication) {
 const parsedData = {
    ...data,
    appliedDate: new Date(data.appliedDate),}
  return jobApplicationSchema.safeParse(parsedData);
}

export default validateJobApplication;
