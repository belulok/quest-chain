'use client';

import React from 'react';

interface LoadingScreenProps {
  progress?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress = 0 }) => {
  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center">
      <h1 className="font-pixel text-4xl text-primary mb-8 animate-pulse">
        QUESTCHAIN ACADEMY
      </h1>
      
      <div className="w-64 h-4 bg-gray-700 rounded-full overflow-hidden border border-gray-600 mb-4">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <p className="font-pixel text-white">
        {progress < 100 ? 'Loading...' : 'Ready!'}
      </p>
    </div>
  );
};

export default LoadingScreen;
