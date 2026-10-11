import express from 'express';
import {
  getActiveGoals,
  createGoal,
  updateGoals,
  patchGoal,
  getUserProfile,
  updateUserProfile
} from '../controllers/goalController.js';
import { validateGoalInput } from '../middleware/validateRequest.js';

const router = express.Router();

router.get('/user/profile', getUserProfile);
router.put('/user/profile', updateUserProfile);

router.route('/')
  .get(getActiveGoals)
  .post(validateGoalInput, createGoal)
  .put(validateGoalInput, updateGoals);

router.route('/:id')
  .put(validateGoalInput, updateGoals)
  .patch(validateGoalInput, patchGoal);

export default router;