import express from 'express';
import { getProgress, getWeeklyProgress, getMonthlyProgress } from '../controllers/progressController.js';

const router = express.Router();

router.get('/', getProgress);
router.get('/weekly', getWeeklyProgress);
router.get('/monthly', getMonthlyProgress);

export default router;