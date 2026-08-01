import React, { useState } from 'react';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { INCOME_CATEGORIES } from '../../utils/constants';

const IncomeForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: INCOME_CATEGORIES[0],
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/income/add', {
        ...formData,
        amount: parseFloat(formData.amount),
      });
      toast.success('Income added successfully!');
      onSuccess();
    } catch (error) {
      console.error('Error adding income:', error);
      toast.error('Failed to add income');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="input-field"
          placeholder="e.g., Salary, Freelance payment"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amount ($) *
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
          Category *
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="input-field"
        >
          {INCOME_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date *
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="input-field"
        />
      </div>

      <div className="flex space-x-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex-1 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Income'}
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

export default IncomeForm;