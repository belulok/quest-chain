'use client';

import React from 'react';
import Link from 'next/link';

export const NavigationIcons: React.FC = () => {
  return (
    <div className="flex justify-between w-full max-w-md mb-8">
      {/* Quest Board */}
      <div className="text-center">
        <div className="bg-amber-800 p-3 rounded-md inline-block mb-2 transform rotate-3 border-2 border-amber-950">
          <Link href="/quest-board">
            <span className="font-pixel text-white text-sm md:text-base">QUEST BOARD</span>
          </Link>
        </div>
      </div>
      
      {/* World Map */}
      <div className="text-center">
        <div className="bg-slate-700 p-3 rounded-md inline-block mb-2 transform -rotate-2 border-2 border-slate-900">
          <Link href="/world-map">
            <span className="font-pixel text-white text-sm md:text-base">WORLD MAP</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavigationIcons;
