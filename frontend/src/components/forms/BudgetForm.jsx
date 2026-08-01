import React, { useState } from 'react';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { EXPENSE_CATEGORIES } from '../../utils/constants';

const BudgetForm = ({ budget, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    category: budget?.category || EXPENSE_CATEGORIES[0],
    amount: budget?.amount || '',
    period: budget?.period || 'monthly',
    alertThreshold: budget?.alertThreshold || 80,
    alertsEnabled: budget?.alertsEnabled !== undefined ? budget.alertsEnabled : true,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = budget ? `/budget/update/${budget._id}` : '/budget/set';
      const method = budget ? 'put' : 'post';
      
      await api[method](url, {
        ...formData,
        amount: parseFloat(formData.amount),
        alertThreshold: parseInt(formData.alertThreshold),
      });
      
      toast.success(budget ? 'Budget updated successfully!' : 'Budget set successfully!');
      onSuccess();
    } catch (error) {
      console.error('Error saving budget:', error);
      toast.error('Failed to save budget');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category *
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="input-field"
        >
          {EXPENSE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Budget Amount ($) *
        </label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
          min="0.01"
          step="0.01"
          className="input-field"
          placeholder="0.00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Period
        </label>
        <select
          name="period"
          value={formData.period}
          onChange={handleChange}
          className="input-field"
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Alert Threshold (%)
        </label>
        <input
          type="number"
          name="alertThreshold"
          value={formData.alertThreshold}
          onChange={handleChange}
          min="0"
          max="100"
          className="input-field"
        />
        <p className="text-xs text-gray-500 mt-1">
          You'll be notified when spending reaches this percentage of your budget
        </p>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="alertsEnabled"
          checked={formData.alertsEnabled}
          onChange={handleChange}
          className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
        />
        <label className="ml-2 text-sm text-gray-700">
          Enable alerts for this budget
        </label>
      </div>

      <div className="flex space-x-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex-1 disabled:opacity-50"
        >
          {loading ? 'Saving...' : budget ? 'Update Budget' : 'Set Budget'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default BudgetForm;