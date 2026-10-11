/**
 * Intelligent Frontend Recommendation Engine
 * Analyzes:
 * - Current Weight vs Target Weight & Starting Weight
 * - BMI & Category
 * - Daily Steps vs Step Goal
 * - Water Intake vs Water Goal
 * - Sleep Duration vs Sleep Goal
 * - Calorie Intake vs Calorie Goal
 * - Recent 7-day Trajectory & Consistency
 */

import { exerciseCatalog } from '../data/exerciseCatalog';
import { calculateBMI, getBMICategory } from './bmiCalculator';
import { calculateAverages } from './progressCalculators';

export const generateSmartRecommendations = ({ user, goals, healthRecords }) => {
  const recommendations = {
    workoutRecommendations: [],
    goalRecommendations: [],
    progressInsights: [],
    exerciseSuggestions: []
  };

  const safeStepGoal = Number(goals?.stepGoal || 10000);
  const safeWaterGoal = Number(goals?.waterGoal || 2.5);
  const safeSleepGoal = Number(goals?.sleepGoal || 8.0);
  const safeWeightGoal = Number(goals?.weightGoal || 65.0);

  if (!healthRecords || healthRecords.length === 0) {
    return recommendations;
  }

  // 1. Extract recent metrics
  const sorted = [...healthRecords].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const latest = sorted[sorted.length - 1] || {};
  const recent7 = sorted.slice(-7);
  const recentAverages = calculateAverages(recent7);
  
  const currentWeight = latest.weight || user?.currentWeight || 68.4;
  const heightCm = user?.height || 170;
  const currentBMI = calculateBMI(currentWeight, heightCm);
  const bmiInfo = getBMICategory(currentBMI);
  const goalType = goals?.goalType || user?.goalType || 'weight_loss';

  // --- SECTION A: WORKOUT RECOMMENDATIONS ---
  const stepRatio = (latest.steps || 0) / safeStepGoal;
  const avgStepRatio = (recentAverages.avgSteps || 0) / safeStepGoal;

  if (stepRatio < 0.7) {
    recommendations.workoutRecommendations.push({
      id: 'rec_walk_deficit',
      title: 'Quick Activity Boost: 20-30 Min Brisk Walk',
      category: 'Activity',
      priority: 'high',
      icon: 'Footprints',
      badge: 'Immediate Action',
      description: `You are currently at ${Number(latest.steps || 0).toLocaleString()} steps (${Math.round(stepRatio * 100)}% of your ${safeStepGoal.toLocaleString()} goal). A quick 25-minute brisk walk will bridge your daily deficit by ~2,500 steps.`,
      actionText: 'Schedule Walk'
    });
  } else if (stepRatio >= 1.0) {
    recommendations.workoutRecommendations.push({
      id: 'rec_active_strength',
      title: 'Target Surpassed: Add Strength Training',
      category: 'Strength',
      priority: 'medium',
      icon: 'Dumbbell',
      badge: 'Next Level',
      description: `You crushed your step goal today with ${Number(latest.steps || 0).toLocaleString()} steps! Consider adding 3 weekly resistance training sessions (squats, pushups, lunges) to build lean metabolic muscle.`,
      actionText: 'View Strength Plan'
    });
  } else {
    recommendations.workoutRecommendations.push({
      id: 'rec_steady_steps',
      title: 'Finish Strong: 15-Minute Evening Stroll',
      category: 'Activity',
      priority: 'medium',
      icon: 'Footprints',
      badge: 'Almost There',
      description: `You are within striking distance (${Math.round(stepRatio * 100)}%) of your ${safeStepGoal.toLocaleString()} step goal. An easy 15-minute evening stroll will complete today's target.`,
      actionText: 'Log Walk'
    });
  }

  if (recentAverages.avgSleep < 7.0) {
    recommendations.workoutRecommendations.push({
      id: 'rec_mobility_recovery',
      title: 'Active Recovery & Stretching Session',
      category: 'Recovery',
      priority: 'high',
      icon: 'Smile',
      badge: 'Restoration',
      description: `Your 7-day average sleep is ${recentAverages.avgSleep} hrs. Opt for low-intensity restorative mobility and dynamic stretching to reduce cortisol and speed up recovery.`,
      actionText: 'Start 15m Stretch'
    });
  }

  // --- SECTION B: GOAL-BASED RECOMMENDATIONS ---
  if (goalType === 'weight_loss') {
    recommendations.goalRecommendations.push({
      id: 'goal_deficit_guidance',
      title: 'Sustainable Caloric Deficit & NEAT',
      category: 'Nutrition & Energy',
      focus: 'Fat Loss & Muscle Retention',
      icon: 'Flame',
      badge: 'Weight Loss Focus',
      advice: `Aim for a modest 300–400 kcal deficit. Pair your cardio with resistance exercises to protect resting metabolic rate while shedding body fat.`,
      tips: [
        'Prioritize 1.6g–2.0g protein per kg of bodyweight to stay satiated.',
        'Increase daily Non-Exercise Activity Thermogenesis (NEAT) by taking the stairs.',
        'Track hidden calories in cooking oils and sugary beverages.'
      ]
    });
  } else if (goalType === 'muscle_gain') {
    recommendations.goalRecommendations.push({
      id: 'goal_hypertrophy_guidance',
      title: 'Progressive Overload & Caloric Surplus',
      category: 'Hypertrophy',
      focus: 'Lean Mass Building',
      icon: 'Dumbbell',
      badge: 'Muscle Gain Focus',
      advice: `Maintain a slight 200–300 kcal surplus with progressive overload on core compound movements (squats, presses, rows).`,
      tips: [
        'Distribute protein evenly across 4-5 meals.',
        'Target 8-12 repetitions close to muscular fatigue.',
        'Prioritize 8+ hours of sleep for optimum growth hormone release.'
      ]
    });
  } else {
    recommendations.goalRecommendations.push({
      id: 'goal_general_wellness',
      title: 'Balanced Cardiovascular & Mobility Lifestyle',
      category: 'Longevity & Fitness',
      focus: 'Holistic Vitality',
      icon: 'Heart',
      badge: 'General Fitness',
      advice: `Combine 150 minutes of moderate aerobic activity weekly with two full-body functional strength sessions.`,
      tips: [
        'Incorporate varied outdoor activities like cycling or swimming.',
        'Practice daily mobility work for joint resilience.',
        'Keep whole foods and colorful vegetables as dietary staples.'
      ]
    });
  }

  // --- SECTION C: PROGRESS-BASED SUGGESTIONS ---
  // 1. Water analysis
  const waterRatio = (latest.waterIntake || 0) / safeWaterGoal;
  if (waterRatio < 0.75) {
    recommendations.progressInsights.push({
      id: 'prog_water_low',
      type: 'warning',
      category: 'Hydration',
      icon: 'Droplets',
      title: 'Hydration Below Daily Target',
      description: `Today's intake (${latest.waterIntake || 0}L) is below your ${safeWaterGoal}L target (${Math.round(waterRatio * 100)}%). Keep a refillable water bottle at your desk and drink a glass before each meal.`
    });
  } else {
    recommendations.progressInsights.push({
      id: 'prog_water_optimal',
      type: 'success',
      category: 'Hydration',
      icon: 'CheckCircle',
      title: 'Optimal Hydration Maintained',
      description: `Well done! Your hydration level (${latest.waterIntake}L) is fueling cellular energy and metabolic recovery.`
    });
  }

  // 2. Sleep analysis
  if ((latest.sleepDuration || 0) < 7.0) {
    recommendations.progressInsights.push({
      id: 'prog_sleep_deficit',
      type: 'warning',
      category: 'Sleep & Recovery',
      icon: 'Moon',
      title: 'Sleep Deficit Detected',
      description: `You logged ${latest.sleepDuration || 0} hours of sleep, which is under the restorative 7–8 hour target. Try dimming screens 45 minutes before bed.`
    });
  } else {
    recommendations.progressInsights.push({
      id: 'prog_sleep_good',
      type: 'success',
      category: 'Sleep & Recovery',
      icon: 'Sparkles',
      title: 'Consistent Restful Sleep',
      description: `Your ${latest.sleepDuration} hours of sleep provided optimal deep-wave recovery for brain function and muscle tissue repair.`
    });
  }

  // 3. Weight trajectory
  const startWeight = user?.startingWeight || 72.0;
  const weightChange = Number((currentWeight - startWeight).toFixed(1));
  if (weightChange < 0 && goalType === 'weight_loss') {
    recommendations.progressInsights.push({
      id: 'prog_weight_trend',
      type: 'success',
      category: 'Weight Trajectory',
      icon: 'TrendingDown',
      title: 'Weight Trending Favorably',
      description: `You have successfully reduced ${Math.abs(weightChange)} kg towards your ${safeWeightGoal} kg target. Your consistency is producing measurable physiological results!`
    });
  } else if (weightChange > 0 && goalType === 'muscle_gain') {
    recommendations.progressInsights.push({
      id: 'prog_weight_gain_trend',
      type: 'success',
      category: 'Weight Trajectory',
      icon: 'TrendingUp',
      title: 'Positive Mass Progression',
      description: `You have gained +${weightChange} kg towards your lean muscle target. Keep feeding your training with adequate protein and hydration.`
    });
  }

  // --- SECTION D: MATCHED EXERCISE CATALOG SUGGESTIONS ---
  recommendations.exerciseSuggestions = exerciseCatalog.filter(ex => {
    if (goalType === 'weight_loss') return ex.goalFit.includes('weight_loss');
    if (goalType === 'muscle_gain') return ex.goalFit.includes('muscle_gain');
    return ex.goalFit.includes('general_fitness');
  });

  return recommendations;
};
