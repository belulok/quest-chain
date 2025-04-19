'use client';

import { Avatar } from './InventoryPane';

interface AvatarPortraitProps {
  avatar: Avatar;
  isSpinning: boolean;
}

export default function AvatarPortrait({ avatar, isSpinning }: AvatarPortraitProps) {
  return (
    <div className="flex justify-center py-4">
      <div 
        className={`w-24 h-24 bg-gray-800 rounded-md flex items-center justify-center border-2 border-primary/30 ${
          isSpinning ? 'animate-[spin_1s_ease-out]' : ''
        }`}
      >
        {/* Avatar sprite with equipment */}
        <div className="relative">
          {/* Base avatar */}
          <div className="text-4xl">👤</div>
          
          {/* Equipment overlays */}
          {avatar.equipHead && (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <div className="text-sm text-yellow-500">👑</div>
            </div>
          )}
          
          {avatar.equipWeapon && (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <div className="text-sm text-gray-300 transform -translate-x-3 translate-y-2">⚔️</div>
            </div>
          )}
          
          {avatar.equipCape && (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <div className="text-sm text-purple-500 transform translate-x-3 translate-y-2">🧣</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
