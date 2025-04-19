'use client';

import { useEffect, useRef } from 'react';
import { Player } from '@/app/leaderboard/page';

interface PlayerProfileModalProps {
  player: Player;
  onClose: () => void;
}

export default function PlayerProfileModal({
  player,
  onClose
}: PlayerProfileModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    // Close modal when pressing Escape
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);
  
  // Format XP number with spaces
  const formatXP = (xp: number): string => {
    return xp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className="bg-background border-2 border-primary/50 rounded-md w-full max-w-md animate-[fadeIn_0.3s_ease-out]"
      >
        {/* Header */}
        <div className="border-b border-primary/30 p-4 flex justify-between items-center">
          <h2 className="font-pixel text-xl text-primary">Player Profile</h2>
          <button 
            className="text-gray-400 hover:text-white"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Player Info */}
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gray-800 rounded-md flex items-center justify-center mr-4 relative">
              <span className="text-3xl">{player.avatarImage}</span>
              
              {/* Rank Badge */}
              {player.rank <= 3 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center">
                  {player.rank === 1 && <span className="text-yellow-400">🥇</span>}
                  {player.rank === 2 && <span className="text-gray-300">🥈</span>}
                  {player.rank === 3 && <span className="text-amber-600">🥉</span>}
                </div>
              )}
            </div>
            
            <div>
              <h3 className="font-pixel text-2xl text-white mb-1">{player.name}</h3>
              <div className="flex items-center text-sm">
                <span className="text-gray-400">Rank #{player.rank}</span>
                <span className="mx-2 text-gray-600">•</span>
                <span className="text-gray-400">Level {player.level}</span>
              </div>
              <div className="text-primary font-pixel mt-1">
                {formatXP(player.xp)} XP
              </div>
            </div>
          </div>
          
          {/* Equipment */}
          <div className="mb-6">
            <h4 className="font-pixel text-lg text-primary mb-3">Equipment</h4>
            <div className="grid grid-cols-5 gap-2">
              {/* Head */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 ${
                  player.equipment.head 
                    ? 'bg-gray-800 border border-gray-700' 
                    : 'bg-gray-900 border border-gray-800'
                } rounded-md flex items-center justify-center mb-1`}>
                  {player.equipment.head ? (
                    <span className="text-sm">👑</span>
                  ) : (
                    <span className="text-gray-700 text-xs">+</span>
                  )}
                </div>
                <span className="text-xs text-gray-500">Head</span>
              </div>
              
              {/* Cape */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 ${
                  player.equipment.cape 
                    ? 'bg-gray-800 border border-gray-700' 
                    : 'bg-gray-900 border border-gray-800'
                } rounded-md flex items-center justify-center mb-1`}>
                  {player.equipment.cape ? (
                    <span className="text-sm">🧣</span>
                  ) : (
                    <span className="text-gray-700 text-xs">+</span>
                  )}
                </div>
                <span className="text-xs text-gray-500">Cape</span>
              </div>
              
              {/* Weapon */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 ${
                  player.equipment.weapon 
                    ? 'bg-gray-800 border border-gray-700' 
                    : 'bg-gray-900 border border-gray-800'
                } rounded-md flex items-center justify-center mb-1`}>
                  {player.equipment.weapon ? (
                    <span className="text-sm">⚔️</span>
                  ) : (
                    <span className="text-gray-700 text-xs">+</span>
                  )}
                </div>
                <span className="text-xs text-gray-500">Weapon</span>
              </div>
              
              {/* Charm */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 ${
                  player.equipment.charm 
                    ? 'bg-gray-800 border border-gray-700' 
                    : 'bg-gray-900 border border-gray-800'
                } rounded-md flex items-center justify-center mb-1`}>
                  {player.equipment.charm ? (
                    <span className="text-sm">🔮</span>
                  ) : (
                    <span className="text-gray-700 text-xs">+</span>
                  )}
                </div>
                <span className="text-xs text-gray-500">Charm</span>
              </div>
              
              {/* Boots */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 ${
                  player.equipment.boots 
                    ? 'bg-gray-800 border border-gray-700' 
                    : 'bg-gray-900 border border-gray-800'
                } rounded-md flex items-center justify-center mb-1`}>
                  {player.equipment.boots ? (
                    <span className="text-sm">👢</span>
                  ) : (
                    <span className="text-gray-700 text-xs">+</span>
                  )}
                </div>
                <span className="text-xs text-gray-500">Boots</span>
              </div>
            </div>
          </div>
          
          {/* Badges */}
          <div>
            <h4 className="font-pixel text-lg text-primary mb-3">Badges</h4>
            {player.badges.length === 0 ? (
              <p className="text-gray-500 text-sm">No badges earned yet</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {player.badges.map((badge, index) => (
                  <div 
                    key={index}
                    className="bg-gray-800/50 border border-gray-700 rounded-md p-2 flex items-center"
                  >
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center mr-2">
                      <span className="text-yellow-400 text-sm">🏆</span>
                    </div>
                    <span className="text-sm text-gray-300">{badge}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="border-t border-primary/30 p-4 flex justify-end">
          <button 
            className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary font-pixel py-2 px-6 rounded transition-colors duration-200"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
