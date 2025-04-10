// src/routes/jobApplicationRoutes.ts
import express from "express";
import {
  createJobApplication,
  getAllJobApplications,
  deleteJobApplication,
  updateJobApplication,
} from "../controllers/jobApplicationController";

const router = express.Router();

router.post("/", createJobApplication);

router.get("/", getAllJobApplications);

router.delete("/:id", deleteJobApplication);

router.put("/:id", updateJobApplication);

export default router;
