import express from "express";
import {
  createReview,
  getDoctorReviews,
  deleteReview,
  getDoctorRating,
  getPatientReviews,
} from "../controllers/reviewController.js";
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get("/doctor/:id", getDoctorReviews);
router.get("/rating/:doctorId", getDoctorRating);

// Protected routes - require authentication
router.post("/", authenticateToken, createReview);
router.delete("/:id", authenticateToken, deleteReview);
router.get("/patient", authenticateToken, getPatientReviews);

export default router;
