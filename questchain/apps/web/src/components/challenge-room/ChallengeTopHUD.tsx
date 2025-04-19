'use client';

import { useState, useEffect } from 'react';

interface ChallengeTopHUDProps {
  playerLevel: number;
  playerXP: number;
  timeRemaining: number;
}

export default function ChallengeTopHUD({ 
  playerLevel, 
  playerXP, 
  timeRemaining 
}: ChallengeTopHUDProps) {
  const [isTimerWarning, setIsTimerWarning] = useState(false);
  
  // Calculate XP progress (mock values for max XP per level)
  const maxXP = playerLevel * 200;
  const xpProgress = Math.min(100, (playerXP / maxXP) * 100);
  
  // Format time remaining
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Set timer warning when under 10 seconds
  useEffect(() => {
    setIsTimerWarning(timeRemaining <= 10);
  }, [timeRemaining]);
  
  return (
    <div className="h-12 bg-background/90 border-b-2 border-primary/30 flex items-center px-4">
      {/* Avatar Head */}
      <div className="w-8 h-8 bg-gray-700 rounded-full mr-4 flex items-center justify-center">
        <span className="font-pixel text-primary text-xs">👤</span>
      </div>
      
      {/* Level Indicator */}
      <div className="mr-4">
        <span className="font-pixel text-sm text-gray-300">Lv {playerLevel}</span>
      </div>
      
      {/* XP Bar */}
      <div className="flex-grow mr-4">
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${xpProgress}%` }}
          ></div>
        </div>
      </div>
      
      {/* Timer */}
      <div className={`font-pixel text-sm ${isTimerWarning ? 'text-red-500 animate-pulse' : 'text-gray-300'}`}>
        <span className="mr-1">✶</span>
        {formatTime(timeRemaining)}
      </div>
    </div>
  );
}
