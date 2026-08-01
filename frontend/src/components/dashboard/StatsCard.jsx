import React from 'react';

const colorMap = {
  green: 'bg-green-50 border-green-100',
  red: 'bg-red-50 border-red-100',
  blue: 'bg-blue-50 border-blue-100',
  purple: 'bg-purple-50 border-purple-100',
};

const StatsCard = ({ title, value, icon, color = 'blue' }) => {
  const formattedValue = typeof value === 'number' 
    ? `$${value.toFixed(2)}` 
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