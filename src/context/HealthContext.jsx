import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { healthService } from '../services/healthService';
import { storageService } from '../services/storageService';
import { sortByDateDesc, getTodayString } from '../utils/dateUtils';
import { generateInitialRecords } from '../data/mockData';
import { useToast } from './ToastContext';
import { useGoals } from './GoalContext';

const HealthContext = createContext(null);

export const HealthProvider = ({ children }) => {
  // Initialize with persisted records or default mock records immediately to avoid null/empty render flashes
  const [healthRecords, setHealthRecords] = useState(() => {
    try {
      return sortByDateDesc(storageService.getRecords());
    } catch {
      return sortByDateDesc(generateInitialRecords());
    }
  });

  const [loading, setLoading] = useState(false);
  const [isMockMode, setIsMockMode] = useState(true);
  const { addToast } = useToast();
  const { reloadGoals } = useGoals();

  const loadHealthData = useCallback(async () => {
    try {
      const res = await healthService.getHealthRecords();
      if (res.success && res.data && res.data.length > 0) {
        setHealthRecords(sortByDateDesc(res.data));
        setIsMockMode(res.isMock);
      }
    } catch (err) {
      console.error('Failed to load health records:', err);
    }
  }, []);

  useEffect(() => {
    loadHealthData();
  }, [loadHealthData]);

  // Today's record or the most recent record available
  const todayRecord = useMemo(() => {
    if (!healthRecords || healthRecords.length === 0) return null;
    const todayStr = getTodayString();
    const todayMatch = healthRecords.find((r) => r.date === todayStr);
    return todayMatch || healthRecords[0];
  }, [healthRecords]);

  // Add or update health record
  const saveRecord = useCallback(async (recordData) => {
    try {
      const res = await healthService.saveHealthRecord(recordData);
      if (res.success) {
        await loadHealthData();
        await reloadGoals();
        addToast(
          'Health Data Saved',
          `Health entry for ${recordData.date} recorded successfully!`,
          'success'
        );
        return { success: true, data: res.data };
      }
      return { success: false, error: 'Failed to save health record' };
    } catch (err) {
      addToast('Save Failed', err.message || 'Error saving health data', 'error');
      return { success: false, error: err.message };
    }
  }, [loadHealthData, reloadGoals, addToast]);

  // Delete a health record
  const deleteRecord = useCallback(async (healthId) => {
    try {
      const res = await healthService.deleteRecord(healthId);
      if (res.success) {
        setHealthRecords((prev) => prev.filter((r) => r.healthId !== healthId));
        addToast('Record Deleted', 'Health log has been removed.', 'info');
        return { success: true };
      }
    } catch (err) {
      addToast('Delete Failed', err.message, 'error');
      return { success: false, error: err.message };
    }
  }, [addToast]);

  // Reset to original demo data
  const resetDemoData = useCallback(() => {
    const fresh = storageService.resetAll();
    setHealthRecords(sortByDateDesc(fresh.records));
    reloadGoals();
    addToast(
      'Demo Data Reset',
      'System restored to standard 14-day sample dataset.',
      'info'
    );
  }, [reloadGoals, addToast]);

  return (
    <HealthContext.Provider
      value={{
        healthRecords,
        todayRecord,
        loading,
        isMockMode,
        saveRecord,
        deleteRecord,
        resetDemoData,
        refreshHealthData: loadHealthData
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};
