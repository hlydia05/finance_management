import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  BanknotesIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '@clerk/clerk-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Income', href: '/income', icon: BanknotesIcon },
  { name: 'Expenses', href: '/expense', icon: ShoppingBagIcon },
  { name: 'Budgets', href: '/budget', icon: ChartBarIcon },
  { name: 'Profile', href: '/profile', icon: UserCircleIcon },
];

const Sidebar = () => {
  const { logout } = useAuth();
  const { user: clerkUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = clerkUser?.firstName || 
                     clerkUser?.emailAddresses?.[0]?.emailAddress || 
                     'User';

  return (
    <aside className="fixed left-0 top-16 z-30 w-16 lg:w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 flex flex-col">
      {/* Navigation - takes remaining space */}
      <nav className="flex-1 p-2 lg:p-4 space-y-1 overflow-y-auto">
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

      {/* User Info & Logout Section -固定在底部 */}
      <div className="border-t border-gray-200 p-2 lg:p-4 bg-gray-50/50">
        {/* User Info (visible on large screens) */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-2 mb-2 rounded-lg bg-white shadow-sm border border-gray-100">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-white">
              {clerkUser?.firstName?.charAt(0) || 
               clerkUser?.emailAddresses?.[0]?.emailAddress?.charAt(0) || 
               'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {displayName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {clerkUser?.emailAddresses?.[0]?.emailAddress || 'No email'}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 group"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
          <span className="hidden lg:inline text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;