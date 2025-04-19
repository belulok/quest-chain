'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface QuestBoardHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function QuestBoardHeader({ searchQuery, setSearchQuery }: QuestBoardHeaderProps) {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Focus search input when search icon is clicked
  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchActive]);
  
  // Handle search input with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Clear any existing timeout
    const timeoutId = setTimeout(() => {
      setSearchQuery(value);
    }, 200); // 200ms debounce
    
    return () => clearTimeout(timeoutId);
  };
  
  return (
    <div className="h-16 bg-background/90 border-b-2 border-primary/30 flex items-center justify-between px-4">
      {/* Left side - Title with back button on mobile */}
      <div className="flex items-center">
        <Link 
          href="/world-map"
          className="mr-4 font-pixel text-primary hidden md:block"
        >
          ← BACK
        </Link>
        
        <h1 className="font-pixel text-2xl md:text-3xl text-primary">QUEST BOARD</h1>
      </div>
      
      {/* Right side - Search */}
      <div className="relative">
        {isSearchActive ? (
          <div className="flex items-center bg-gray-800 rounded-md overflow-hidden">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search quests..."
              className="bg-transparent border-none outline-none px-3 py-2 text-white w-48"
              defaultValue={searchQuery}
              onChange={handleSearchChange}
              onBlur={() => {
                if (!searchQuery) {
                  setIsSearchActive(false);
                }
              }}
            />
            <button 
              className="px-3 py-2 text-gray-400 hover:text-white"
              onClick={() => {
                setSearchQuery('');
                setIsSearchActive(false);
              }}
            >
              ✕
            </button>
          </div>
        ) : (
          <button 
            className="text-gray-400 hover:text-white p-2"
            onClick={() => setIsSearchActive(true)}
            aria-label="Search quests"
          >
            🔍
          </button>
        )}
      </div>
    </div>
  );
}
