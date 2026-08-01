import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/helpers';

const BudgetProgress = () => {
  const { user } = useAuth();
  const currency = user?.preferences?.currency || 'USD';
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await api.get('/budget/all');
      setBudgets(response.data.data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      toast.error('Failed to load budget data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="card h-48 animate-pulse" />;

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900">Budget Progress</h3>
        <Link to="/budget" className="text-sm text-primary-600 hover:text-primary-700">
          Manage
        </Link>
      </div>
      {budgets.length === 0 ? (
        <p className="text-gray-500 text-center py-8 text-sm">
          No budgets set. Start tracking your spending limits!
        </p>
      ) : (
        <div className="space-y-4">
          {budgets.slice(0, 3).map((budget) => {
            const percentUsed = Math.min(budget.percentUsed, 100);
            const isExceeded = percentUsed >= 100;
            const isWarning = percentUsed >= 80 && percentUsed < 100;

            return (
              <div key={budget._id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{budget.category}</span>
                  <span className="text-gray-600">
                    {formatCurrency(budget.spent, currency)} / {formatCurrency(budget.amount, currency)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      isExceeded ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-primary-500'
                    }`}
                    style={{ width: `${percentUsed}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-0.5">
                  <span className={isExceeded ? 'text-red-600' : isWarning ? 'text-yellow-600' : 'text-gray-500'}>
                    {isExceeded ? '⚠️ Exceeded' : isWarning ? '⚠️ Near limit' : `${Math.round(percentUsed)}% used`}
                  </span>
                  <span className="text-gray-500">
                    {formatCurrency(Math.max(budget.remaining, 0), currency)} remaining
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BudgetProgress;