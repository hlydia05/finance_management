import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/helpers';

const colorMap = {
  green: 'bg-green-50 border-green-100',
  red: 'bg-red-50 border-red-100',
  blue: 'bg-blue-50 border-blue-100',
  purple: 'bg-purple-50 border-purple-100',
  teal: 'bg-teal-50 border-teal-100',
  amber: 'bg-amber-50 border-amber-100',
};

const StatsCard = ({ title, value, icon, color = 'blue' }) => {
  const { user } = useAuth();
  const currency = user?.preferences?.currency || 'USD';
  const formattedValue = typeof value === 'number' 
    ? formatCurrency(value, currency) 
    : value;

  return (
    <div className={`card ${colorMap[color]} border`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{formattedValue}</p>
        </div>
        <div className="p-3 bg-white rounded-full shadow-sm">{icon}</div>
      </div>
    </div>
  );
};

export default StatsCard;