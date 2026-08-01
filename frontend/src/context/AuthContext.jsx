import React, { createContext, useState, useContext, useEffect } from 'react';
import { useClerk, useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';
import api from '../api/client';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const { getToken } = useClerkAuth();
  const { signOut } = useClerk();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Get token from Clerk and sync with our backend
  useEffect(() => {
    const syncUserWithBackend = async () => {
      if (!isLoaded) return;

      if (isSignedIn && clerkUser) {
        try {
          // Get Clerk session token
          const sessionToken = await getToken();
          if (sessionToken) {
            localStorage.setItem('token', sessionToken);
            setToken(sessionToken);
            
            // Get user from our backend (this creates user if doesn't exist)
            const response = await api.get('/user/me', {
              headers: { Authorization: `Bearer ${sessionToken}` }
            });
            setUser(response.data.user);
          }
        } catch (error) {
          console.error('Error syncing user with backend:', error);
          toast.error('Failed to load user data');
        }
      } else {
        // User is signed out
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
      setLoading(false);
    };

    syncUserWithBackend();
  }, [isLoaded, isSignedIn, clerkUser, getToken]);

  const logout = async () => {
    try {
      await signOut();
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const value = {
    user,
    loading,
    logout,
    token,
    isSignedIn,
    isLoaded,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};