import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expense from './pages/Expense';
import Budget from './pages/Budget';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import LoadingSpinner from './components/common/LoadingSpinner';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isSignedIn, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!isSignedIn) return <Navigate to="/login" />;
  
  return children;
};

// Auth routes - redirect to dashboard if already signed in
const AuthRoute = ({ children }) => {
  const { isSignedIn, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (isSignedIn) return <Navigate to="/dashboard" />;
  
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <AuthRoute>
            <Register />
          </AuthRoute>
        } 
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="income" element={<Income />} />
        <Route path="expense" element={<Expense />} />
        <Route path="budget" element={<Budget />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10b981',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
            loading: {
              style: {
                background: '#3b82f6',
              },
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;