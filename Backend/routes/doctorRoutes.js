import express from "express";
import {
  registerDoctor,
  loginDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  getDoctorAvailability,
  updateAvailability,
} from "../controllers/doctorController.js";

const router = express.Router();

// Public routes
router.post("/register", registerDoctor);
router.post("/login", loginDoctor);
router.get("/", getDoctors);
router.get("/:id", getDoctorById);
router.get("/:id/availability", getDoctorAvailability);

// Protected routes
router.put("/:id", updateDoctor);
router.delete("/:id", deleteDoctor);
router.put("/:id/availability", updateAvailability);

export default router;
