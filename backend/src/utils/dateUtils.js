/**
 * Backend Date Utilities
 */

export const getTodayString = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

export const getNDaysAgoString = (n) => {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date.toISOString().split('T')[0];
};

export const isValidDateString = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const parsed = new Date(dateStr);
  return !isNaN(parsed.getTime());
};