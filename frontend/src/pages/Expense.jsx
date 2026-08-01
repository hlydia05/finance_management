import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { PlusIcon, PencilIcon, TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import Modal from '../components/common/Modal';
import ExpenseForm from '../components/forms/ExpenseForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/helpers';

const Expense = () => {
  const { user } = useAuth();
  const currency = user?.preferences?.currency || 'USD';
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await api.get('/expense/all');
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      await api.delete(`/expense/delete/${id}`);
      toast.success('Expense deleted successfully');
      fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
    }
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
    fetchExpenses();
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/expense/downloadexcel', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `expense_details_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting expenses:', error);
      toast.error('Failed to export expense data');
    }
  };

  const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-500">Track all your spending</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Add Expense
          </button>
        </div>
      </div>

      {/* Total */}
      <div className="card bg-red-50 border-red-200">
        <p className="text-sm font-medium text-red-700">Total Expenses</p>
        <p className="text-3xl font-bold text-red-700">{formatCurrency(totalExpense, currency)}</p>
      </div>

      {/* Expense List */}
      <div className="card">
        {expenses.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No expense entries yet</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {expenses.map((expense) => (
              <div key={expense._id} className="py-4 flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{expense.description}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{expense.category}</span>
                    <span>•</span>
                    <span>{new Date(expense.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold text-red-600">
                    -{formatCurrency(expense.amount, currency)}
                  </span>
                  <button
                    onClick={() => {
                      setEditingExpense(expense);
                      setIsModalOpen(true);
                    }}
                    className="text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(expense._id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingExpense(null);
        }}
        title={editingExpense ? 'Edit Expense' : 'Add Expense'}
      >
        <ExpenseForm
          onSuccess={handleSuccess}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingExpense(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default Expense;