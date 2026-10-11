import { Goal } from '../models/Goal.js';
import { User } from '../models/User.js';

export const getActiveGoals = async (req, res, next) => {
  try {
    const userId = req.query.userId || 'usr_alex_01';

    let goal = await Goal.findOne({ userId, isActive: true });
    if (!goal) {
      goal = await Goal.create({ userId });
    }

    res.status(200).json({
      success: true,
      data: goal
    });
  } catch (error) {
    next(error);
  }
};

export const createGoal = async (req, res, next) => {
  try {
    const userId = req.body.userId || 'usr_alex_01';

    // Deactivate previous goals
    await Goal.updateMany({ userId, isActive: true }, { isActive: false });

    const goal = await Goal.create({
      ...req.body,
      userId,
      isActive: true
    });

    // Sync target weight with user profile
    if (req.body.weightGoal) {
      await User.findOneAndUpdate(
        { userId },
        { targetWeight: req.body.weightGoal, goalType: req.body.goalType || 'weight_loss' },
        { upsert: true }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Goal created successfully',
      data: goal
    });
  } catch (error) {
    next(error);
  }
};

export const updateGoals = async (req, res, next) => {
  try {
    const userId = req.body.userId || req.query.userId || 'usr_alex_01';
    const id = req.params.id;

    const filter = id
      ? { $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { goalId: id }] }
      : { userId, isActive: true };

    let goal = await Goal.findOne(filter);
    if (!goal) {
      goal = await Goal.create({ userId, ...req.body });
    } else {
      Object.assign(goal, req.body);
      await goal.save();
    }

    // Sync with User profile
    if (req.body.weightGoal || req.body.goalType) {
      const userUpdates = {};
      if (req.body.weightGoal) userUpdates.targetWeight = parseFloat(req.body.weightGoal);
      if (req.body.goalType) userUpdates.goalType = req.body.goalType;
      await User.findOneAndUpdate({ userId }, userUpdates, { upsert: true });
    }

    res.status(200).json({
      success: true,
      message: 'Goals updated successfully',
      data: goal
    });
  } catch (error) {
    next(error);
  }
};

export const patchGoal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const goal = await Goal.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { goalId: id }]
    });

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    Object.assign(goal, req.body);
    await goal.save();

    res.status(200).json({
      success: true,
      message: 'Goal updated',
      data: goal
    });
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.query.userId || 'usr_alex_01';
    let user = await User.findOne({ userId });
    if (!user) {
      user = await User.create({ userId });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.body.userId || 'usr_alex_01';
    let user = await User.findOne({ userId });
    if (!user) {
      user = await User.create({ userId, ...req.body });
    } else {
      Object.assign(user, req.body);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'User profile updated',
      data: user
    });
  } catch (error) {
    next(error);
  }
};