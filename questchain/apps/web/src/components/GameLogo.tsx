'use client';

import React from 'react';

export const GameLogo: React.FC = () => {
  return (
    <div className="w-full max-w-md mb-8">
      <h1 className="font-pixel text-5xl md:text-6xl text-center text-primary drop-shadow-[0_2px_8px_rgba(255,215,0,0.6)] animate-pulse-slow">
        QUESTCHAIN
      </h1>
      <h2 className="font-pixel text-3xl md:text-4xl text-center text-white mt-2">
        ACADEMY
      </h2>
      <p className="text-center text-sm mt-2 text-gray-200">
        Own Your Skill, Level-Up for Real
      </p>
    </div>
  );
};

export default GameLogo;
