import { isValidDateString, getTodayString } from '../utils/dateUtils.js';

export const validateHealthInput = (req, res, next) => {
  const { weight, waterIntake, sleepDuration, steps, calories, date } = req.body;
  const errors = [];

  // Weight
  const w = parseFloat(weight);
  if (weight === undefined || weight === null || isNaN(w)) {
    errors.push('Weight is required and must be a number.');
  } else if (w < 20 || w > 350) {
    errors.push('Weight must be within realistic physiological bounds (20 kg - 350 kg).');
  }

  // Water
  const water = parseFloat(waterIntake);
  if (waterIntake === undefined || waterIntake === null || isNaN(water)) {
    errors.push('Water intake is required and must be a number.');
  } else if (water < 0 || water > 15) {
    errors.push('Water intake must be between 0 and 15 litres.');
  }

  // Sleep
  const sleep = parseFloat(sleepDuration);
  if (sleepDuration === undefined || sleepDuration === null || isNaN(sleep)) {
    errors.push('Sleep duration is required and must be a number.');
  } else if (sleep < 0 || sleep > 24) {
    errors.push('Sleep duration must be between 0 and 24 hours.');
  }

  // Steps
  const st = Number(steps);
  if (steps === undefined || steps === null || !Number.isInteger(st)) {
    errors.push('Steps count is required and must be an integer.');
  } else if (st < 0 || st > 100000) {
    errors.push('Steps must be between 0 and 100,000.');
  }

  // Calories
  const cal = Number(calories);
  if (calories === undefined || calories === null || !Number.isInteger(cal)) {
    errors.push('Calories consumed is required and must be an integer.');
  } else if (cal < 500 || cal > 10000) {
    errors.push('Daily calories must be between 500 and 10,000 kcal.');
  }

  // Date
  if (!date || !isValidDateString(date)) {
    errors.push('Date must be formatted as YYYY-MM-DD.');
  } else if (date > getTodayString()) {
    errors.push('Record date cannot be in the future.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed for health record.',
      errors
    });
  }

  next();
};

export const validateGoalInput = (req, res, next) => {
  const { stepGoal, calorieGoal, weightGoal, waterGoal, sleepGoal } = req.body;
  const errors = [];

  if (stepGoal !== undefined) {
    const st = Number(stepGoal);
    if (!Number.isInteger(st) || st < 1000 || st > 50000) {
      errors.push('Step goal must be an integer between 1,000 and 50,000 steps/day.');
    }
  }

  if (calorieGoal !== undefined) {
    const cal = Number(calorieGoal);
    if (!Number.isInteger(cal) || cal < 1000 || cal > 6000) {
      errors.push('Calorie budget must be an integer between 1,000 and 6,000 kcal/day.');
    }
  }

  if (weightGoal !== undefined) {
    const w = parseFloat(weightGoal);
    if (isNaN(w) || w < 20 || w > 350) {
      errors.push('Target weight must be between 20 kg and 350 kg.');
    }
  }

  if (waterGoal !== undefined) {
    const water = parseFloat(waterGoal);
    if (isNaN(water) || water < 1.0 || water > 10.0) {
      errors.push('Target water intake must be between 1.0 and 10.0 litres/day.');
    }
  }

  if (sleepGoal !== undefined) {
    const sleep = parseFloat(sleepGoal);
    if (isNaN(sleep) || sleep < 4.0 || sleep > 14.0) {
      errors.push('Target sleep duration must be between 4.0 and 14.0 hours/night.');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed for fitness goals.',
      errors
    });
  }

  next();
};

export const validateBMICalculationInput = (req, res, next) => {
  const { weight, height } = req.body;
  const w = parseFloat(weight);
  const h = parseFloat(height);

  if (isNaN(w) || w <= 0 || isNaN(h) || h <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Positive weight (kg) and height (cm) are required to calculate BMI.',
      errors: ['Invalid height or weight measurements.']
    });
  }

  next();
};