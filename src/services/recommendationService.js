/**
 * Recommendation Service Layer
 * Evaluates real application state and dynamically outputs
 * workout recommendations, goal-based advice, progress insights, and exercise suggestions.
 */

import { apiRequest } from './apiClient';
import { generateSmartRecommendations } from '../utils/recommendationEngine';

export const recommendationService = {
  async getRecommendations({ user, goals, healthRecords }) {
    // If backend is configured, attempt to fetch from backend
    const res = await apiRequest(`/recommendations?userId=${user?.userId}`, { method: 'GET' });
    if (!res.fallbackNeeded && res.data) {
      return { success: true, data: res.data, isMock: false };
    }

    // Process through frontend recommendation engine
    const recommendations = generateSmartRecommendations({ user, goals, healthRecords });
    return { success: true, data: recommendations, isMock: true };
  }
};
