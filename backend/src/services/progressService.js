/**
 * Progress Calculation & Achievement Service
 */

export const getProgressStatus = (percentage) => {
  const p = Math.round(percentage);
  if (p < 10) {
    return { status: 'Not Started', message: 'Get started today!' };
  } else if (p < 75) {
    return { status: 'In Progress', message: 'Making steady progress' };
  } else if (p < 100) {
    return { status: 'Almost Achieved', message: 'Almost there! Push a little more' };
  } else if (p <= 110) {
    return { status: 'Achieved', message: 'Goal achieved! Excellent work' };
  } else {
    return { status: 'Exceeded', message: 'Outstanding! Goal exceeded' };
  }
};

export const calculateWeightProgress = (currentWeight, targetWeight, startingWeight) => {
  const current = parseFloat(currentWeight);
  const target = parseFloat(targetWeight);
  const start = parseFloat(startingWeight);

  if (!current || !target || !start || start === target) {
    return { percentage: 0, delta: 0, remaining: 0, status: getProgressStatus(0), isLosing: false };
  }

  const isLosing = target < start;
  const totalChangeNeeded = Math.abs(start - target);

  let changeAchieved = isLosing ? start - current : current - start;
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

export const evaluateAchievements = (records, goals, user) => {
  if (!records || records.length === 0 || !goals) return [];

  const sorted = [...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const latest = sorted[sorted.length - 1];

  const stepAchievedToday = latest ? latest.steps >= goals.stepGoal : false;
  const hydrationAchievedToday = latest ? latest.waterIntake >= goals.waterGoal : false;
  const sleepAchievedToday = latest ? latest.sleepDuration >= goals.sleepGoal : false;

  const startWeight = user?.startingWeight || 72.0;
  const currentWeight = latest?.weight || startWeight;
  const weightProgress = calculateWeightProgress(currentWeight, goals.weightGoal, startWeight);
  const weightMilestone = weightProgress.percentage >= 50;

  // Streak calculations
  let stepStreak = 0;
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].steps >= goals.stepGoal) {
      stepStreak++;
    } else {
      break;
    }
  }

  const sevenDayLogged = sorted.length >= 7;

  return [
    {
      id: 'step_daily',
      title: 'Step Goal Achieved',
      category: 'Steps',
      icon: 'Trophy',
      description: `Surpassed daily target of ${Number(goals.stepGoal).toLocaleString()} steps.`,
      unlocked: stepAchievedToday,
      progress: Math.min(100, Math.round(((latest?.steps || 0) / goals.stepGoal) * 100))
    },
    {
      id: 'water_daily',
      title: 'Hydration Hero',
      category: 'Hydration',
      icon: 'Droplets',
      description: `Hit target of ${goals.waterGoal}L of daily water intake.`,
      unlocked: hydrationAchievedToday,
      progress: Math.min(100, Math.round(((latest?.waterIntake || 0) / goals.waterGoal) * 100))
    },
    {
      id: 'sleep_rest',
      title: 'Rest & Recovery',
      category: 'Sleep',
      icon: 'Moon',
      description: `Reached ${goals.sleepGoal} hours of rejuvenating sleep.`,
      unlocked: sleepAchievedToday,
      progress: Math.min(100, Math.round(((latest?.sleepDuration || 0) / goals.sleepGoal) * 100))
    },
    {
      id: 'weight_milestone',
      title: 'Weight Milestone',
      category: 'Weight',
      icon: 'Scale',
      description: 'Achieved over 50% of your total target weight transformation.',
      unlocked: weightMilestone,
      progress: Math.min(100, weightProgress.percentage)
    },
    {
      id: 'streak_7day',
      title: '7-Day Consistency',
      category: 'Consistency',
      icon: 'Flame',
      description: 'Logged consecutive health records consistently for 7+ days.',
      unlocked: sevenDayLogged,
      progress: Math.min(100, Math.round((sorted.length / 7) * 100))
    },
    {
      id: 'step_streak_3day',
      title: 'Step Master Streak',
      category: 'Streaks',
      icon: 'Zap',
      description: 'Maintained step goal for 3 consecutive days in a row.',
      unlocked: stepStreak >= 3,
      progress: Math.min(100, Math.round((stepStreak / 3) * 100))
    }
  ];
};

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

export const getFullProgressSummary = (user, goals, records) => {
  const sorted = [...(records || [])].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const latest = sorted[sorted.length - 1] || {};

  const currentWeight = latest.weight || user?.currentWeight || 68.4;
  const startWeight = user?.startingWeight || 72.0;
  const weightProg = calculateWeightProgress(currentWeight, goals.weightGoal, startWeight);

  const currentSteps = latest.steps || 0;
  const stepProg = calculateLinearProgress(currentSteps, goals.stepGoal);

  const currentWater = latest.waterIntake || 0;
  const waterProg = calculateLinearProgress(currentWater, goals.waterGoal);

  const currentSleep = latest.sleepDuration || 0;
  const sleepProg = calculateLinearProgress(currentSleep, goals.sleepGoal);

  const currentCalories = latest.calories || 0;
  const calProg = calculateLinearProgress(currentCalories, goals.calorieGoal);

  const overall = Math.round(
    (Math.min(100, weightProg.percentage) +
     Math.min(100, stepProg.percentage) +
     Math.min(100, waterProg.percentage) +
     Math.min(100, sleepProg.percentage) +
     Math.min(100, calProg.percentage)) / 5
  );

  const achievements = evaluateAchievements(records, goals, user);

  return {
    weight: { ...weightProg, current: currentWeight, target: goals.weightGoal },
    steps: { ...stepProg, current: currentSteps, target: goals.stepGoal },
    water: { ...waterProg, current: currentWater, target: goals.waterGoal },
    sleep: { ...sleepProg, current: currentSleep, target: goals.sleepGoal },
    calories: { ...calProg, current: currentCalories, target: goals.calorieGoal },
    overall,
    achievements
  };
};