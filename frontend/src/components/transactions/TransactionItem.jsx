import React from 'react';
import { PencilIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

const TransactionItem = ({ transaction, onEdit, onDelete }) => {
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? 'text-green-600' : 'text-red-600';
  const amountPrefix = isIncome ? '+' : '-';

  return (
    <div className="py-4 px-4 sm:px-6 flex items-center justify-between hover:bg-gray-50 transition-colors group">
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className={`p-2 rounded-full flex-shrink-0 ${
          isIncome ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {isIncome ? (
            <ArrowUpIcon className="w-4 h-4 text-green-600" />
          ) : (
            <ArrowDownIcon className="w-4 h-4 text-red-600" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 truncate">
            {transaction.description}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{transaction.category}</span>
            <span>•</span>
            <span>{new Date(transaction.date).toLocaleDateString()}</span>
            {transaction.createdAt && (
              <>
                <span>•</span>
                <span className="text-gray-400">
                  Added {new Date(transaction.createdAt).toLocaleDateString()}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 ml-4 flex-shrink-0">
        <span className={`text-base font-semibold ${amountColor}`}>
          {amountPrefix}${Number(transaction.amount).toFixed(2)}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(transaction)}
            className="p-1.5 rounded-full hover:bg-gray-200 transition-colors text-gray-400 hover:text-primary-600"
            aria-label="Edit transaction"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(transaction._id)}
            className="p-1.5 rounded-full hover:bg-gray-200 transition-colors text-gray-400 hover:text-red-600"
            aria-label="Delete transaction"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;