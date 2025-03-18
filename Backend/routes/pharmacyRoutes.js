import express from 'express';

import { 
  getPharmacyProfile, 
  recordPurchase, 
  getPrescriptions,
  updatePharmacy,
  getPurchaseHistory
} from '../controllers/pharmacyController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);
router.use(authorizeRoles('pharmacy', 'admin'));

router.get('/profile', getPharmacyProfile);
router.get('/profile/:id', getPharmacyProfile);
router.put('/profile', updatePharmacy);
router.post('/record-purchase', recordPurchase);
router.get('/prescriptions', getPrescriptions);
router.get('/purchase-history', getPurchaseHistory);

export default router;