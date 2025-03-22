import express from 'express';
import { createDataEntryProfile, createDiagnosisDataEntry, createPrescriptionDataEntry } from '../controllers/dataentryController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';  // Fix middleware references

const router = express.Router();

// Route for creating a Data Entry Profile
router.post('/create-profile', createDataEntryProfile);

// Routes for data entry operations
// Use the correct middleware names matching your auth.js exports
router.post('/create-diagnosis', authenticateToken, authorizeRoles('dataentry', 'admin'), createDiagnosisDataEntry);
router.post('/create-prescription', authenticateToken, authorizeRoles('dataentry', 'admin'), createPrescriptionDataEntry);

export default router;
