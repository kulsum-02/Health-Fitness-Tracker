import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema(
  {
    goalId: {
      type: String,
      default: () => `goal_${Date.now()}`
    },
    userId: {
      type: String,
      required: true,
      index: true,
      default: 'usr_alex_01'
    },
    stepGoal: {
      type: Number,
      required: true,
      min: 1000,
      max: 50000,
      default: 10000
    },
    calorieGoal: {
      type: Number,
      required: true,
      min: 1000,
      max: 6000,
      default: 2200
    },
    weightGoal: {
      type: Number,
      required: true,
      min: 20,
      max: 350,
      default: 65.0
    },
    waterGoal: {
      type: Number,
      min: 1.0,
      max: 10.0,
      default: 2.5
    },
    sleepGoal: {
      type: Number,
      min: 4.0,
      max: 14.0,
      default: 8.0
    },
    workoutDaysGoal: {
      type: Number,
      min: 1,
      max: 7,
      default: 5
    },
    activeMinutesGoal: {
      type: Number,
      min: 10,
      max: 180,
      default: 45
    },
    goalType: {
      type: String,
      enum: ['weight_loss', 'muscle_gain', 'weight_gain', 'general_fitness', 'endurance'],
      default: 'weight_loss'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    targetDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// User-friendly toJSON transform
goalSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    return ret;
  }
});

export const Goal = mongoose.model('Goal', goalSchema);