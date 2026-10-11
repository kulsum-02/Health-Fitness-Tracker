import { Health } from '../models/Health.js';
import { Goal } from '../models/Goal.js';
import { User } from '../models/User.js';
import { generateHealthReport } from '../services/reportService.js';

export const getWeeklyReport = async (req, res, next) => {
  try {
    const userId = req.query.userId || 'usr_alex_01';

    const [user, goal, records] = await Promise.all([
      User.findOne({ userId }),
      Goal.findOne({ userId, isActive: true }),
      Health.find({ userId }).sort({ date: 1 })
    ]);

    const report = generateHealthReport({
      type: 'weekly',
      records,
      goals: goal,
      user
    });

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

export const getMonthlyReport = async (req, res, next) => {
  try {
    const userId = req.query.userId || 'usr_alex_01';

    const [user, goal, records] = await Promise.all([
      User.findOne({ userId }),
      Goal.findOne({ userId, isActive: true }),
      Health.find({ userId }).sort({ date: 1 })
    ]);

    const report = generateHealthReport({
      type: 'monthly',
      records,
      goals: goal,
      user
    });

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomReport = async (req, res, next) => {
  try {
    const userId = req.query.userId || 'usr_alex_01';
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'startDate and endDate query parameters are required for custom reports.'
      });
    }

    const [user, goal, records] = await Promise.all([
      User.findOne({ userId }),
      Goal.findOne({ userId, isActive: true }),
      Health.find({ userId }).sort({ date: 1 })
    ]);

    const report = generateHealthReport({
      type: 'custom',
      records,
      goals: goal,
      user,
      startDate,
      endDate
    });

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};