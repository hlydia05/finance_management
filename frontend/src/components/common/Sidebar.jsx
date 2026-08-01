import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  BanknotesIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Income', href: '/income', icon: BanknotesIcon },
  { name: 'Expenses', href: '/expense', icon: ShoppingBagIcon },
  { name: 'Budgets', href: '/budget', icon: ChartBarIcon },
  { name: 'Profile', href: '/profile', icon: UserCircleIcon },
];

const Sidebar = () => {
  return (
    <aside className="w-16 lg:w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] sticky top-16 flex-shrink-0">
      <nav className="p-2 lg:p-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className="hidden lg:inline text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;