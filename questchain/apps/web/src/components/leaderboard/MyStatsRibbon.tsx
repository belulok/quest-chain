'use client';

import { useState, useEffect } from 'react';

interface MyStatsRibbonProps {
  rank: number;
  rankChange: number;
  xp: number;
  level: number;
}

export default function MyStatsRibbon({
  rank,
  rankChange,
  xp,
  level
}: MyStatsRibbonProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  // Format XP number with spaces
  const formatXP = (xp: number): string => {
    return xp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };
  
  // Animate in on mount
  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 500);
  }, []);
  
  return (
    <div 
      className={`h-12 bg-background/80 backdrop-blur-sm border-t border-primary/30 flex items-center justify-center px-4 transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
      style={{ 
        backgroundImage: 'linear-gradient(to right, rgba(30, 41, 59, 0.8), rgba(30, 41, 59, 0.9), rgba(30, 41, 59, 0.8))',
      }}
    >
      <div className="flex items-center">
        <span className="font-pixel text-gray-300">You are #{rank}</span>
        
        {/* Rank Change */}
        {rankChange !== 0 && (
          <span className={`ml-2 ${
            rankChange > 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {rankChange > 0 ? '⬆︎' : '⬇︎'}
            {Math.abs(rankChange)}
          </span>
        )}
        
        <span className="mx-3 text-gray-600">•</span>
        
        <span className="font-pixel text-primary">XP {formatXP(xp)}</span>
        
        <span className="mx-3 text-gray-600">•</span>
        
        <div className="flex items-center">
          <span className="font-pixel text-gray-300 mr-2">Level {level}</span>
          
          {/* Mini Progress Bar */}
          <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary"
              style={{ width: `${(xp % 1000) / 10}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
