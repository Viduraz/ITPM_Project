import express from 'express';
import { getPosSummary, getCustomerSummary, getAllCustomersWithProducts } from '../controllers/posController.js';

const router = express.Router();

router.get('/', getPosSummary);
router.get('/customer/:id', getCustomerSummary);
router.get('/customers/all', getAllCustomersWithProducts);

export default router;