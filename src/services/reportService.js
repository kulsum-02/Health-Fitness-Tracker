/**
 * Health Report Generation Service
 * Aggregates Weekly and Monthly data for clinical/fitness analysis.
 */

import { calculateAverages, calculateWeightProgress, evaluateAchievements } from '../utils/progressCalculators';
import { calculateBMI, getBMICategory } from '../utils/bmiCalculator';
import { generateSmartRecommendations } from '../utils/recommendationEngine';

export const reportService = {
  generateReport({ type = 'weekly', healthRecords = [], goals = {}, user = {} }) {
    const safeStepGoal = Number(goals?.stepGoal || 10000);
    const safeWaterGoal = Number(goals?.waterGoal || 2.5);
    const safeSleepGoal = Number(goals?.sleepGoal || 8.0);
    const safeCalorieGoal = Number(goals?.calorieGoal || 2200);
    const safeWeightGoal = Number(goals?.weightGoal || 65.0);

    const daysCount = type === 'weekly' ? 7 : 30;
    const sorted = [...(healthRecords || [])].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Slice records for period
    const periodRecords = sorted.slice(-daysCount);
    const startRecord = periodRecords[0] || sorted[0] || {};
    const latestRecord = periodRecords[periodRecords.length - 1] || sorted[sorted.length - 1] || {};

    const averages = calculateAverages(periodRecords);
    const startWeight = startRecord.weight || user?.startingWeight || 72.0;
    const currentWeight = latestRecord.weight || user?.currentWeight || 68.4;
    const targetWeight = safeWeightGoal;
    const weightChange = Number((currentWeight - startWeight).toFixed(1));

    const currentBMI = calculateBMI(currentWeight, user?.height || 170);
    const bmiInfo = getBMICategory(currentBMI);

    // Goal Adherences
    const stepAdherence = Math.min(100, Math.round(((averages.avgSteps || 0) / safeStepGoal) * 100));
    const waterAdherence = Math.min(100, Math.round(((averages.avgWater || 0) / safeWaterGoal) * 100));
    const sleepAdherence = Math.min(100, Math.round(((averages.avgSleep || 0) / safeSleepGoal) * 100));
    const overallAdherence = Math.round((stepAdherence + waterAdherence + sleepAdherence) / 3);

    // Achievements in period
    const achievements = evaluateAchievements(periodRecords, goals, user);

    // Identify areas needing improvement
    const areasForImprovement = [];
    if (averages.avgWater < safeWaterGoal * 0.8) {
      areasForImprovement.push(`Daily hydration averaged ${averages.avgWater}L, falling short of your ${safeWaterGoal}L target.`);
    }
    if (averages.avgSleep < 7.0) {
      areasForImprovement.push(`Sleep averaged ${averages.avgSleep} hrs/night, which is below the recommended 7.0-8.0 hour restoration range.`);
    }
    if (averages.avgSteps < safeStepGoal * 0.8) {
      areasForImprovement.push(`Average daily steps (${Number(averages.avgSteps || 0).toLocaleString()}) trailed the ${safeStepGoal.toLocaleString()} goal by ~${Number(Math.max(0, safeStepGoal - (averages.avgSteps || 0))).toLocaleString()} steps.`);
    }
    if (areasForImprovement.length === 0) {
      areasForImprovement.push('Consistency is high across all major vectors! Continue fine-tuning meal timing and mobility.');
    }

    // Actionable Recommendations
    const smartRecs = generateSmartRecommendations({ user, goals, healthRecords: periodRecords });
    const topRecs = [
      ...(smartRecs.workoutRecommendations || []).map(w => ({ category: 'Workout', title: w.title, advice: w.description })),
      ...(smartRecs.goalRecommendations || []).map(g => ({ category: 'Nutrition/Goal', title: g.title, advice: g.advice })),
      ...(smartRecs.progressInsights || []).slice(0, 2).map(p => ({ category: 'Progress Insight', title: p.title, advice: p.description }))
    ];

    const periodLabel = type === 'weekly' 
      ? `Last 7 Days (${startRecord.date || 'Past Week'} to ${latestRecord.date || 'Today'})`
      : `Last 30 Days (${startRecord.date || 'Past Month'} to ${latestRecord.date || 'Today'})`;

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
  }
};
