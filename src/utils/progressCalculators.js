/**
 * Progress Calculation and Achievement Status Engine
 */

export const getProgressStatus = (percentage) => {
  const p = Math.round(percentage);
  if (p < 10) {
    return {
      status: 'Not Started',
      badge: 'bg-slate-100 text-slate-700 border-slate-200',
      color: 'slate',
      message: 'Get started today!'
    };
  } else if (p < 75) {
    return {
      status: 'In Progress',
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
      color: 'blue',
      message: 'Making steady progress'
    };
  } else if (p < 100) {
    return {
      status: 'Almost Achieved',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      color: 'amber',
      message: 'Almost there! Push a little more'
    };
  } else if (p <= 110) {
    return {
      status: 'Achieved',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      color: 'emerald',
      message: 'Goal achieved! Excellent work'
    };
  } else {
    return {
      status: 'Exceeded',
      badge: 'bg-purple-50 text-purple-700 border-purple-200',
      color: 'purple',
      message: 'Outstanding! Goal exceeded'
    };
  }
};

/**
 * Calculate weight progress towards target from starting weight
 */
export const calculateWeightProgress = (currentWeight, targetWeight, startingWeight) => {
  const current = parseFloat(currentWeight);
  const target = parseFloat(targetWeight);
  const start = parseFloat(startingWeight);

  if (!current || !target || !start || start === target) {
    return { percentage: 0, delta: 0, remaining: 0, status: getProgressStatus(0) };
  }

  const isLosing = target < start;
  const totalChangeNeeded = Math.abs(start - target);
  
  let changeAchieved = 0;
  if (isLosing) {
    changeAchieved = start - current;
  } else {
    changeAchieved = current - start;
  }

  const percentage = Math.max(0, Math.min(150, Math.round((changeAchieved / totalChangeNeeded) * 100)));
  const remaining = Math.max(0, Math.abs(current - target));
  const delta = Number((current - start).toFixed(1));

  return {
    percentage,
    delta,
    remaining: Number(remaining.toFixed(1)),
    status: getProgressStatus(percentage),
    isLosing
  };
};

/**
 * Calculate progress for standard higher-is-better metrics (steps, water, sleep)
 */
export const calculateLinearProgress = (current, target) => {
  const c = parseFloat(current) || 0;
  const t = parseFloat(target) || 1;
  const percentage = Math.round((c / t) * 100);
  return {
    percentage,
    status: getProgressStatus(percentage),
    remaining: Math.max(0, Number((t - c).toFixed(1)))
  };
};

/**
 * Calculate average statistics over the given slice of records
 */
export const calculateAverages = (records) => {
  if (!records || records.length === 0) {
    return {
      avgWeight: 0,
      avgSteps: 0,
      avgWater: 0,
      avgSleep: 0,
      avgCalories: 0,
      count: 0
    };
  }

  const count = records.length;
  const totalWeight = records.reduce((sum, r) => sum + (parseFloat(r.weight) || 0), 0);
  const totalSteps = records.reduce((sum, r) => sum + (Number(r.steps) || 0), 0);
  const totalWater = records.reduce((sum, r) => sum + (parseFloat(r.waterIntake) || 0), 0);
  const totalSleep = records.reduce((sum, r) => sum + (parseFloat(r.sleepDuration) || 0), 0);
  const totalCalories = records.reduce((sum, r) => sum + (Number(r.calories) || 0), 0);

  return {
    avgWeight: Number((totalWeight / count).toFixed(1)),
    avgSteps: Math.round(totalSteps / count),
    avgWater: Number((totalWater / count).toFixed(1)),
    avgSleep: Number((totalSleep / count).toFixed(1)),
    avgCalories: Math.round(totalCalories / count),
    count
  };
};

/**
 * Calculate overall goal completion % across all key metrics
 */
export const calculateGoalCompletionRate = (todayRecord, goals, userProfile) => {
  if (!todayRecord || !goals) return 0;

  const stepProg = Math.min(100, ((todayRecord.steps || 0) / (goals.stepGoal || 10000)) * 100);
  const waterProg = Math.min(100, ((todayRecord.waterIntake || 0) / (goals.waterGoal || 2.5)) * 100);
  const sleepProg = Math.min(100, ((todayRecord.sleepDuration || 0) / (goals.sleepGoal || 8)) * 100);
  
  // Calorie adherence within +/- 15% counts as 100%
  const calDiff = Math.abs((todayRecord.calories || 2000) - (goals.calorieGoal || 2200));
  const calProg = Math.max(0, 100 - (calDiff / (goals.calorieGoal || 2200)) * 100);

  const weightProg = userProfile ? calculateWeightProgress(todayRecord.weight, goals.weightGoal, userProfile.startingWeight).percentage : 70;

  const total = (stepProg + waterProg + sleepProg + calProg + Math.min(100, weightProg)) / 5;
  return Math.round(total);
};

/**
 * Dynamic Achievement System
 */
export const evaluateAchievements = (records, goals, userProfile) => {
  if (!records || records.length === 0 || !goals) return [];

  // Sort ascending for consecutive streaks
  const sorted = [...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const latest = sorted[sorted.length - 1];

  // 1. Step goal achieved today
  const stepAchievedToday = latest && (latest.steps >= goals.stepGoal);

  // 2. Hydration goal achieved today
  const hydrationAchievedToday = latest && (latest.waterIntake >= goals.waterGoal);

  // 3. Sleep goal achieved (avg or latest)
  const sleepAchievedToday = latest && (latest.sleepDuration >= goals.sleepGoal);

  // 4. Weight goal milestone
  const startWeight = userProfile?.startingWeight || 72;
  const currentWeight = latest?.weight || startWeight;
  const weightProgress = calculateWeightProgress(currentWeight, goals.weightGoal, startWeight);
  const weightMilestone = weightProgress.percentage >= 50;

  // 5. Consecutive streaks
  let stepStreak = 0;
  let consistencyStreak = sorted.length;
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].steps >= goals.stepGoal) {
      stepStreak++;
    } else {
      break;
    }
  }

  // 6. 7-Day Consistency: at least 7 logged records
  const sevenDayLogged = sorted.length >= 7;

  return [
    {
      id: 'step_daily',
      title: 'Step Goal Achieved',
      category: 'Steps',
      icon: 'Trophy',
      description: `Surpassed daily target of ${Number(goals.stepGoal).toLocaleString()} steps.`,
      unlocked: stepAchievedToday,
      progress: Math.min(100, Math.round(((latest?.steps || 0) / goals.stepGoal) * 100)),
      badgeColor: 'amber'
    },
    {
      id: 'water_daily',
      title: 'Hydration Hero',
      category: 'Hydration',
      icon: 'Droplets',
      description: `Hit target of ${goals.waterGoal}L of daily water intake.`,
      unlocked: hydrationAchievedToday,
      progress: Math.min(100, Math.round(((latest?.waterIntake || 0) / goals.waterGoal) * 100)),
      badgeColor: 'sky'
    },
    {
      id: 'sleep_rest',
      title: 'Rest & Recovery',
      category: 'Sleep',
      icon: 'Moon',
      description: `Reached ${goals.sleepGoal} hours of rejuvenating sleep.`,
      unlocked: sleepAchievedToday,
      progress: Math.min(100, Math.round(((latest?.sleepDuration || 0) / goals.sleepGoal) * 100)),
      badgeColor: 'indigo'
    },
    {
      id: 'weight_milestone',
      title: 'Weight Milestone',
      category: 'Weight',
      icon: 'Scale',
      description: 'Achieved over 50% of your total target weight transformation.',
      unlocked: weightMilestone,
      progress: Math.min(100, weightProgress.percentage),
      badgeColor: 'emerald'
    },
    {
      id: 'streak_7day',
      title: '7-Day Consistency',
      category: 'Consistency',
      icon: 'Flame',
      description: 'Logged consecutive health records consistently for 7+ days.',
      unlocked: sevenDayLogged,
      progress: Math.min(100, Math.round((consistencyStreak / 7) * 100)),
      badgeColor: 'rose'
    },
    {
      id: 'step_streak_3day',
      title: 'Step Master Streak',
      category: 'Streaks',
      icon: 'Zap',
      description: 'Maintained step goal for 3 consecutive days in a row.',
      unlocked: stepStreak >= 3,
      progress: Math.min(100, Math.round((stepStreak / 3) * 100)),
      badgeColor: 'teal'
    }
  ];
};
