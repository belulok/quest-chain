'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import InventoryPane from '../inventory/InventoryPane';
import { ProgressBar } from 'shared-ui/src/components/ProgressBar';

interface PlayerStats {
  level: number;
  power: number;
  xp: number;
  maxXp: number;
}

interface WorldMapSidebarProps {
  playerStats: PlayerStats;
}

export default function WorldMapSidebar({ playerStats }: WorldMapSidebarProps) {
  const [showInventory, setShowInventory] = useState(false);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'i' || e.key === 'I') {
        setShowInventory(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="h-full p-4 flex flex-col">
      {/* Player Stats */}
      <div className="pixel-container mb-6 p-4">
        <h2 className="font-pixel text-primary text-xl mb-4">PLAYER STATS</h2>

        <div className="mb-3">
          <div className="flex justify-between">
            <span className="font-pixel text-sm text-gray-300">LEVEL</span>
            <span className="font-pixel text-sm text-primary">{playerStats.level}</span>
          </div>
          <div className="w-full h-1 bg-gray-700 mt-1">
            <div
              className="h-full bg-primary"
              style={{ width: `${(playerStats.xp / playerStats.maxXp) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="font-pixel text-xs text-gray-400">XP</span>
            <span className="font-pixel text-xs text-gray-400">{playerStats.xp} / {playerStats.maxXp}</span>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex justify-between">
            <span className="font-pixel text-sm text-gray-300">POWER</span>
            <span className="font-pixel text-sm text-secondary">{playerStats.power}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 mb-6">
        <button
          className="pixel-btn w-full text-center"
          onClick={() => setShowInventory(!showInventory)}
        >
          INVENTORY
        </button>

        <Link href="/quest-board" className="pixel-btn w-full text-center">
          QUEST BOARD
        </Link>

        <Link
          href="/boss-raid/omega"
          className="pixel-btn w-full text-center opacity-70 hover:opacity-100"
        >
          BOSS RAID
        </Link>

        <Link
          href="/leaderboard"
          className="pixel-btn w-full text-center"
        >
          LEADERBOARD
        </Link>
      </div>

      {/* Inventory Pane */}
      <InventoryPane
        isOpen={showInventory}
        onClose={() => setShowInventory(false)}
      />

      {/* Inventory Drawer (conditionally rendered) */}
      {showInventory && (
        <div className="pixel-container p-4 animate-[slideIn_0.3s_ease-out]">
          <h3 className="font-pixel text-primary text-lg mb-3">INVENTORY</h3>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-800 p-2 rounded-md">
              <span className="font-pixel text-xs text-gray-300">Sword</span>
              <div className="text-xs text-gray-400">+10 Power</div>
            </div>

            <div className="bg-gray-800 p-2 rounded-md">
              <span className="font-pixel text-xs text-gray-300">Shield</span>
              <div className="text-xs text-gray-400">+5 Defense</div>
            </div>

            <div className="bg-gray-800 p-2 rounded-md">
              <span className="font-pixel text-xs text-gray-300">Potion</span>
              <div className="text-xs text-gray-400">Heal 50 HP</div>
            </div>

            <div className="bg-gray-800 p-2 rounded-md border border-dashed border-gray-600 flex items-center justify-center">
              <span className="font-pixel text-xs text-gray-500">Empty</span>
            </div>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-grow"></div>

      {/* Help Text */}
      <div className="text-xs text-gray-400 mt-4">
        <p>Use WASD keys to navigate</p>
        <p>Click on a biome to enter</p>
      </div>
    </div>
  );
}
