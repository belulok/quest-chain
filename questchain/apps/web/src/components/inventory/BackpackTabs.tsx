'use client';

import { useState, useEffect } from 'react';
import { TabType } from './InventoryPane';

interface BackpackTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function BackpackTabs({ 
  activeTab, 
  setActiveTab,
  searchQuery,
  setSearchQuery
}: BackpackTabsProps) {
  const [showSearch, setShowSearch] = useState(false);
  
  // Handle tab click
  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
  };
  
  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Toggle search
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
    }
  };
  
  return (
    <div className="px-4 py-3 border-t border-b border-primary/30">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-pixel text-primary text-sm">BACKPACK</h3>
        
        <button 
          className="text-gray-400 hover:text-white"
          onClick={toggleSearch}
          aria-label={showSearch ? "Close search" : "Search items"}
        >
          {showSearch ? '✕' : '🔍'}
        </button>
      </div>
      
      {/* Search Bar (conditional) */}
      {showSearch && (
        <div className="mb-3">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search items..."
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1 text-white text-sm focus:outline-none focus:border-primary"
          />
        </div>
      )}
      
      {/* Tabs */}
      <div className="flex space-x-2">
        <button
          className={`px-4 py-1 rounded-full text-sm transition-colors duration-200 ${
            activeTab === 'items' 
              ? 'bg-primary/20 text-primary border border-primary' 
              : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
          }`}
          onClick={() => handleTabClick('items')}
        >
          Items
        </button>
        
        <button
          className={`px-4 py-1 rounded-full text-sm transition-colors duration-200 ${
            activeTab === 'lootChests' 
              ? 'bg-primary/20 text-primary border border-primary' 
              : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
          }`}
          onClick={() => handleTabClick('lootChests')}
        >
          Loot Chests
        </button>
        
        <button
          className={`px-4 py-1 rounded-full text-sm transition-colors duration-200 ${
            activeTab === 'badges' 
              ? 'bg-primary/20 text-primary border border-primary' 
              : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
          }`}
          onClick={() => handleTabClick('badges')}
        >
          Badges
        </button>
      </div>
    </div>
  );
}
