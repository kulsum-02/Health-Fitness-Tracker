/**
 * Goal Management API & Service Layer
 * MongoDB schema compatible:
 * { goalId, userId, stepGoal, calorieGoal, weightGoal, waterGoal, sleepGoal, goalType, currentProgress, achievementStatus }
 */

import { apiRequest } from './apiClient';
import { storageService } from './storageService';

export const goalService = {
  /**
   * Fetch goals for a user
   */
  async getGoals(userId = 'usr_alex_01') {
    const res = await apiRequest(`/goals?userId=${userId}`, { method: 'GET' });
    if (!res.fallbackNeeded && res.data) {
      return { success: true, data: res.data, isMock: false };
    }

    const goals = storageService.getGoals();
    return { success: true, data: goals, isMock: true };
  },

  /**
   * Update goals (PUT /goals)
   */
  async updateGoals(goalsData) {
    const res = await apiRequest('/goals', {
      method: 'PUT',
      body: JSON.stringify(goalsData)
    });

    if (!res.fallbackNeeded && res.data) {
      return { success: true, data: res.data, isMock: false };
    }

    // Persist to local mock storage
    const current = storageService.getGoals();
    const updated = {
      ...current,
      ...goalsData,
      stepGoal: Number(goalsData.stepGoal),
      calorieGoal: Number(goalsData.calorieGoal),
      weightGoal: parseFloat(goalsData.weightGoal),
      waterGoal: parseFloat(goalsData.waterGoal || current.waterGoal || 2.5),
      sleepGoal: parseFloat(goalsData.sleepGoal || current.sleepGoal || 8.0)
    };

    storageService.saveGoals(updated);

    // Also update target weight in user profile
    const user = storageService.getUser();
    if (user && goalsData.weightGoal) {
      user.targetWeight = parseFloat(goalsData.weightGoal);
      if (goalsData.goalType) {
        user.goalType = goalsData.goalType;
      }
      storageService.saveUser(user);
    }

    return { success: true, data: updated, isMock: true };
  },

  /**
   * Fetch user profile
   */
  async getUserProfile(userId = 'usr_alex_01') {
    const res = await apiRequest(`/goals/user/profile?userId=${userId}`, { method: 'GET' });
    if (!res.fallbackNeeded && res.data) {
      return { success: true, data: res.data, isMock: false };
    }

    const user = storageService.getUser();
    return { success: true, data: user, isMock: true };
  },

  /**
   * Update user profile (height, target, etc)
   */
  async updateUserProfile(userData) {
    const res = await apiRequest('/goals/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
    if (!res.fallbackNeeded && res.data) {
      return { success: true, data: res.data, isMock: false };
    }

    const current = storageService.getUser();
    const updated = { ...current, ...userData };
    storageService.saveUser(updated);
    return { success: true, data: updated, isMock: true };
  }
};
