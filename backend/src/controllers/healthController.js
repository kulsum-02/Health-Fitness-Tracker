import { Health } from '../models/Health.js';
import { User } from '../models/User.js';
import { calculateBMI, evaluateBMI } from '../services/bmiService.js';

export const createOrUpdateHealth = async (req, res, next) => {
  try {
    const userId = req.body.userId || 'usr_alex_01';
    const { date, weight, waterIntake, sleepDuration, steps, calories } = req.body;

    // Resolve user to fetch authoritative height
    let user = await User.findOne({ userId });
    if (!user) {
      user = await User.create({ userId, currentWeight: weight });
    }

    const height = req.body.height || user.height || 170;
    const computedBMI = calculateBMI(weight, height);

    // Upsert record for the day
    let record = await Health.findOne({ userId, date });
    let isNew = false;

    if (record) {
      record.weight = parseFloat(weight);
      record.waterIntake = parseFloat(waterIntake);
      record.sleepDuration = parseFloat(sleepDuration);
      record.steps = Number(steps);
      record.calories = Number(calories);
      record.bmi = computedBMI;
      record.height = height;
      await record.save();
    } else {
      isNew = true;
      record = await Health.create({
        healthId: req.body.healthId || `hlth_${Date.now()}`,
        userId,
        date,
        weight: parseFloat(weight),
        waterIntake: parseFloat(waterIntake),
        sleepDuration: parseFloat(sleepDuration),
        steps: Number(steps),
        calories: Number(calories),
        bmi: computedBMI,
        height
      });
    }

    // Sync current weight in user profile
    user.currentWeight = parseFloat(weight);
    await user.save();

    res.status(isNew ? 201 : 200).json({
      success: true,
      message: isNew ? 'Health record created successfully' : 'Health record updated successfully',
      data: record
    });
  } catch (error) {
    next(error);
  }
};

export const getHealthHistory = async (req, res, next) => {
  try {
    const userId = req.query.userId || 'usr_alex_01';
    const { startDate, endDate, limit, sortOrder = 'desc' } = req.query;

    const filter = { userId };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = startDate;
      if (endDate) filter.date.$lte = endDate;
    }

    let query = Health.find(filter).sort({ date: sortOrder === 'asc' ? 1 : -1 });
    if (limit) query = query.limit(parseInt(limit, 10));

    const records = await query.exec();

    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    next(error);
  }
};

export const getHealthById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const record = await Health.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { healthId: id }]
    });

    if (!record) {
      return res.status(404).json({ success: false, message: 'Health record not found' });
    }

    res.status(200).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

export const updateHealth = async (req, res, next) => {
  try {
    const { id } = req.params;
    const record = await Health.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { healthId: id }]
    });

    if (!record) {
      return res.status(404).json({ success: false, message: 'Health record not found' });
    }

    const { weight, waterIntake, sleepDuration, steps, calories } = req.body;

    if (weight !== undefined) {
      record.weight = parseFloat(weight);
      const user = await User.findOne({ userId: record.userId });
      const height = record.height || user?.height || 170;
      record.bmi = calculateBMI(record.weight, height);

      if (user) {
        user.currentWeight = record.weight;
        await user.save();
      }
    }

    if (waterIntake !== undefined) record.waterIntake = parseFloat(waterIntake);
    if (sleepDuration !== undefined) record.sleepDuration = parseFloat(sleepDuration);
    if (steps !== undefined) record.steps = Number(steps);
    if (calories !== undefined) record.calories = Number(calories);

    await record.save();

    res.status(200).json({
      success: true,
      message: 'Health record updated successfully',
      data: record
    });
  } catch (error) {
    next(error);
  }
};

export const deleteHealth = async (req, res, next) => {
  try {
    const { id } = req.params;
    const record = await Health.findOneAndDelete({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { healthId: id }]
    });

    if (!record) {
      return res.status(404).json({ success: false, message: 'Health record not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Health record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const patchWeight = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { weight } = req.body;

    if (weight === undefined || isNaN(parseFloat(weight))) {
      return res.status(400).json({ success: false, message: 'Valid weight is required.' });
    }

    const record = await Health.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { healthId: id }]
    });

    if (!record) {
      return res.status(404).json({ success: false, message: 'Health record not found' });
    }

    record.weight = parseFloat(weight);
    const user = await User.findOne({ userId: record.userId });
    const height = record.height || user?.height || 170;
    record.bmi = calculateBMI(record.weight, height);
    await record.save();

    if (user) {
      user.currentWeight = record.weight;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Weight and BMI updated',
      data: record
    });
  } catch (error) {
    next(error);
  }
};

export const patchWater = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { waterIntake } = req.body;

    const record = await Health.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { healthId: id }]
    });

    if (!record) {
      return res.status(404).json({ success: false, message: 'Health record not found' });
    }

    record.waterIntake = parseFloat(waterIntake);
    await record.save();

    res.status(200).json({
      success: true,
      message: 'Water intake updated',
      data: record
    });
  } catch (error) {
    next(error);
  }
};

export const patchSleep = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { sleepDuration } = req.body;

    const record = await Health.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { healthId: id }]
    });

    if (!record) {
      return res.status(404).json({ success: false, message: 'Health record not found' });
    }

    record.sleepDuration = parseFloat(sleepDuration);
    await record.save();

    res.status(200).json({
      success: true,
      message: 'Sleep duration updated',
      data: record
    });
  } catch (error) {
    next(error);
  }
};

export const calculateBMIRoute = (req, res) => {
  const { weight, height } = req.body;
  const result = evaluateBMI(weight, height);
  res.status(200).json({
    success: true,
    data: result
  });
};