import express from 'express';
import { getWeeklyReport, getMonthlyReport, getCustomReport } from '../controllers/reportController.js';

const router = express.Router();

router.get('/weekly', getWeeklyReport);
router.get('/monthly', getMonthlyReport);
router.get('/custom', getCustomReport);

export default router;