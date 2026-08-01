import React, { useState, useEffect } from 'react';
import api from '../api/client';
import StatsCard from '../components/dashboard/StatsCard';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import SpendingChart from '../components/dashboard/SpendingChart';
import BudgetProgress from '../components/dashboard/BudgetProgress';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  BanknotesIcon, 
  WalletIcon 
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard');
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!dashboardData) return null;

  const { 
    monthlyIncome, 
    monthlyExpense, 
    savings, 
    savingsRate,
    expenseDistribution,
    recentTransactions 
  } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Overview of your financial health</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Income"
          value={monthlyIncome}
          icon={<ArrowUpIcon className="w-6 h-6 text-green-500" />}
          color="green"
        />
        <StatsCard
          title="Expenses"
          value={monthlyExpense}
          icon={<ArrowDownIcon className="w-6 h-6 text-red-500" />}
          color="red"
        />
        <StatsCard
          title="Savings"
          value={savings}
          icon={<WalletIcon className="w-6 h-6 text-blue-500" />}
          color="blue"
        />
        <StatsCard
          title="Savings Rate"
          value={savingsRate + '%'}
          icon={<BanknotesIcon className="w-6 h-6 text-purple-500" />}
          color="purple"
        />
      </div>

      {/* Charts and Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SpendingChart data={expenseDistribution} />
        </div>
        <div>
          <BudgetProgress />
        </div>
      </div>

      {/* Recent Transactions */}
      <RecentTransactions transactions={recentTransactions} />
    </div>
  );
};

export default Dashboard;