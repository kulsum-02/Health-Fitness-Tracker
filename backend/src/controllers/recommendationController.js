import { Health } from '../models/Health.js';
import { Goal } from '../models/Goal.js';
import { User } from '../models/User.js';
import { generateRecommendations } from '../services/recommendationService.js';

export const getRecommendations = async (req, res, next) => {
  try {
    const userId = req.query.userId || 'usr_alex_01';
    const categoryFilter = req.query.category || null;

    const [user, goal, records] = await Promise.all([
      User.findOne({ userId }),
      Goal.findOne({ userId, isActive: true }),
      Health.find({ userId }).sort({ date: 1 })
    ]);

    const recommendations = generateRecommendations({
      user,
      goals: goal,
      healthRecords: records,
      categoryFilter
    });

    res.status(200).json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    next(error);
  }
};