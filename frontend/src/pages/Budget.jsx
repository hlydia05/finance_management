import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { PlusIcon, PencilIcon, TrashIcon, BellIcon } from '@heroicons/react/24/outline';
import Modal from '../components/common/Modal';
import BudgetForm from '../components/forms/BudgetForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/helpers';

const Budget = () => {
  const { user } = useAuth();
  const currency = user?.preferences?.currency || 'USD';
  const [budgets, setBudgets] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  useEffect(() => {
    fetchBudgets();
    fetchAlerts();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await api.get('/budget/all');
      setBudgets(response.data.data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      toast.error('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await api.get('/budget/alerts');
      setAlerts(response.data.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return;
    try {
      await api.delete(`/budget/delete/${id}`);
      toast.success('Budget deleted successfully');
      fetchBudgets();
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast.error('Failed to delete budget');
    }
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setEditingBudget(null);
    fetchBudgets();
    fetchAlerts();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
          <p className="text-gray-500">Set spending limits for each category</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Set Budget
        </button>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="card border-yellow-200 bg-yellow-50">
          <div className="flex items-center gap-2 text-yellow-800 mb-2">
            <BellIcon className="w-5 h-5" />
            <h3 className="font-semibold">Budget Alerts</h3>
          </div>
          <div className="space-y-1">
            {alerts.map((alert, index) => (
              <p key={index} className="text-sm text-yellow-700">
                {alert.message}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Budget List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.length === 0 ? (
          <div className="col-span-2 card text-center py-12 text-gray-500">
            No budgets set yet. Start by setting a budget for a category!
          </div>
        ) : (
          budgets.map((budget) => {
            const percentUsed = Math.min(budget.percentUsed, 100);
            const isExceeded = percentUsed >= 100;
            const isWarning = percentUsed >= 80 && percentUsed < 100;

            return (
              <div key={budget._id} className="card">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{budget.category}</h3>
                    <p className="text-sm text-gray-500">
                      {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingBudget(budget);
                        setIsModalOpen(true);
                      }}
                      className="text-gray-400 hover:text-primary-600 transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(budget._id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Spent</span>
                    <span className="font-medium">
                      {formatCurrency(budget.spent, currency)} / {formatCurrency(budget.amount, currency)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        isExceeded ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-primary-500'
                      }`}
                      style={{ width: `${percentUsed}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className={isExceeded ? 'text-red-600 font-medium' : isWarning ? 'text-yellow-600' : 'text-gray-500'}>
                    {isExceeded ? '⚠️ Exceeded' : isWarning ? '⚠️ Near limit' : `${Math.round(percentUsed)}% used`}
                  </span>
                  <span className="text-gray-500">
                    {formatCurrency(Math.max(budget.remaining, 0), currency)} remaining
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBudget(null);
        }}
        title={editingBudget ? 'Edit Budget' : 'Set Budget'}
      >
        <BudgetForm
          budget={editingBudget}
          onSuccess={handleSuccess}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingBudget(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default Budget;