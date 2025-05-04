import express from 'express';
import { 
  register, 
  login, 
  registerPatient, 
  // registerDoctor, 
  registerPharmacy, 
  registerLaboratory,
  registerDataEntry,
  getMe // Add this import
} from '../controllers/authController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getMe); // Add this route
router.post('/register/patient', authenticateToken, registerPatient);
// router.post('/register/doctor', authenticateToken, registerDoctor);
router.post('/register/pharmacy', authenticateToken, authorizeRoles('admin'), registerPharmacy);
router.post('/register/laboratory', authenticateToken, authorizeRoles('admin'), registerLaboratory);
router.post('/register/dataentry', authenticateToken, authorizeRoles('admin'), registerDataEntry);

export default router;