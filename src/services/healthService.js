/**
 * Health Tracking API & Service Layer
 * MongoDB schema compatible:
 * { healthId, userId, weight, waterIntake, sleepDuration, steps, calories, bmi, date }
 */

import { apiRequest } from './apiClient';
import { storageService } from './storageService';
import { calculateBMI } from '../utils/bmiCalculator';

export const healthService = {
  /**
   * Fetch all health records for a user
   */
  async getHealthRecords(userId = 'usr_alex_01') {
    const res = await apiRequest(`/health?userId=${userId}`, { method: 'GET' });
    if (!res.fallbackNeeded && res.data) {
      return { success: true, data: res.data, isMock: false };
    }

    // Local Storage Mock Layer
    const records = storageService.getRecords();
    return { success: true, data: records, isMock: true };
  },

  /**
   * Create or update a health entry (POST /health)
   */
  async saveHealthRecord(record) {
    const heightCm = storageService.getUser()?.height || 170;
    const computedBMI = calculateBMI(record.weight, heightCm);

    const fullRecord = {
      healthId: record.healthId || `hlth_${Date.now()}`,
      userId: record.userId || 'usr_alex_01',
      date: record.date,
      weight: parseFloat(record.weight),
      waterIntake: parseFloat(record.waterIntake),
      sleepDuration: parseFloat(record.sleepDuration),
      steps: Number(record.steps),
      calories: Number(record.calories),
      bmi: computedBMI
    };

    const res = await apiRequest('/health', {
      method: 'POST',
      body: JSON.stringify(fullRecord)
    });

    if (!res.fallbackNeeded && res.data) {
      return { success: true, data: res.data, isMock: false };
    }

    // Update in local mock storage
    const current = storageService.getRecords();
    const existingIndex = current.findIndex(r => r.date === fullRecord.date || r.healthId === fullRecord.healthId);
    
    let updated;
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = { ...updated[existingIndex], ...fullRecord };
    } else {
      updated = [...current, fullRecord];
    }

    storageService.saveRecords(updated);

    // Also update current weight in user profile
    const user = storageService.getUser();
    if (user) {
      user.currentWeight = fullRecord.weight;
      storageService.saveUser(user);
    }

    return { success: true, data: fullRecord, isMock: true };
  },

  /**
   * Delete a record by ID
   */
  async deleteRecord(healthId) {
    const res = await apiRequest(`/health/${healthId}`, { method: 'DELETE' });
    if (!res.fallbackNeeded && res.success) {
      return { success: true, isMock: false };
    }

    const current = storageService.getRecords();
    const filtered = current.filter(r => r.healthId !== healthId);
    storageService.saveRecords(filtered);
    return { success: true, isMock: true };
  },

  /**
   * Quick update for specific metrics (weight, water, sleep)
   */
  async updateMetric(date, metricKey, value) {
    const records = storageService.getRecords();
    const record = records.find(r => r.date === date);
    if (!record) {
      throw new Error(`Record for date ${date} not found.`);
    }

    record[metricKey] = value;
    if (metricKey === 'weight') {
      const user = storageService.getUser();
      record.bmi = calculateBMI(value, user?.height || 170);
      if (user) {
        user.currentWeight = value;
        storageService.saveUser(user);
      }
    }

    storageService.saveRecords(records);
    return { success: true, data: record, isMock: true };
  }
};
