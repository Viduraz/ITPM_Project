import express from 'express';
import { 
  getDoctorProfile, 
  updateAvailability,
  updateGlobalAvailability, // Add this import
  searchPatients, 
  getPatientMedicalHistory,
  createDiagnosis,
  createPrescription,
  getAllHospitals
} from '../controllers/doctorController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);
router.use(authorizeRoles('doctor'));

router.get('/profile', getDoctorProfile);
router.get('/profile/:id', getDoctorProfile);
router.put('/availability', updateAvailability);
router.put('/availability/global', updateGlobalAvailability); // Add this new route
router.get('/patients/search', searchPatients);
router.get('/patients/:patientId/medical-history', getPatientMedicalHistory);
router.post('/diagnosis', createDiagnosis);
router.post('/prescription', createPrescription);
router.get('/hospitals', getAllHospitals);

export default router;