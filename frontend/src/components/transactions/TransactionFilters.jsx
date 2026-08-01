import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../utils/constants';

const TransactionFilters = ({ filter, setFilter }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const allCategories = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="flex-1 relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          name="search"
          value={filter.search}
          onChange={handleChange}
          placeholder="Search transactions..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm"
        />
      </div>

      {/* Category Filter */}
      <select
        name="category"
        value={filter.category}
        onChange={handleChange}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm bg-white"
      >
        <option value="all">All Categories</option>
        {allCategories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {/* Sort By */}
      <select
        name="sortBy"
        value={filter.sortBy}
        onChange={handleChange}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm bg-white"
      >
        <option value="date">Sort by Date</option>
        <option value="amount">Sort by Amount</option>
        <option value="description">Sort by Description</option>
      </select>

      {/* Sort Order */}
      <select
        name="sortOrder"
        value={filter.sortOrder}
        onChange={handleChange}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm bg-white"
      >
        <option value="desc">Newest First</option>
        <option value="asc">Oldest First</option>
      </select>
    </div>
  );
};

export default TransactionFilters;