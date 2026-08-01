import React, { useState, useEffect } from 'react';
import api from '../api/client';
import StatsCard from '../components/dashboard/StatsCard';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import SpendingChart from '../components/dashboard/SpendingChart';
import TrendsChart from '../components/dashboard/TrendsChart';
import BudgetProgress from '../components/dashboard/BudgetProgress';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  BanknotesIcon, 
  WalletIcon,
  ArrowTrendingUpIcon,
  ChartPieIcon,
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [overviewRes, summaryRes] = await Promise.all([
        api.get('/dashboard'),
        api.get('/dashboard/summary'),
      ]);
      setDashboardData(overviewRes.data.data);
      setSummaryData(summaryRes.data.data);
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

  const { netSavings, savingsRate: overallSavingsRate } = summaryData || {};

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Overview of your financial health</p>
      </div>

      {/* Stats Cards - this month */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
          This Month
        </h2>
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
      </div>

      {/* Stats Cards - all time */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
          All Time
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatsCard
            title="Total Savings"
            value={netSavings ?? 0}
            icon={<ArrowTrendingUpIcon className="w-6 h-6 text-teal-500" />}
            color="teal"
          />
          <StatsCard
            title="Overall Savings Rate"
            value={(overallSavingsRate ?? 0) + '%'}
            icon={<ChartPieIcon className="w-6 h-6 text-amber-500" />}
            color="amber"
          />
        </div>
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

      {/* Trends */}
      <TrendsChart />

      {/* Recent Transactions */}
      <RecentTransactions transactions={recentTransactions} />
    </div>
  );
};

export default Dashboard;