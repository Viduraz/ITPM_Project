import express from 'express';
import {
  createDataEntryProfile,
  getDataEntryProfile,
  createDiagnosis,
  getAllDiagnoses,
  getDiagnosisById,
  updateDiagnosis,
  deleteDiagnosis,
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
  getAssignedTasks,
  getAllPatients
} from '../controllers/dataentryController.js';

import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Public route to create data entry profile
router.post('/create-profile', createDataEntryProfile);

// Apply auth + role-based middleware
router.use(authenticateToken);
router.use(authorizeRoles('dataentry', 'admin'));

// Data entry profile route
router.get('/profile', getDataEntryProfile);

// ------------------------
// Diagnosis routes
// ------------------------
router.post('/diagnoses', createDiagnosis);
router.get('/diagnoses', getAllDiagnoses);
router.get('/diagnoses/:id', getDiagnosisById);
router.put('/diagnoses/:id', updateDiagnosis);
router.delete('/diagnoses/:id', deleteDiagnosis);

// ------------------------
// Prescription routes
// ------------------------
router.post('/prescriptions', createPrescription);
router.get('/prescriptions', getPrescriptions);
router.get('/prescriptions/:id', getPrescriptionById);
router.put('/prescriptions/:id', updatePrescription);
router.delete('/prescriptions/:id', deletePrescription);

// ------------------------
// Other utilities
// ------------------------
router.get('/tasks', getAssignedTasks);
router.get('/patients', getAllPatients);

export default router;
