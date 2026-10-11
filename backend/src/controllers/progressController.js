import { Health } from '../models/Health.js';
import { Goal } from '../models/Goal.js';
import { User } from '../models/User.js';
import { getFullProgressSummary, calculateAverages } from '../services/progressService.js';

export const getProgress = async (req, res, next) => {
  try {
    const userId = req.query.userId || 'usr_alex_01';

    const [user, goal, records] = await Promise.all([
      User.findOne({ userId }),
      Goal.findOne({ userId, isActive: true }),
      Health.find({ userId }).sort({ date: 1 })
    ]);

    const activeUser = user || { startingWeight: 72.0, currentWeight: 68.4 };
    const activeGoal = goal || {
      stepGoal: 10000,
      calorieGoal: 2200,
      weightGoal: 65.0,
      waterGoal: 2.5,
      sleepGoal: 8.0
    };

    const summary = getFullProgressSummary(activeUser, activeGoal, records);

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    next(error);
  }
};

export const getWeeklyProgress = async (req, res, next) => {
  try {
    const userId = req.query.userId || 'usr_alex_01';

    const [user, goal, records] = await Promise.all([
      User.findOne({ userId }),
      Goal.findOne({ userId, isActive: true }),
      Health.find({ userId }).sort({ date: 1 })
    ]);

    const last7 = records.slice(-7);
    const averages = calculateAverages(last7);

    const weekStartWeight = last7[0]?.weight || user?.startingWeight || 72.0;
    const weekCurrentWeight = last7[last7.length - 1]?.weight || user?.currentWeight || 68.4;
    const weightDiff = Number((weekCurrentWeight - weekStartWeight).toFixed(1));

    const stepGoal = goal?.stepGoal || 10000;
    const waterGoal = goal?.waterGoal || 2.5;
    const sleepGoal = goal?.sleepGoal || 8.0;

    const goalCompletion = Math.round(
      (((averages.avgSteps / stepGoal) +
        (averages.avgWater / waterGoal) +
        (averages.avgSleep / sleepGoal)) / 3) * 100
    );

    res.status(200).json({
      success: true,
      data: {
        averages,
        weightDiff,
        goalCompletion,
        records: last7
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMonthlyProgress = async (req, res, next) => {
  try {
    const userId = req.query.userId || 'usr_alex_01';

    const [user, goal, records] = await Promise.all([
      User.findOne({ userId }),
      Goal.findOne({ userId, isActive: true }),
      Health.find({ userId }).sort({ date: 1 })
    ]);

    const last30 = records.slice(-30);
    const averages = calculateAverages(last30);

    const startWeight = last30[0]?.weight || user?.startingWeight || 72.0;
    const currentWeight = last30[last30.length - 1]?.weight || user?.currentWeight || 68.4;
    const weightDiff = Number((currentWeight - startWeight).toFixed(1));

    res.status(200).json({
      success: true,
      data: {
        averages,
        weightDiff,
        recordsCount: last30.length,
        consistencyScore: Math.min(100, Math.round((last30.length / 30) * 100)),
        records: last30
      }
    });
  } catch (error) {
    next(error);
  }
};