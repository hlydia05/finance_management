import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { UserCircleIcon, ArrowRightOnRectangleIcon, Cog6ToothIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
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

  const displayName = clerkUser?.firstName || 
                     clerkUser?.emailAddresses?.[0]?.emailAddress || 
                     'User';

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

          {/* Right Section - User Info */}
          <div className="flex items-center space-x-4">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 hover:bg-gray-50 rounded-full pl-2 pr-3 py-1.5 transition-all duration-200 border border-transparent hover:border-gray-200"
              >
                {/* Avatar */}
                {clerkUser?.imageUrl ? (
                  <img
                    src={clerkUser.imageUrl}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-100"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center ring-2 ring-primary-100">
                    <span className="text-sm font-bold text-white">
                      {userInitial}
                    </span>
                  </div>
                )}
                
                {/* User Name and Dropdown Indicator */}
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-semibold text-gray-700 leading-tight">
                    {displayName}
                  </span>
                  <span className="text-xs text-gray-400 leading-tight">
                    {clerkUser?.emailAddresses?.[0]?.emailAddress ? 'Account' : 'Guest'}
                  </span>
                </div>
                
                <ChevronDownIcon 
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 overflow-hidden">
                  {/* User Info Section */}
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                      {clerkUser?.imageUrl ? (
                        <img
                          src={clerkUser.imageUrl}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                          <span className="text-base font-bold text-white">
                            {userInitial}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold text-gray-900">
                          {displayName}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-[160px]">
                          {clerkUser?.emailAddresses?.[0]?.emailAddress || 'No email'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Dropdown Items */}
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Cog6ToothIcon className="w-4 h-4" />
                      Profile Settings
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
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