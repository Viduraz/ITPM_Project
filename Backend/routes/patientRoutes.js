import express from 'express';
import { 
  getPatientProfile, 
  searchDoctors, 
  getMedicalHistory,
  getHospitals,
  downloadReport,
  fetchPatients // Corrected the import statement
} from '../controllers/patientController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
//router.use(authenticateToken);

// Routes for fetching patients
router.get('/patients', fetchPatients); // Fetch patients route

// Routes accessible to patients only
router.get('/profile/:id', getPatientProfile);
router.get('/medical-history', authorizeRoles('patient'), getMedicalHistory);

// Routes accessible to both patients and doctors
router.get('/doctors/search', searchDoctors);
router.get('/hospitals', getHospitals);
router.get('/reports/:type/:id', downloadReport);

export default router;
