'use client';

import React from 'react';

interface LoadingScreenProps {
  progress?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress = 0 }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        backgroundImage: 'url(/assets/QuestChain%20Assets/loading_bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Logo */}
      <div className="mb-12">
        <img
          src="/assets/QuestChain%20Assets/logo.png"
          alt="QuestChain Logo"
          className="w-80 h-auto"
        />
      </div>

      {/* Progress Bar with pixelated border */}
      <div className="relative w-80 h-5 mb-4">
        {/* Border */}
        <div className="absolute inset-0 border-2 border-white"></div>

        {/* Background */}
        <div className="absolute inset-0 bg-gray-900 m-0.5"></div>

        {/* Progress */}
        <div
          className="absolute inset-y-0 left-0 m-0.5 bg-yellow-400 transition-all duration-300 ease-out"
          style={{ width: `calc(${progress}% - 4px)` }}
        />
      </div>

      {/* Loading Text */}
      <p className="font-pixel text-white" style={{ textShadow: '1px 1px 0px #000' }}>
        {progress < 100 ? 'Loading...' : 'Ready!'}
      </p>
    </div>
  );
};

export default LoadingScreen;
