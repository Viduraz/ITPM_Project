import express from 'express';
import { 
  createDataEntryProfile, 
  getDataEntryProfile, 
  createDiagnosisDataEntry,
  createPrescriptionDataEntry,
  getAssignedTasks
} from '../controllers/dataentryController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to relevant routes
router.post('/create-profile', createDataEntryProfile);
router.get('/profile', authenticateToken, authorizeRoles('dataentry', 'admin'), getDataEntryProfile);
router.post('/create-diagnosis', authenticateToken, authorizeRoles('dataentry', 'admin'), createDiagnosisDataEntry);
router.post('/create-prescription', authenticateToken, authorizeRoles('dataentry', 'admin'), createPrescriptionDataEntry);
router.get('/tasks', authenticateToken, authorizeRoles('dataentry', 'admin'), getAssignedTasks);

export default router;