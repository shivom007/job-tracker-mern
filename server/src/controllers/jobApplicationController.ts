import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import JobApplication from "../models/JobApplication";
import { IJobApplication } from "../utils/types";
import validateJobApplication from "../utils/validation";
import { CustomError } from "../utils/customError"; // Update the path to the correct location
import { StatusCodes } from "http-status-codes";

const createJobApplication = asyncHandler(
  async (req: Request, res: Response) => {
    const result = validateJobApplication(req.body);

    if (!result.success) {
      const errorMessage = result.error.issues
        .map((issue) => issue.message)
        .join(", ");
      throw new CustomError(errorMessage, StatusCodes.BAD_REQUEST);
    }

    const { company, role, status, appliedDate, link } =
      req.body as IJobApplication;

    try {
      const jobApplication = await JobApplication.create({
        company,
        role,
        status,
        appliedDate,
        link,
      });

      res.status(StatusCodes.CREATED).json(jobApplication);
    } catch (error) {
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
      if (!id) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: "Job application ID is required",
        });
        return;
      }

      const jobApplication = await JobApplication.findByIdAndDelete(id);

      if (!jobApplication) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Job application not found" });
        return;
      }
      res
        .status(StatusCodes.OK)
        .json({ message: "Job application deleted successfully" });
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
    const result = validateJobApplication(req.body);

    if (!result.success) {
      const errorMessage = result.error.issues
        .map((issue) => issue.message)
        .join(", ");
      throw new CustomError(errorMessage, StatusCodes.BAD_REQUEST);
    }

    const { id } = req.params;
    
    const { company, role, status, appliedDate, link } =
      req.body as IJobApplication;

    try {
      const updatedJobApplication = await JobApplication.findByIdAndUpdate(
        id,
        { company, role, status, appliedDate, link },
        { new: true }
      );

      if (!updatedJobApplication) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Job application not found" });
        return;
      }
      res.status(StatusCodes.OK).json(updatedJobApplication);
    } catch (error) {
      console.error("Error updating job application:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to update job application" });
    }
  }
);

export {
  createJobApplication,
  getAllJobApplications,
  deleteJobApplication,
  updateJobApplication,
};
