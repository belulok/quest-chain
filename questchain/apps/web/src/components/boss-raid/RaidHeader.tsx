'use client';

import { useState, useEffect } from 'react';

interface RaidHeaderProps {
  bossName: string;
  bossHP: number;
  maxBossHP: number;
  playersOnline: number;
  latency: number;
}

export default function RaidHeader({
  bossName,
  bossHP,
  maxBossHP,
  playersOnline,
  latency
}: RaidHeaderProps) {
  const [displayHP, setDisplayHP] = useState(bossHP);
  
  // Smooth HP bar animation
  useEffect(() => {
    // If the difference is small, update immediately
    if (Math.abs(displayHP - bossHP) < 10) {
      setDisplayHP(bossHP);
      return;
    }
    
    // Otherwise, animate the change
    const interval = setInterval(() => {
      setDisplayHP(prev => {
        if (prev === bossHP) {
          clearInterval(interval);
          return prev;
        }
        
        const step = Math.ceil(Math.abs(prev - bossHP) / 10);
        return prev > bossHP ? prev - step : prev + step;
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [bossHP]);
  
  // Format HP numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };
  
  // Calculate HP bar segments (10 segments)
  const getHPSegments = () => {
    const segments = [];
    const segmentSize = maxBossHP / 10;
    
    for (let i = 0; i < 10; i++) {
      const threshold = segmentSize * (i + 1);
      const isFilled = displayHP >= threshold;
      const isPartial = !isFilled && displayHP > threshold - segmentSize;
      const partialWidth = isPartial ? ((displayHP % segmentSize) / segmentSize) * 100 : 0;
      
      segments.push({ isFilled, isPartial, partialWidth });
    }
    
    return segments;
  };
  
  const hpSegments = getHPSegments();
  
  return (
    <div className="h-16 bg-background/90 border-b-2 border-primary/30 flex flex-col justify-center px-4">
      <div className="flex justify-between items-center mb-2">
        {/* Boss Name */}
        <div className="font-pixel text-xl text-primary">
          {bossName}
        </div>
        
        {/* HP Text */}
        <div className="font-pixel text-sm text-gray-300">
          {formatNumber(displayHP)} / {formatNumber(maxBossHP)}
        </div>
      </div>
      
      {/* HP Bar */}
      <div className="flex w-full h-3 bg-gray-800 rounded-full overflow-hidden">
        {hpSegments.map((segment, index) => (
          <div key={index} className="w-1/10 h-full relative">
            {segment.isFilled ? (
              <div className="absolute inset-0 bg-red-600 border-r border-gray-800"></div>
            ) : segment.isPartial ? (
              <div 
                className="absolute inset-0 bg-red-600 border-r border-gray-800" 
                style={{ width: `${segment.partialWidth}%` }}
              ></div>
            ) : null}
          </div>
        ))}
      </div>
      
      {/* Player Info */}
      <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
        <div>
          Party: {playersOnline} players online
        </div>
        <div>
          Latency: {latency} s
        </div>
      </div>
    </div>
  );
}
