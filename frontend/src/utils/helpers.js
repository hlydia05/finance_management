/**
 * Format currency amount
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format date to readable string
 */
export const formatDate = (date, format = 'short') => {
  const d = new Date(date);
  if (format === 'short') {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  if (format === 'long') {
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }
  if (format === 'relative') {
    const now = new Date();
    const diff = now - d;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  return d.toLocaleDateString();
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Get color for category
 */
export const getCategoryColor = (category) => {
  const colors = {
    'Housing': '#0ea5e9',
    'Food & Groceries': '#10b981',
    'Transportation': '#8b5cf6',
    'Shopping': '#ec4899',
    'Entertainment': '#f59e0b',
    'Healthcare': '#ef4444',
    'Education': '#06b6d4',
    'Insurance': '#6366f1',
    'Bills & Utilities': '#14b8a6',
    'Dining Out': '#f97316',
    'Salary': '#22c55e',
    'Freelance': '#8b5cf6',
    'Investment': '#0ea5e9',
    'Business': '#06b6d4',
    'Rental': '#f59e0b',
    'Gift': '#ec4899',
    'Bonus': '#10b981',
    'Other': '#6b7280',
  };
  return colors[category] || '#6b7280';
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Group array by key
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Sum array of numbers
 */
export const sumArray = (array) => {
  return array.reduce((sum, num) => sum + Number(num), 0);
};

/**
 * Debounce function for search inputs
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};