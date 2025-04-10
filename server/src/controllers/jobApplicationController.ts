import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import JobApplication from "../models/JobApplication";
import { IJobApplication } from "../utils/types";
import validateJobApplication from "../utils/validation";
import { CustomError } from "../utils/customError"; // Update the path to the correct location
import { StatusCodes } from "http-status-codes";

const createJobApplication = asyncHandler(
  async (req: Request, res: Response) => {
    // Validate job application data
    const result = validateJobApplication(req.body);

    // If validation fails, throw a custom error with detailed message
    if (!result.success) {
      const errorMessage = result.error.issues
        .map((issue) => issue.message)
        .join(", ");
      throw new CustomError(errorMessage, StatusCodes.BAD_REQUEST);
    }

    // Destructuring validated data
    const { company, role, status, appliedDate, link } =
      req.body as IJobApplication;

    try {
      // Create the job application document
      const jobApplication = await JobApplication.create({
        company,
        role,
        status,
        appliedDate,
        link,
      });

      // Respond with success
      res.status(StatusCodes.CREATED).json(jobApplication);
    } catch (error) {
      // Handle unexpected errors (e.g., database issues)
      console.error("Error creating job application:", error);
      throw new CustomError(
        "Failed to create job application",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
);

// Get all job applications
const getAllJobApplications = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const jobApplications = await JobApplication.find();

      if (jobApplications.length === 0) {
        res.status(StatusCodes.NOT_FOUND).json({
          message: "No job applications found.",
        });
      } else {
        res.status(StatusCodes.OK).json(jobApplications);
      }
    } catch (error) {
      console.error("Error fetching job applications:", error);
      throw new Error("Failed to fetch job applications.");
    }
  }
);

// Delete a job application
const deleteJobApplication = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      // Find the job application by ID and delete it
      const jobApplication = await JobApplication.findByIdAndDelete(id);

      // If job application doesn't exist, return 404
      if (!jobApplication) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Job application not found" });
      } else {
        res
          .status(StatusCodes.OK)
          .json({ message: "Job application deleted successfully" });
      }
    } catch (error) {
      console.error("Error deleting job application:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to delete job application" });
    }
  }
);

const updateJobApplication = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { company, role, status, appliedDate, link } =
      req.body as IJobApplication;

    try {
      // Find the job application by ID and update it with new values
      const updatedJobApplication = await JobApplication.findByIdAndUpdate(
        id,
        { company, role, status, appliedDate, link },
        { new: true } // Return the updated document after the update operation
      );

      // If job application doesn't exist, return 404
      if (!updatedJobApplication) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Job application not found" });
      } else {
        res.status(StatusCodes.OK).json(updatedJobApplication);
      }
    } catch (error) {
      console.error("Error updating job application:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to update job application" });
    }
  }
);

export { createJobApplication, getAllJobApplications, deleteJobApplication, updateJobApplication };
