/**
 * Intelligent Rule-Based Recommendation Engine
 */

export const exerciseCatalog = [
  {
    id: 'ex_brisk_walk',
    name: 'Brisk Walking',
    category: 'Cardio',
    difficulty: 'Beginner',
    duration: '25-35 mins',
    targetMuscles: 'Legs, Cardiovascular System',
    caloriesBurnedEst: '140-180 kcal',
    reason: 'Gentle on joints, excellent for base metabolic rate and daily step deficits.',
    goalFit: ['weight_loss', 'general_fitness'],
    instructions: 'Maintain an upright posture, swing arms naturally, and walk at a moderate steady pace.'
  },
  {
    id: 'ex_running_intervals',
    name: 'Interval Jogging / Running',
    category: 'Cardio',
    difficulty: 'Intermediate',
    duration: '20-30 mins',
    targetMuscles: 'Calves, Quads, Hamstrings, Heart',
    caloriesBurnedEst: '250-320 kcal',
    reason: 'Elevates heart rate quickly and maximizes post-exercise oxygen consumption.',
    goalFit: ['weight_loss', 'endurance'],
    instructions: 'Alternate between 2 minutes of moderate jogging and 1 minute of brisk walking for 8-10 cycles.'
  },
  {
    id: 'ex_outdoor_cycling',
    name: 'Outdoor / Stationary Cycling',
    category: 'Cardio',
    difficulty: 'Beginner',
    duration: '30-45 mins',
    targetMuscles: 'Quadriceps, Glutes, Calves',
    caloriesBurnedEst: '220-300 kcal',
    reason: 'Low impact cardio that protects knees while sustaining steady calorie expenditure.',
    goalFit: ['weight_loss', 'endurance', 'general_fitness'],
    instructions: 'Keep cadence between 70-90 RPM with moderate resistance.'
  },
  {
    id: 'ex_bodyweight_squats',
    name: 'Air / Bodyweight Squats',
    category: 'Strength',
    difficulty: 'Beginner',
    duration: '3 sets of 12-15 reps',
    targetMuscles: 'Glutes, Quads, Core',
    caloriesBurnedEst: '80-120 kcal',
    reason: 'Builds functional lower-body strength and stimulates major muscle groups for calorie burn.',
    goalFit: ['weight_loss', 'muscle_gain', 'general_fitness'],
    instructions: 'Feet shoulder-width apart, push hips back and knees in line with toes.'
  },
  {
    id: 'ex_pushups',
    name: 'Standard / Knee Push-ups',
    category: 'Strength',
    difficulty: 'Intermediate',
    duration: '3 sets of 8-12 reps',
    targetMuscles: 'Chest, Triceps, Anterior Deltoids, Core',
    caloriesBurnedEst: '70-100 kcal',
    reason: 'Foundational compound movement for upper-body pushing power and core bracing.',
    goalFit: ['muscle_gain', 'general_fitness', 'weight_loss'],
    instructions: 'Hands slightly wider than shoulders, body in a straight plank, lower chest to 90 degrees.'
  },
  {
    id: 'ex_forearm_plank',
    name: 'Forearm Core Plank',
    category: 'Core',
    difficulty: 'Beginner',
    duration: '3 sets of 30-45 secs',
    targetMuscles: 'Transverse Abdominis, Glutes, Shoulders',
    caloriesBurnedEst: '40-60 kcal',
    reason: 'Improves spinal stabilization, posture, and deep core endurance without spinal flexion.',
    goalFit: ['general_fitness', 'muscle_gain', 'weight_loss'],
    instructions: 'Rest on forearms directly below shoulders. Keep body straight from head to heels.'
  },
  {
    id: 'ex_fullbody_stretching',
    name: 'Full-Body Mobility & Stretching',
    category: 'Mobility',
    difficulty: 'Beginner',
    duration: '15-20 mins',
    targetMuscles: 'Hamstrings, Hip Flexors, Thoracic Spine',
    caloriesBurnedEst: '40-60 kcal',
    reason: 'Promotes muscle recovery, reduces muscle stiffness, and aids sleep quality.',
    goalFit: ['general_fitness', 'endurance', 'weight_loss', 'muscle_gain'],
    instructions: 'Hold gentle static stretches for 20-30 seconds each without bouncing. Breathe deeply.'
  }
];

export const generateRecommendations = ({ user, goals, healthRecords, categoryFilter = null }) => {
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

  const sorted = [...(healthRecords || [])].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const latest = sorted[sorted.length - 1] || {};
  const recent7 = sorted.slice(-7);

  const avgSteps = recent7.length ? Math.round(recent7.reduce((s, r) => s + (r.steps || 0), 0) / recent7.length) : (latest.steps || 0);
  const avgSleep = recent7.length ? Number((recent7.reduce((s, r) => s + (r.sleepDuration || 0), 0) / recent7.length).toFixed(1)) : (latest.sleepDuration || 8);

  const currentWeight = latest.weight || user?.currentWeight || 68.4;
  const startWeight = user?.startingWeight || 72.0;
  const goalType = goals?.goalType || user?.goalType || 'weight_loss';

  // 1. Workout Recommendations
  const stepRatio = (latest.steps || 0) / safeStepGoal;
  if (stepRatio < 0.7) {
    recommendations.workoutRecommendations.push({
      id: 'rec_walk_deficit',
      title: 'Quick Activity Boost: 20-30 Min Brisk Walk',
      category: 'Activity',
      priority: 'high',
      icon: 'Footprints',
      badge: 'Immediate Action',
      description: `You are currently at ${Number(latest.steps || 0).toLocaleString()} steps (${Math.round(stepRatio * 100)}% of your ${safeStepGoal.toLocaleString()} goal). A quick 25-minute brisk walk will bridge your daily deficit.`,
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

  if (avgSleep < 7.0) {
    recommendations.workoutRecommendations.push({
      id: 'rec_mobility_recovery',
      title: 'Active Recovery & Stretching Session',
      category: 'Recovery',
      priority: 'high',
      icon: 'Smile',
      badge: 'Restoration',
      description: `Your 7-day average sleep is ${avgSleep} hrs. Opt for low-intensity restorative mobility and dynamic stretching to reduce cortisol and speed up recovery.`,
      actionText: 'Start 15m Stretch'
    });
  }

  // 2. Goal-Based Recommendations
  if (goalType === 'weight_loss') {
    recommendations.goalRecommendations.push({
      id: 'goal_deficit_guidance',
      title: 'Sustainable Caloric Deficit & NEAT',
      category: 'Nutrition & Energy',
      focus: 'Fat Loss & Muscle Retention',
      icon: 'Flame',
      badge: 'Weight Loss Focus',
      advice: `Aim for a modest 300–400 kcal deficit. Pair cardio with resistance exercises to protect resting metabolic rate while shedding body fat.`,
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

  // 3. Progress Insights
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
  }

  // 4. Filtered Exercise Catalog
  recommendations.exerciseSuggestions = exerciseCatalog.filter(ex => {
    if (goalType === 'weight_loss') return ex.goalFit.includes('weight_loss');
    if (goalType === 'muscle_gain') return ex.goalFit.includes('muscle_gain');
    return ex.goalFit.includes('general_fitness');
  });

  return recommendations;
};