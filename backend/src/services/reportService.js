/**
 * Clinical & Fitness Report Generation Service
 */

import { calculateAverages, evaluateAchievements } from './progressService.js';
import { calculateBMI, getBMICategory } from './bmiService.js';
import { generateRecommendations } from './recommendationService.js';

export const generateHealthReport = ({
  type = 'weekly',
  records = [],
  goals = {},
  user = {},
  startDate = null,
  endDate = null
}) => {
  const safeStepGoal = Number(goals?.stepGoal || 10000);
  const safeWaterGoal = Number(goals?.waterGoal || 2.5);
  const safeSleepGoal = Number(goals?.sleepGoal || 8.0);
  const safeCalorieGoal = Number(goals?.calorieGoal || 2200);
  const safeWeightGoal = Number(goals?.weightGoal || 65.0);

  const sorted = [...(records || [])].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let periodRecords = [];
  let periodLabel = '';

  if (type === 'custom' && startDate && endDate) {
    periodRecords = sorted.filter(r => r.date >= startDate && r.date <= endDate);
    periodLabel = `Custom Range (${startDate} to ${endDate})`;
  } else if (type === 'weekly') {
    periodRecords = sorted.slice(-7);
    const start = periodRecords[0]?.date || 'Past Week';
    const end = periodRecords[periodRecords.length - 1]?.date || 'Today';
    periodLabel = `Last 7 Days (${start} to ${end})`;
  } else {
    // monthly
    periodRecords = sorted.slice(-30);
    const start = periodRecords[0]?.date || 'Past Month';
    const end = periodRecords[periodRecords.length - 1]?.date || 'Today';
    periodLabel = `Last 30 Days (${start} to ${end})`;
  }

  const startRecord = periodRecords[0] || sorted[0] || {};
  const latestRecord = periodRecords[periodRecords.length - 1] || sorted[sorted.length - 1] || {};

  const averages = calculateAverages(periodRecords);
  const startWeight = startRecord.weight || user?.startingWeight || 72.0;
  const currentWeight = latestRecord.weight || user?.currentWeight || 68.4;
  const targetWeight = safeWeightGoal;
  const weightChange = Number((currentWeight - startWeight).toFixed(1));

  const currentBMI = calculateBMI(currentWeight, user?.height || 170);
  const bmiInfo = getBMICategory(currentBMI);

  // Adherences
  const stepAdherence = Math.min(100, Math.round(((averages.avgSteps || 0) / safeStepGoal) * 100));
  const waterAdherence = Math.min(100, Math.round(((averages.avgWater || 0) / safeWaterGoal) * 100));
  const sleepAdherence = Math.min(100, Math.round(((averages.avgSleep || 0) / safeSleepGoal) * 100));
  const overallAdherence = Math.round((stepAdherence + waterAdherence + sleepAdherence) / 3);

  const achievements = evaluateAchievements(periodRecords, goals, user);

  // Areas Needing Improvement
  const areasForImprovement = [];
  if (averages.avgWater < safeWaterGoal * 0.8) {
    areasForImprovement.push(`Daily hydration averaged ${averages.avgWater}L, falling short of your ${safeWaterGoal}L target.`);
  }
  if (averages.avgSleep < 7.0) {
    areasForImprovement.push(`Sleep averaged ${averages.avgSleep} hrs/night, below the restorative 7.0-8.0 hour range.`);
  }
  if (averages.avgSteps < safeStepGoal * 0.8) {
    const deficit = Math.max(0, safeStepGoal - (averages.avgSteps || 0));
    areasForImprovement.push(`Average daily steps (${Number(averages.avgSteps || 0).toLocaleString()}) trailed the ${safeStepGoal.toLocaleString()} goal by ~${deficit.toLocaleString()} steps.`);
  }
  if (areasForImprovement.length === 0) {
    areasForImprovement.push('Consistency is high across all major vectors! Continue fine-tuning meal timing and mobility.');
  }

  const smartRecs = generateRecommendations({ user, goals, healthRecords: periodRecords });
  const topRecs = [
    ...(smartRecs.workoutRecommendations || []).map(w => ({ category: 'Workout', title: w.title, advice: w.description })),
    ...(smartRecs.goalRecommendations || []).map(g => ({ category: 'Nutrition/Goal', title: g.title, advice: g.advice })),
    ...(smartRecs.progressInsights || []).slice(0, 2).map(p => ({ category: 'Progress Insight', title: p.title, advice: p.description }))
  ];

  return {
    type,
    period: periodLabel,
    generatedAt: new Date().toISOString(),
    user: {
      name: user?.name || 'Alex Morgan',
      height: user?.height || 170,
      goalType: goals?.goalType || user?.goalType || 'weight_loss'
    },
    goals: {
      stepGoal: safeStepGoal,
      waterGoal: safeWaterGoal,
      sleepGoal: safeSleepGoal,
      calorieGoal: safeCalorieGoal,
      weightGoal: safeWeightGoal,
      ...goals
    },
    metrics: {
      startWeight,
      currentWeight,
      targetWeight,
      weightChange,
      currentBMI,
      bmiCategory: bmiInfo.category,
      avgSteps: averages.avgSteps,
      avgWater: averages.avgWater,
      avgSleep: averages.avgSleep,
      avgCalories: averages.avgCalories,
      stepAdherence,
      waterAdherence,
      sleepAdherence,
      overallAdherence
    },
    records: periodRecords,
    achievements,
    areasForImprovement,
    recommendations: topRecs
  };
};