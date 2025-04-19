'use client';

import { useState, useEffect } from 'react';
import { XPEvent } from '@/app/leaderboard/page';

interface RealtimeTickerProps {
  events: XPEvent[];
}

export default function RealtimeTicker({ events }: RealtimeTickerProps) {
  // Format timestamp
  const formatTime = (timestamp: number): string => {
    const now = Date.now();
    const seconds = Math.floor((now - timestamp) / 1000);
    
    if (seconds < 60) {
      return `${seconds}s ago`;
    } else {
      const minutes = Math.floor(seconds / 60);
      return `${minutes}m ago`;
    }
  };
  
  // Format XP gain
  const formatXP = (xp: number): string => {
    if (xp >= 1000) {
      return `${(xp / 1000).toFixed(1)}k`;
    } else {
      return xp.toString();
    }
  };
  
  return (
    <div className="h-full p-3 overflow-hidden">
      <h3 className="font-pixel text-primary text-sm mb-3">LIVE FEED</h3>
      
      <div className="relative h-[calc(100%-2rem)] overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{ 
            backgroundImage: 'url("/assets/ticker_bg.png")',
            opacity: 0.1,
          }}
        ></div>
        
        <div className="space-y-3 max-h-full overflow-y-auto">
          {events.length === 0 ? (
            <p className="text-gray-500 text-xs">No activity yet</p>
          ) : (
            events.map((event, index) => (
              <div 
                key={event.id}
                className={`text-xs p-2 rounded-md bg-gray-800/50 border border-gray-700 ${
                  index === 0 ? 'animate-[typewriter_0.5s_steps(20,end)]' : ''
                } ${
                  index > 5 ? 'opacity-50' : ''
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-gray-300">{event.playerName}</span>
                  <span className="text-gray-500 text-xxs">{formatTime(event.timestamp)}</span>
                </div>
                
                <div className="flex items-center">
                  <span className={`mr-1 ${
                    event.eventType === 'quest' ? 'text-blue-400' : 'text-purple-400'
                  }`}>
                    {event.eventType === 'quest' ? '📝' : '👾'}
                  </span>
                  
                  <span className="text-gray-400">
                    {event.eventType === 'quest' 
                      ? `Completed ${event.subject || 'a'} quest` 
                      : 'Defeated a raid boss'}
                  </span>
                </div>
                
                <div className="mt-1 text-green-400 font-pixel">
                  +{formatXP(event.xpDelta)} XP
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
