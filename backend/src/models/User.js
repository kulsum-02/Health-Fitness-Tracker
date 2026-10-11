import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      default: 'usr_alex_01'
    },
    name: {
      type: String,
      required: true,
      trim: true,
      default: 'Alex Morgan'
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      default: 'alex.morgan@fitpulse.io'
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
    },
    height: {
      type: Number,
      required: true,
      min: 100,
      max: 250,
      default: 170
    },
    startingWeight: {
      type: Number,
      required: true,
      min: 20,
      max: 350,
      default: 72.0
    },
    currentWeight: {
      type: Number,
      required: true,
      min: 20,
      max: 350,
      default: 68.4
    },
    targetWeight: {
      type: Number,
      required: true,
      min: 20,
      max: 350,
      default: 65.0
    },
    gender: {
      type: String,
      enum: ['female', 'male', 'other', 'prefer_not_to_say'],
      default: 'female'
    },
    age: {
      type: Number,
      min: 10,
      max: 120,
      default: 28
    },
    goalType: {
      type: String,
      enum: ['weight_loss', 'muscle_gain', 'weight_gain', 'general_fitness', 'endurance'],
      default: 'weight_loss'
    }
  },
  {
    timestamps: true
  }
);

export const User = mongoose.model('User', userSchema);