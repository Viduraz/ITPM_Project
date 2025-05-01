import express from 'express';
import { getPosSummary } from '../controllers/posController.js';

const router = express.Router();

router.get('/', getPosSummary);

export default router;