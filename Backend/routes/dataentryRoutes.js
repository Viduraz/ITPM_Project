import express from 'express';
import {
  createDataEntryProfile,
  getDataEntryProfile,
  createDiagnosis,
  createPrescription,
  getAllPrescriptions,
  getAssignedTasks,
  getAllPatients
} from '../controllers/dataentryController.js';

import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Route: Create Profile (doesn't require auth — assuming initial registration)
router.post('/create-profile', createDataEntryProfile);

// ✅ Protected Routes
router.use(authenticateToken);
router.use(authorizeRoles('dataentry', 'admin')); // Allow admin too, in case they need access

// Route to get the data entry profile
router.get('/profile', getDataEntryProfile);

// Route to create a new diagnosis
router.post('/diagnosis', createDiagnosis);

// Route to create prescription data entry
router.post('/create-prescription', createPrescription);

router.get('/prescriptions', getAllPrescriptions);  // Add this line for prescription retrieval

// Route to fetch assigned tasks
router.get('/tasks', getAssignedTasks);

// Route to fetch patients 
router.get('/patients', getAllPatients);

export default router;
