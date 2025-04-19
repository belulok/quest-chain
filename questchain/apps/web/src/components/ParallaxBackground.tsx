'use client';

import React from 'react';

export const ParallaxBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Sky background */}
      <div className="absolute inset-0 bg-blue-500" style={{ zIndex: -30 }}></div>
      
      {/* Clouds - Layer 0 (slow moving) */}
      <div className="absolute inset-0" style={{ zIndex: -20 }}>
        {/* Cloud 1 */}
        <div className="absolute w-32 h-16 bg-white rounded-full left-1/4 top-1/5 opacity-80 animate-[float_20s_ease-in-out_infinite]"></div>
        
        {/* Cloud 2 */}
        <div className="absolute w-48 h-20 bg-white rounded-full left-2/3 top-1/6 opacity-80 animate-[float_25s_ease-in-out_infinite_1s]"></div>
        
        {/* Cloud 3 */}
        <div className="absolute w-40 h-16 bg-white rounded-full left-1/6 top-1/3 opacity-80 animate-[float_22s_ease-in-out_infinite_0.5s]"></div>
      </div>
      
      {/* Floating Island - Layer 1 */}
      <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 animate-[float_10s_ease-in-out_infinite]" style={{ zIndex: -10 }}>
        {/* Island base */}
        <div className="w-64 h-32 bg-green-700 rounded-t-full"></div>
        
        {/* Island dirt */}
        <div className="w-64 h-16 bg-brown-600 -mt-2"></div>
        
        {/* Trees */}
        <div className="absolute w-8 h-16 bg-green-800 rounded-full left-8 -top-16"></div>
        <div className="absolute w-12 h-24 bg-green-800 rounded-full left-40 -top-24"></div>
      </div>
    </div>
  );
};

export default ParallaxBackground;
