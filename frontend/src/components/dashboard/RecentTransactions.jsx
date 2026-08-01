import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

const RecentTransactions = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
          No recent transactions
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-900 mb-4">Recent Transactions</h3>
      <div className="divide-y divide-gray-100">
        {transactions.map((transaction) => {
          const isIncome = transaction.type === 'income';
          const amountColor = isIncome ? 'text-green-600' : 'text-red-600';
          const amountPrefix = isIncome ? '+' : '-';

          return (
            <div
              key={transaction._id}
              className="py-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`p-2 rounded-full flex-shrink-0 ${
                    isIncome ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  {isIncome ? (
                    <ArrowUpIcon className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowDownIcon className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {transaction.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{transaction.category}</span>
                    <span>•</span>
                    <span>{new Date(transaction.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <span className={`text-sm font-semibold flex-shrink-0 ml-3 ${amountColor}`}>
                {amountPrefix}${Number(transaction.amount).toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentTransactions;
