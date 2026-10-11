/**
 * Validation utilities for Health Records and Fitness Goals
 */

export const validateHealthRecord = (formData) => {
  const errors = {};

  // Weight validation
  const weight = parseFloat(formData.weight);
  if (formData.weight === '' || formData.weight === undefined || formData.weight === null) {
    errors.weight = 'Weight is required.';
  } else if (isNaN(weight) || weight <= 0) {
    errors.weight = 'Please enter a positive weight value.';
  } else if (weight < 20 || weight > 350) {
    errors.weight = 'Weight must be within a realistic range (20 kg - 350 kg).';
  }

  // Water validation
  const water = parseFloat(formData.waterIntake);
  if (formData.waterIntake === '' || formData.waterIntake === undefined || formData.waterIntake === null) {
    errors.waterIntake = 'Water intake is required.';
  } else if (isNaN(water) || water < 0) {
    errors.waterIntake = 'Water intake cannot be negative.';
  } else if (water > 15) {
    errors.waterIntake = 'Water intake cannot exceed 15 litres in a single day.';
  }

  // Sleep validation
  const sleep = parseFloat(formData.sleepDuration);
  if (formData.sleepDuration === '' || formData.sleepDuration === undefined || formData.sleepDuration === null) {
    errors.sleepDuration = 'Sleep duration is required.';
  } else if (isNaN(sleep) || sleep < 0) {
    errors.sleepDuration = 'Sleep duration cannot be negative.';
  } else if (sleep > 24) {
    errors.sleepDuration = 'Sleep duration cannot exceed 24 hours in a single day.';
  }

  // Steps validation
  const steps = formData.steps;
  if (steps === '' || steps === undefined || steps === null) {
    errors.steps = 'Steps count is required.';
  } else {
    const stepsNum = Number(steps);
    if (!Number.isInteger(stepsNum) || stepsNum < 0) {
      errors.steps = 'Steps must be a non-negative whole integer.';
    } else if (stepsNum > 100000) {
      errors.steps = 'Steps count cannot exceed 100,000 steps per day.';
    }
  }

  // Calories validation
  const calories = formData.calories;
  if (calories === '' || calories === undefined || calories === null) {
    errors.calories = 'Calories consumed is required.';
  } else {
    const calNum = Number(calories);
    if (!Number.isInteger(calNum) || calNum <= 0) {
      errors.calories = 'Calories must be a positive whole integer.';
    } else if (calNum < 500 || calNum > 10000) {
      errors.calories = 'Calories must be within a realistic daily range (500 - 10,000 kcal).';
    }
  }

  // Date validation
  if (!formData.date) {
    errors.date = 'Date is required.';
  } else {
    const recordDate = new Date(formData.date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (isNaN(recordDate.getTime())) {
      errors.date = 'Please select a valid calendar date.';
    } else if (recordDate > today) {
      errors.date = 'Record date cannot be in the future.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateGoals = (goalsData) => {
  const errors = {};

  // Step goal
  const stepGoal = Number(goalsData.stepGoal);
  if (!stepGoal || isNaN(stepGoal)) {
    errors.stepGoal = 'Daily step goal is required.';
  } else if (!Number.isInteger(stepGoal) || stepGoal < 1000 || stepGoal > 50000) {
    errors.stepGoal = 'Step goal must be between 1,000 and 50,000 steps/day.';
  }

  // Calorie goal
  const calorieGoal = Number(goalsData.calorieGoal);
  if (!calorieGoal || isNaN(calorieGoal)) {
    errors.calorieGoal = 'Daily calorie goal is required.';
  } else if (!Number.isInteger(calorieGoal) || calorieGoal < 1000 || calorieGoal > 6000) {
    errors.calorieGoal = 'Calorie goal must be between 1,000 and 6,000 kcal/day.';
  }

  // Target weight
  const weightGoal = parseFloat(goalsData.weightGoal);
  if (!weightGoal || isNaN(weightGoal)) {
    errors.weightGoal = 'Target weight is required.';
  } else if (weightGoal < 25 || weightGoal > 300) {
    errors.weightGoal = 'Target weight must be between 25 kg and 300 kg.';
  }

  // Water goal (optional/extended)
  if (goalsData.waterGoal !== undefined && goalsData.waterGoal !== '') {
    const waterGoal = parseFloat(goalsData.waterGoal);
    if (isNaN(waterGoal) || waterGoal < 1 || waterGoal > 10) {
      errors.waterGoal = 'Target water intake must be between 1.0 L and 10.0 L/day.';
    }
  }

  // Sleep goal (optional/extended)
  if (goalsData.sleepGoal !== undefined && goalsData.sleepGoal !== '') {
    const sleepGoal = parseFloat(goalsData.sleepGoal);
    if (isNaN(sleepGoal) || sleepGoal < 4 || sleepGoal > 14) {
      errors.sleepGoal = 'Target sleep duration must be between 4.0 and 14.0 hours/night.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
