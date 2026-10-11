/**
 * Date Utility Functions for Health & Fitness Management
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

export const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  
  const isToday = today.toISOString().split('T')[0] === dateStr;
  const isYesterday = yesterday.toISOString().split('T')[0] === dateStr;

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export const formatFullDate = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatChartDate = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

export const sortByDateAsc = (records) => {
  return [...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const sortByDateDesc = (records) => {
  return [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
