import React, { useState } from 'react';
import TransactionItem from './TransactionItem';
import TransactionFilters from './TransactionFilters';

const TransactionList = ({ 
  transactions, 
  onEdit, 
  onDelete, 
  type = 'all' 
}) => {
  const [filter, setFilter] = useState({
    search: '',
    category: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
  });

  const filteredTransactions = transactions
    .filter((t) => {
      // Filter by type (income/expense)
      if (type !== 'all' && t.type !== type) return false;
      
      // Filter by search
      if (filter.search && !t.description.toLowerCase().includes(filter.search.toLowerCase())) {
        return false;
      }
      
      // Filter by category
      if (filter.category !== 'all' && t.category !== filter.category) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      const aVal = a[filter.sortBy];
      const bVal = b[filter.sortBy];
      const order = filter.sortOrder === 'asc' ? 1 : -1;
      
      if (filter.sortBy === 'amount') {
        return (Number(aVal) - Number(bVal)) * order;
      }
      if (filter.sortBy === 'date') {
        return (new Date(aVal) - new Date(bVal)) * order;
      }
      return String(aVal).localeCompare(String(bVal)) * order;
    });

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No transactions yet</p>
        <p className="text-sm">Start adding your income and expenses!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TransactionFilters filter={filter} setFilter={setFilter} />
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {filteredTransactions.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              No transactions match your filters
            </p>
          ) : (
            filteredTransactions.map((transaction) => (
              <TransactionItem
                key={transaction._id}
                transaction={transaction}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </div>
      
      <div className="text-sm text-gray-500 text-center">
        Showing {filteredTransactions.length} of {transactions.length} transactions
      </div>
    </div>
  );
};

export default TransactionList;