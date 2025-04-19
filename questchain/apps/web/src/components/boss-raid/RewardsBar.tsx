'use client';

interface RewardsBarProps {
  xpReward: number;
  lootChest: string;
}

export default function RewardsBar({ xpReward, lootChest }: RewardsBarProps) {
  return (
    <div className="h-8 bg-background/90 border-t border-primary/30 flex items-center justify-between px-6">
      {/* XP Reward */}
      <div className="flex items-center">
        <span className="font-pixel text-sm text-gray-300 mr-1">Raid XP:</span>
        <span className="font-pixel text-sm text-blue-400">+{xpReward}</span>
      </div>
      
      {/* Separator */}
      <div className="text-gray-600 mx-4">•</div>
      
      {/* Loot Chest */}
      <div className="flex items-center">
        <span className="font-pixel text-sm text-gray-300 mr-2">{lootChest}</span>
        <span className="text-yellow-500">🗝️</span>
        <span className="font-pixel text-xs text-gray-500 ml-2">opens in Inventory</span>
      </div>
    </div>
  );
}
