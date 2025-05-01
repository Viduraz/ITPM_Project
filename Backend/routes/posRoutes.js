import express from 'express';
import { getPosSummary, getCustomerSummary } from '../controllers/posController.js';

const router = express.Router();

router.get('/', getPosSummary);
router.get('/customer/:id', getCustomerSummary);

export default router;