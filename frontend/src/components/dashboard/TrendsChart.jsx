import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/helpers';

const TrendsChart = () => {
  const { user } = useAuth();
  const currency = user?.preferences?.currency || 'USD';
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await api.get('/dashboard/trends', { params: { months: 6 } });
        setTrends(response.data.data || []);
      } catch (error) {
        console.error('Error fetching trends:', error);
        toast.error('Failed to load monthly trends');
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  if (loading) return <div className="card h-80 animate-pulse" />;

  if (!trends || trends.length === 0) {
    return (
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">Income vs Expenses (Last 6 Months)</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No trend data available yet
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-900 mb-4">Income vs Expenses (Last 6 Months)</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={trends} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => formatCurrency(v, currency)} />
            <Tooltip formatter={(value) => formatCurrency(value, currency)} />
            <Legend />
            <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Line
              type="monotone"
              dataKey="savings"
              name="Savings"
              stroke="#0ea5e9"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendsChart;