/**
 * LocalStorage Persistence Service
 * Ensures user modifications persist across browser sessions while providing
 * a one-click Reset to Default Demo Data for evaluations.
 */

import { generateInitialRecords, initialGoals, initialUserProfile } from '../data/mockData';

const STORAGE_KEYS = {
  RECORDS: 'fitpulse_health_records_v1',
  GOALS: 'fitpulse_goals_v1',
  USER: 'fitpulse_user_v1'
};

export const storageService = {
  getRecords() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RECORDS);
      if (!data) {
        const initial = generateInitialRecords();
        localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(data);
    } catch (e) {
      console.warn('LocalStorage error reading records, falling back to mock data:', e);
      return generateInitialRecords();
    }
  },

  saveRecords(records) {
    try {
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
    } catch (e) {
      console.warn('LocalStorage error saving records:', e);
    }
  },

  getGoals() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GOALS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(initialGoals));
        return initialGoals;
      }
      return JSON.parse(data);
    } catch (e) {
      console.warn('LocalStorage error reading goals, falling back to mock data:', e);
      return initialGoals;
    }
  },

  saveGoals(goals) {
    try {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    } catch (e) {
      console.warn('LocalStorage error saving goals:', e);
    }
  },

  getUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(initialUserProfile));
        return initialUserProfile;
      }
      return JSON.parse(data);
    } catch (e) {
      console.warn('LocalStorage error reading user, falling back to mock data:', e);
      return initialUserProfile;
    }
  },

  saveUser(user) {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.warn('LocalStorage error saving user:', e);
    }
  },

  resetAll() {
    try {
      const defaultRecords = generateInitialRecords();
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(defaultRecords));
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(initialGoals));
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(initialUserProfile));
      return {
        records: defaultRecords,
        goals: initialGoals,
        user: initialUserProfile
      };
    } catch (e) {
      console.warn('LocalStorage reset error:', e);
      return {
        records: generateInitialRecords(),
        goals: initialGoals,
        user: initialUserProfile
      };
    }
  }
};
