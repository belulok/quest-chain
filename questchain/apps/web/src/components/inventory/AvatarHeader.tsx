'use client';

import { Avatar } from './InventoryPane';

interface AvatarHeaderProps {
  avatar: Avatar;
  onClose: () => void;
}

export default function AvatarHeader({ avatar, onClose }: AvatarHeaderProps) {
  return (
    <div className="h-12 bg-background/90 border-b-2 border-primary/30 flex items-center justify-between px-4">
      <div className="flex items-center">
        <span className="font-pixel text-primary">Avatar Level {avatar.level}</span>
        <span className="text-gray-400 mx-2">•</span>
        <span className="font-pixel text-gray-300">XP {avatar.xp} / {avatar.maxXp}</span>
      </div>
      
      <button 
        className="text-gray-400 hover:text-white"
        onClick={onClose}
        aria-label="Close inventory"
      >
        ✕
      </button>
    </div>
  );
}
