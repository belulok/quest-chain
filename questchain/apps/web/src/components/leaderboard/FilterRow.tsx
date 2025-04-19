'use client';

import { useState, useEffect } from 'react';
import { DateRange, Subject } from '@/app/leaderboard/page';

interface FilterRowProps {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  subject: Subject;
  setSubject: (subject: Subject) => void;
}

export default function FilterRow({
  dateRange,
  setDateRange,
  subject,
  setSubject
}: FilterRowProps) {
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        // Cycle through date ranges
        if (dateRange === 'today') {
          setDateRange('week');
        } else if (dateRange === 'week') {
          setDateRange('all-time');
        } else {
          setDateRange('today');
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dateRange, setDateRange]);
  
  return (
    <div className="h-12 bg-background/80 border-b border-primary/20 flex items-center justify-between px-4">
      {/* Date Range Pills */}
      <div className="flex space-x-2">
        <button
          className={`px-4 py-1 rounded-full text-sm transition-colors duration-200 ${
            dateRange === 'today' 
              ? 'bg-primary/20 text-primary border border-primary' 
              : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
          }`}
          onClick={() => setDateRange('today')}
        >
          Today
        </button>
        
        <button
          className={`px-4 py-1 rounded-full text-sm transition-colors duration-200 ${
            dateRange === 'week' 
              ? 'bg-primary/20 text-primary border border-primary' 
              : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
          }`}
          onClick={() => setDateRange('week')}
        >
          Week
        </button>
        
        <button
          className={`px-4 py-1 rounded-full text-sm transition-colors duration-200 ${
            dateRange === 'all-time' 
              ? 'bg-primary/20 text-primary border border-primary' 
              : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
          }`}
          onClick={() => setDateRange('all-time')}
        >
          All-time
        </button>
      </div>
      
      {/* Subject Selector Chips */}
      <div className="flex space-x-2">
        <button
          className={`px-3 py-1 rounded-full text-xs transition-colors duration-200 ${
            subject === 'all' 
              ? 'bg-primary/20 text-primary border border-primary' 
              : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
          }`}
          onClick={() => setSubject('all')}
        >
          All
        </button>
        
        <button
          className={`px-3 py-1 rounded-full text-xs transition-colors duration-200 ${
            subject === 'coding' 
              ? 'bg-blue-900/20 text-blue-400 border border-blue-700' 
              : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
          }`}
          onClick={() => setSubject('coding')}
        >
          <span className="mr-1">💻</span>
          Coding
        </button>
        
        <button
          className={`px-3 py-1 rounded-full text-xs transition-colors duration-200 ${
            subject === 'math' 
              ? 'bg-green-900/20 text-green-400 border border-green-700' 
              : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
          }`}
          onClick={() => setSubject('math')}
        >
          <span className="mr-1">🔢</span>
          Math
        </button>
        
        <button
          className={`px-3 py-1 rounded-full text-xs transition-colors duration-200 ${
            subject === 'logic' 
              ? 'bg-purple-900/20 text-purple-400 border border-purple-700' 
              : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
          }`}
          onClick={() => setSubject('logic')}
        >
          <span className="mr-1">🧩</span>
          Logic
        </button>
      </div>
    </div>
  );
}
