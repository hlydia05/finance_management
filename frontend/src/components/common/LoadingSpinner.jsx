import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-primary-200 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-primary-600 rounded-full border-t-transparent animate-spin" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;