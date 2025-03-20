import express from 'express';
import { createDataEntryProfile, createDiagnosisDataEntry, createPrescriptionDataEntry } from '../controllers/dataentryController.js';
import { protect, restrictToDataEntry } from '../middleware/auth.js';  // Protect and restrict middleware

const router = express.Router();

// Route for creating a Data Entry Profile
// No authentication needed here, as it is for creating the profile initially
router.post('/create-profile', createDataEntryProfile);

// Route for creating a diagnosis (Only for data entry users)
// Requires authentication and restriction to 'dataentry' role
router.post('/create-diagnosis', protect, restrictToDataEntry, createDiagnosisDataEntry);

// Route for creating a prescription (Only for data entry users)
// Requires authentication and restriction to 'dataentry' role
router.post('/create-prescription', protect, restrictToDataEntry, createPrescriptionDataEntry);

export default router;
