import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already signed in
  React.useEffect(() => {
    if (isSignedIn) {
      navigate('/dashboard');
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">💰</div>
          <h2 className="text-3xl font-bold text-gray-900">Finance Manager</h2>
          <p className="mt-2 text-gray-600">Track your finances effortlessly</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <SignIn 
            routing="hash"
            signUpUrl="/register"
            afterSignInUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none w-full",
                headerTitle: "text-2xl font-bold text-gray-900",
                headerSubtitle: "text-gray-600",
                formButtonPrimary: "btn-primary w-full",
                formFieldInput: "input-field",
                footerActionLink: "text-primary-600 hover:text-primary-700 font-medium",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;