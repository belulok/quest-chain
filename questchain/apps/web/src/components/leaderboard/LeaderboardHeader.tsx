'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface LeaderboardHeaderProps {
  onSearch: (query: string) => void;
}

export default function LeaderboardHeader({ onSearch }: LeaderboardHeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  
  // Focus search input when search icon is clicked
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);
  
  // Handle search input with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchQuery);
    }, 200); // 200ms debounce
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery, onSearch]);
  
  // Handle click outside user dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="h-16 bg-background/90 border-b-2 border-primary/30 flex items-center justify-between px-4">
      {/* Left side - Title with back button */}
      <div className="flex items-center">
        <Link 
          href="/world-map"
          className="mr-4 font-pixel text-primary hidden md:block"
        >
          ← BACK
        </Link>
        
        <h1 className="font-pixel text-2xl md:text-3xl text-primary flex items-center">
          <span className="mr-2">🏆</span>
          LEADERBOARD
        </h1>
      </div>
      
      {/* Right side - Search and User */}
      <div className="flex items-center">
        {/* Search */}
        <div className="relative mr-4">
          {showSearch ? (
            <div className="flex items-center bg-gray-800 rounded-md overflow-hidden">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search players..."
                className="bg-transparent border-none outline-none px-3 py-2 text-white w-48"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => {
                  if (!searchQuery) {
                    setShowSearch(false);
                  }
                }}
              />
              <button 
                className="px-3 py-2 text-gray-400 hover:text-white"
                onClick={() => {
                  setSearchQuery('');
                  setShowSearch(false);
                }}
              >
                ✕
              </button>
            </div>
          ) : (
            <button 
              className="text-gray-400 hover:text-white p-2"
              onClick={() => setShowSearch(true)}
              aria-label="Search players"
            >
              🔍
            </button>
          )}
        </div>
        
        {/* User Avatar Dropdown */}
        <div className="relative" ref={userDropdownRef}>
          <button 
            className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors duration-200"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
          >
            <span className="text-sm">👤</span>
          </button>
          
          {/* Dropdown Menu */}
          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-background border border-primary/30 rounded-md shadow-lg z-10 animate-[fadeIn_0.2s_ease-out]">
              <div className="py-1">
                <Link 
                  href="/"
                  className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  Home
                </Link>
                <Link 
                  href="/settings"
                  className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  Settings
                </Link>
                <button 
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
                  onClick={() => alert('Logout clicked')}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
