'use client';

import { useState, useRef, useEffect } from 'react';
import { useCustomWallet } from '@/contexts/CustomWallet';
import Link from 'next/link';

export default function UserProfileButton() {
  const { isConnected, address, logout, userInfo } = useCustomWallet();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!isConnected || !address) {
    return null;
  }

  // Format address for display
  const formatAddress = (addr: string) => {
    if (!addr) return 'Unknown';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 rounded-full px-3 py-1 transition-colors duration-200"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
          {userInfo?.picture ? (
            <img src={userInfo.picture} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-primary">👤</span>
          )}
        </div>
        <span className="text-gray-300 text-sm hidden md:block">
          {userInfo?.name || formatAddress(address)}
        </span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10 animate-[fadeIn_0.2s_ease-out]">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-gray-700">
              <p className="text-gray-300 font-medium">{userInfo?.name || 'User'}</p>
              <p className="text-gray-500 text-xs">{formatAddress(address)}</p>
            </div>
            <Link
              href="/world-map"
              className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={() => setShowDropdown(false)}
            >
              World Map
            </Link>
            <Link
              href="/leaderboard"
              className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={() => setShowDropdown(false)}
            >
              Leaderboard
            </Link>
            <button
              className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={async () => {
                setShowDropdown(false);
                await logout();
              }}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
