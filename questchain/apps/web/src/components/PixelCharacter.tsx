'use client';

import React from 'react';

export const PixelCharacter: React.FC = () => {
  return (
    <div className="w-32 h-48 relative">
      {/* Character body - blue hooded cloak */}
      <div className="absolute w-24 h-32 bg-blue-800 rounded-t-full left-4 top-8"></div>
      
      {/* Hood shadow */}
      <div className="absolute w-20 h-16 bg-blue-900 rounded-t-full left-6 top-8"></div>
      
      {/* Face */}
      <div className="absolute w-16 h-12 bg-amber-200 rounded-full left-8 top-12"></div>
      
      {/* Eyes */}
      <div className="absolute w-2 h-2 bg-black rounded-full left-12 top-16"></div>
      <div className="absolute w-2 h-2 bg-black rounded-full left-18 top-16"></div>
      
      {/* Mouth */}
      <div className="absolute w-4 h-1 bg-red-500 left-14 top-20"></div>
      
      {/* Cloak bottom */}
      <div className="absolute w-24 h-8 bg-blue-800 left-4 top-32"></div>
      
      {/* Legs */}
      <div className="absolute w-6 h-8 bg-gray-700 left-10 top-40"></div>
      <div className="absolute w-6 h-8 bg-gray-700 left-16 top-40"></div>
      
      {/* Feet */}
      <div className="absolute w-8 h-3 bg-brown-600 left-9 top-48"></div>
      <div className="absolute w-8 h-3 bg-brown-600 left-15 top-48"></div>
    </div>
  );
};

export default PixelCharacter;
