/**
 * Comprehensive Exercise Catalog
 * Supports Workout Recommendations and Exercise Library Filtering
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
    instructions: 'Maintain an upright posture, swing arms naturally, and walk at a pace where speaking full sentences requires slight effort.'
  },
  {
    id: 'ex_running_intervals',
    name: 'Interval Jogging / Running',
    category: 'Cardio',
    difficulty: 'Intermediate',
    duration: '20-30 mins',
    targetMuscles: 'Calves, Quads, Hamstrings, Heart',
    caloriesBurnedEst: '250-320 kcal',
    reason: 'Elevates heart rate quickly and maximizes post-exercise oxygen consumption (EPOC).',
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
    instructions: 'Feet shoulder-width apart, keep chest proud, push hips back and knees in line with toes.'
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
    instructions: 'Hands slightly wider than shoulders, body in a straight plank, lower chest until elbows reach 90 degrees.'
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
    instructions: 'Rest on forearms directly below shoulders. Keep body straight from head to heels, squeezing glutes.'
  },
  {
    id: 'ex_walking_lunges',
    name: 'Walking Lunges',
    category: 'Strength',
    difficulty: 'Intermediate',
    duration: '3 sets of 10 reps/leg',
    targetMuscles: 'Glutes, Hamstrings, Quadriceps, Balance',
    caloriesBurnedEst: '90-130 kcal',
    reason: 'Unilateral leg training that corrects strength imbalances and enhances hip stability.',
    goalFit: ['weight_loss', 'muscle_gain', 'general_fitness'],
    instructions: 'Step forward with one leg, lower hips until both knees are bent at 90 degrees, push up and repeat.'
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
    instructions: 'Hold gentle static stretches for 20-30 seconds each without bouncing. Breathe deeply into tight areas.'
  },
  {
    id: 'ex_dumbbell_rows',
    name: 'Dumbbell / Resistance Rows',
    category: 'Strength',
    difficulty: 'Intermediate',
    duration: '3 sets of 10-12 reps',
    targetMuscles: 'Lats, Rhomboids, Biceps',
    caloriesBurnedEst: '80-110 kcal',
    reason: 'Balances chest pushing exercises, improves upper back posture and pulls shoulders back.',
    goalFit: ['muscle_gain', 'general_fitness'],
    instructions: 'Hinge at the hips with flat back, pull weights toward hip bone while engaging shoulder blades.'
  }
];
