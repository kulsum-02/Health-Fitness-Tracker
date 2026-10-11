/**
 * Centralized API Client Layer
 * Handles communication with Node.js/Express.js backend when VITE_API_URL is configured,
 * or routes seamlessly to local mock services with standard async response formatting.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const isLiveBackendAvailable = () => {
  return Boolean(API_BASE_URL && API_BASE_URL.trim().length > 0);
};

export const apiRequest = async (endpoint, options = {}) => {
  if (!isLiveBackendAvailable()) {
    // Backend URL not configured -> Local Mock Mode
    return { isMock: true, fallbackNeeded: true };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const payload = (result && typeof result === 'object' && result.data !== undefined)
      ? result.data
      : result;

    return { isMock: false, data: payload, raw: result, success: result.success ?? true };
  } catch (error) {
    console.warn(`[FitPulse API] Live backend unreachable at ${API_BASE_URL}${endpoint}. Utilizing fallback mock service.`, error.message);
    return { isMock: true, fallbackNeeded: true, error: error.message };
  }
};
