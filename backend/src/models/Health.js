import mongoose from 'mongoose';

const healthSchema = new mongoose.Schema(
  {
    healthId: {
      type: String,
      default: () => `hlth_${Date.now()}`
    },
    userId: {
      type: String,
      required: true,
      index: true,
      default: 'usr_alex_01'
    },
    date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
      index: true
    },
    weight: {
      type: Number,
      required: [true, 'Weight in kilograms is required.'],
      min: [20, 'Weight must be at least 20 kg.'],
      max: [350, 'Weight cannot exceed 350 kg.']
    },
    height: {
      type: Number,
      min: [100, 'Height must be at least 100 cm.'],
      max: [250, 'Height cannot exceed 250 cm.'],
      default: 170
    },
    waterIntake: {
      type: Number,
      required: [true, 'Water intake in litres is required.'],
      min: [0, 'Water intake cannot be negative.'],
      max: [15, 'Water intake cannot exceed 15 litres.']
    },
    sleepDuration: {
      type: Number,
      required: [true, 'Sleep duration in hours is required.'],
      min: [0, 'Sleep duration cannot be negative.'],
      max: [24, 'Sleep duration cannot exceed 24 hours.']
    },
    steps: {
      type: Number,
      required: [true, 'Step count is required.'],
      min: [0, 'Steps cannot be negative.'],
      max: [100000, 'Steps cannot exceed 100,000 in a day.']
    },
    calories: {
      type: Number,
      required: [true, 'Calories consumed is required.'],
      min: [500, 'Daily calories must be at least 500 kcal.'],
      max: [10000, 'Daily calories cannot exceed 10,000 kcal.']
    },
    bmi: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index on userId + date for fast lookups and unique daily record per user
healthSchema.index({ userId: 1, date: 1 }, { unique: true });

healthSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    return ret;
  }
});

export const Health = mongoose.model('Health', healthSchema);