import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { PlusIcon, PencilIcon, TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import Modal from '../components/common/Modal';
import IncomeForm from '../components/forms/IncomeForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const response = await api.get('/income/all');
      setIncomes(response.data);
    } catch (error) {
      console.error('Error fetching incomes:', error);
      toast.error('Failed to load incomes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this income?')) return;
    try {
      await api.delete(`/income/delete/${id}`);
      toast.success('Income deleted successfully');
      fetchIncomes();
    } catch (error) {
      console.error('Error deleting income:', error);
      toast.error('Failed to delete income');
    }
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setEditingIncome(null);
    fetchIncomes();
  };

  const totalIncome = incomes.reduce((sum, i) => sum + Number(i.amount), 0);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Income</h1>
          <p className="text-gray-500">Track all your income sources</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.open('/api/income/downloadexcel', '_blank')}
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
            Add Income
          </button>
        </div>
      </div>

      {/* Total */}
      <div className="card bg-green-50 border-green-200">
        <p className="text-sm font-medium text-green-700">Total Income</p>
        <p className="text-3xl font-bold text-green-700">${totalIncome.toFixed(2)}</p>
      </div>

      {/* Income List */}
      <div className="card">
        {incomes.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No income entries yet</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {incomes.map((income) => (
              <div key={income._id} className="py-4 flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{income.description}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{income.category}</span>
                    <span>•</span>
                    <span>{new Date(income.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold text-green-600">
                    +${Number(income.amount).toFixed(2)}
                  </span>
                  <button
                    onClick={() => {
                      setEditingIncome(income);
                      setIsModalOpen(true);
                    }}
                    className="text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(income._id)}
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
          setEditingIncome(null);
        }}
        title={editingIncome ? 'Edit Income' : 'Add Income'}
      >
        <IncomeForm
          onSuccess={handleSuccess}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingIncome(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default Income;