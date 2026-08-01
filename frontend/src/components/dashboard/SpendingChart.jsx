import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/helpers';

const COLORS = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#6b7280'];

const SpendingChart = ({ data }) => {
  const { user } = useAuth();
  const currency = user?.preferences?.currency || 'USD';

  if (!data || data.length === 0) {
    return (
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">Spending Distribution</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No spending data available
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, entry) => sum + Number(entry.amount || 0), 0);

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-900 mb-4">Spending Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ amount }) =>
                `${total > 0 ? Math.round((Number(amount) / total) * 100) : 0}%`
              }
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${entry.category ?? index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatCurrency(value, currency)}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendingChart;