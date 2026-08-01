import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { UserCircleIcon, ArrowRightOnRectangleIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useUser } from '@clerk/clerk-react';

const Header = () => {
  const { logout } = useAuth();
  const { user: clerkUser } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userInitial = clerkUser?.firstName?.charAt(0) || 
                       clerkUser?.emailAddresses?.[0]?.emailAddress?.charAt(0) || 
                       'U';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-600">💰</span>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              Finance Manager
            </span>
          </Link>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 hover:bg-gray-50 rounded-full px-3 py-1.5 transition-colors"
              >
                {clerkUser?.imageUrl ? (
                  <img
                    src={clerkUser.imageUrl}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-600">
                      {userInitial}
                    </span>
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {clerkUser?.firstName || clerkUser?.emailAddresses?.[0]?.emailAddress || 'User'}
                </span>
              </button>

              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {clerkUser?.firstName || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {clerkUser?.emailAddresses?.[0]?.emailAddress || ''}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Cog6ToothIcon className="w-4 h-4 mr-2" />
                    Profile Settings
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;