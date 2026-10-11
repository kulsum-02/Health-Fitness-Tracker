/**
 * Realistic Mock Data for FitPulse Pro
 * Demonstrates 14-day history, dynamic calculation benchmarks, and prompt-exact specs.
 */

import { getTodayString, getNDaysAgoString } from '../utils/dateUtils';
import { calculateBMI } from '../utils/bmiCalculator';

export const initialUserProfile = {
  userId: 'usr_alex_01',
  name: 'Alex Morgan',
  email: 'alex.morgan@fitpulse.io',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
  height: 170, // cm
  startingWeight: 72.0, // kg
  currentWeight: 68.4, // kg
  targetWeight: 65.0, // kg
  gender: 'female',
  age: 28,
  goalType: 'weight_loss'
};

export const initialGoals = {
  goalId: 'goal_alex_01',
  userId: 'usr_alex_01',
  goalType: 'weight_loss',
  stepGoal: 10000,
  calorieGoal: 2200,
  weightGoal: 65.0,
  waterGoal: 2.5,
  sleepGoal: 8.0,
  workoutDaysGoal: 5,
  activeMinutesGoal: 45
};

export const generateInitialRecords = () => {
  const heightCm = initialUserProfile.height;
  
  // Baseline progression from 13 days ago up to today (day 0)
  const baseSpecs = [
    { dayOffset: 13, weight: 71.9, water: 2.1, sleep: 7.2, steps: 8200, calories: 2180 },
    { dayOffset: 12, weight: 71.6, water: 2.3, sleep: 7.8, steps: 9100, calories: 2140 },
    { dayOffset: 11, weight: 71.4, water: 2.0, sleep: 6.8, steps: 7800, calories: 2250 },
    { dayOffset: 10, weight: 71.1, water: 2.4, sleep: 8.1, steps: 10450, calories: 2100 },
    { dayOffset: 9, weight: 70.8, water: 2.2, sleep: 7.4, steps: 9600, calories: 2190 },
    { dayOffset: 8, weight: 70.5, water: 2.5, sleep: 7.9, steps: 11200, calories: 2080 },
    { dayOffset: 7, weight: 70.2, water: 2.1, sleep: 6.9, steps: 8400, calories: 2220 },
    { dayOffset: 6, weight: 69.9, water: 2.4, sleep: 7.5, steps: 9800, calories: 2150 },
    { dayOffset: 5, weight: 69.6, water: 2.6, sleep: 8.0, steps: 10300, calories: 2120 },
    { dayOffset: 4, weight: 69.3, water: 2.2, sleep: 7.3, steps: 8900, calories: 2200 },
    { dayOffset: 3, weight: 69.0, water: 2.5, sleep: 7.7, steps: 10100, calories: 2110 },
    { dayOffset: 2, weight: 68.8, water: 2.3, sleep: 7.0, steps: 9400, calories: 2170 },
    { dayOffset: 1, weight: 68.6, water: 2.4, sleep: 7.6, steps: 10250, calories: 2130 },
    // Today's entry matching prompt example: 68.4 kg, 1.8 L, 7.1 hrs, 7,842 steps
    { dayOffset: 0, weight: 68.4, water: 1.8, sleep: 7.1, steps: 7842, calories: 1950 }
  ];

  return baseSpecs.map((item, index) => {
    const date = item.dayOffset === 0 ? getTodayString() : getNDaysAgoString(item.dayOffset);
    return {
      healthId: `hlth_${1000 + index}`,
      userId: 'usr_alex_01',
      date,
      weight: item.weight,
      waterIntake: item.water,
      sleepDuration: item.sleep,
      steps: item.steps,
      calories: item.calories,
      bmi: calculateBMI(item.weight, heightCm)
    };
  });
};
