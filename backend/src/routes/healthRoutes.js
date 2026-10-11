import express from 'express';
import {
  createOrUpdateHealth,
  getHealthHistory,
  getHealthById,
  updateHealth,
  deleteHealth,
  patchWeight,
  patchWater,
  patchSleep,
  calculateBMIRoute
} from '../controllers/healthController.js';
import { validateHealthInput, validateBMICalculationInput } from '../middleware/validateRequest.js';

const router = express.Router();

router.route('/')
  .get(getHealthHistory)
  .post(validateHealthInput, createOrUpdateHealth);

router.post('/bmi', validateBMICalculationInput, calculateBMIRoute);

router.route('/:id')
  .get(getHealthById)
  .put(validateHealthInput, updateHealth)
  .delete(deleteHealth);

router.patch('/:id/weight', patchWeight);
router.patch('/:id/water', patchWater);
router.patch('/:id/sleep', patchSleep);

export default router;