import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { goalService } from '../services/goalService';
import { calculateWeightProgress, calculateLinearProgress, getProgressStatus } from '../utils/progressCalculators';
import { initialGoals, initialUserProfile } from '../data/mockData';
import { useToast } from './ToastContext';

const GoalContext = createContext(null);

export const GoalProvider = ({ children }) => {
  const [goals, setGoals] = useState(initialGoals);
  const [userProfile, setUserProfile] = useState(initialUserProfile);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const loadData = useCallback(async () => {
    try {
      const [goalsRes, userRes] = await Promise.all([
        goalService.getGoals(),
        goalService.getUserProfile()
      ]);

      if (goalsRes.success && goalsRes.data) setGoals(goalsRes.data);
      if (userRes.success && userRes.data) setUserProfile(userRes.data);
    } catch (err) {
      console.error('Error loading goal and user context:', err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateGoals = useCallback(async (newGoals) => {
    try {
      const res = await goalService.updateGoals(newGoals);
      if (res.success) {
        setGoals(res.data);
        if (res.data.weightGoal && userProfile) {
          setUserProfile(prev => ({
            ...prev,
            targetWeight: res.data.weightGoal,
            goalType: res.data.goalType || prev?.goalType || 'weight_loss'
          }));
        }
        addToast('Goals Updated', 'Your fitness and health goals have been updated successfully!', 'success');
        return { success: true };
      }
      return { success: false, error: 'Failed to update goals' };
    } catch (err) {
      addToast('Update Failed', err.message || 'Could not update goals', 'error');
      return { success: false, error: err.message };
    }
  }, [userProfile, addToast]);

  const updateUserProfile = useCallback(async (userData) => {
    try {
      const res = await goalService.updateUserProfile(userData);
      if (res.success) {
        setUserProfile(res.data);
        addToast('Profile Updated', 'User profile parameters updated.', 'success');
        return { success: true };
      }
    } catch (err) {
      addToast('Update Failed', err.message, 'error');
      return { success: false, error: err.message };
    }
  }, [addToast]);

  // Compute goal progress summary given latest health metrics
  const getProgressSnapshot = useCallback((todayRecord) => {
    const activeGoals = goals || initialGoals;
    const activeUser = userProfile || initialUserProfile;

    const currentWeight = todayRecord?.weight || activeUser.currentWeight || 68.4;
    const weightProg = calculateWeightProgress(currentWeight, activeGoals.weightGoal || 65, activeUser.startingWeight || 72);

    const currentSteps = todayRecord?.steps || 7842;
    const stepProg = calculateLinearProgress(currentSteps, activeGoals.stepGoal || 10000);

    const currentWater = todayRecord?.waterIntake || 1.8;
    const waterProg = calculateLinearProgress(currentWater, activeGoals.waterGoal || 2.5);

    const currentSleep = todayRecord?.sleepDuration || 7.1;
    const sleepProg = calculateLinearProgress(currentSleep, activeGoals.sleepGoal || 8.0);

    const currentCalories = todayRecord?.calories || 1950;
    const calProg = calculateLinearProgress(currentCalories, activeGoals.calorieGoal || 2200);

    const overall = Math.round(
      (Math.min(100, weightProg.percentage) +
       Math.min(100, stepProg.percentage) +
       Math.min(100, waterProg.percentage) +
       Math.min(100, sleepProg.percentage) +
       Math.min(100, calProg.percentage)) / 5
    );

    return {
      weight: { ...weightProg, current: currentWeight, target: activeGoals.weightGoal || 65, remaining: weightProg.remaining ?? 3.4 },
      steps: { ...stepProg, current: currentSteps, target: activeGoals.stepGoal || 10000, remaining: stepProg.remaining ?? 2158 },
      water: { ...waterProg, current: currentWater, target: activeGoals.waterGoal || 2.5, remaining: waterProg.remaining ?? 0.7 },
      sleep: { ...sleepProg, current: currentSleep, target: activeGoals.sleepGoal || 8.0, remaining: sleepProg.remaining ?? 0.9 },
      calories: { ...calProg, current: currentCalories, target: activeGoals.calorieGoal || 2200, remaining: calProg.remaining ?? 250 },
      overall
    };
  }, [goals, userProfile]);

  return (
    <GoalContext.Provider
      value={{
        goals,
        userProfile,
        loading,
        updateGoals,
        updateUserProfile,
        getProgressSnapshot,
        reloadGoals: loadData
      }}
    >
      {children}
    </GoalContext.Provider>
  );
};

export const useGoals = () => {
  const context = useContext(GoalContext);
  if (!context) {
    throw new Error('useGoals must be used within a GoalProvider');
  }
  return context;
};
