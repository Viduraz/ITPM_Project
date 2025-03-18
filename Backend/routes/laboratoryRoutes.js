import express from 'express';

import { 
  getLaboratoryProfile, 
  createLabReport, 
  getLabReports,
  updateLaboratory
} from '../controllers/laborataryController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);
router.use(authorizeRoles('laboratory', 'admin'));

router.get('/profile', getLaboratoryProfile);
router.get('/profile/:id', getLaboratoryProfile);
router.put('/profile', updateLaboratory);
router.post('/reports', createLabReport);
router.get('/reports', getLabReports);

export default router;