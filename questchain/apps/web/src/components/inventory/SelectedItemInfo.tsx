'use client';

import { Item, LootChest, Badge, TabType } from './InventoryPane';

interface SelectedItemInfoProps {
  item: Item | LootChest | Badge;
  activeTab: TabType;
  onEquip?: (item: Item) => void;
  onSell?: (item: Item) => void;
  onBurn?: (item: Item) => void;
  onOpenChest?: (chest: LootChest) => void;
}

export default function SelectedItemInfo({ 
  item, 
  activeTab,
  onEquip,
  onSell,
  onBurn,
  onOpenChest
}: SelectedItemInfoProps) {
  // Render item details based on tab
  const renderItemDetails = () => {
    if (activeTab === 'items') {
      const itemObj = item as Item;
      return (
        <>
          <div className="mb-2">
            <h4 className={`font-pixel text-lg ${
              itemObj.rarity === 'common' ? 'text-gray-300' :
              itemObj.rarity === 'rare' ? 'text-blue-400' :
              itemObj.rarity === 'epic' ? 'text-purple-400' :
              'text-yellow-400'
            }`}>
              {itemObj.name}
            </h4>
            <div className="flex items-center text-sm">
              <span className="text-gray-400">Power +{itemObj.power}</span>
              <span className="mx-2 text-gray-600">•</span>
              <span className="text-gray-400 capitalize">{itemObj.slot}</span>
              <span className="mx-2 text-gray-600">•</span>
              <span className="text-gray-400 capitalize">{itemObj.rarity}</span>
            </div>
          </div>
          
          <p className="text-gray-500 text-sm mb-3">
            {itemObj.description}
          </p>
          
          <div className="flex space-x-2">
            {!itemObj.isEquipped && onEquip && (
              <button
                className="px-3 py-1 bg-primary/20 text-primary border border-primary rounded text-sm hover:bg-primary/30 transition-colors duration-200"
                onClick={() => onEquip(itemObj)}
              >
                Equip
              </button>
            )}
            
            {onSell && (
              <button
                className="px-3 py-1 bg-blue-900/20 text-blue-400 border border-blue-700 rounded text-sm hover:bg-blue-900/30 transition-colors duration-200"
                onClick={() => onSell(itemObj)}
                disabled={itemObj.isEquipped}
              >
                Sell (Kiosk)
              </button>
            )}
            
            {onBurn && (
              <button
                className="px-3 py-1 bg-red-900/20 text-red-400 border border-red-700 rounded text-sm hover:bg-red-900/30 transition-colors duration-200"
                onClick={() => onBurn(itemObj)}
                disabled={itemObj.isEquipped}
              >
                Burn
              </button>
            )}
          </div>
        </>
      );
    } else if (activeTab === 'lootChests') {
      const chestObj = item as LootChest;
      return (
        <>
          <div className="mb-2">
            <h4 className={`font-pixel text-lg ${
              chestObj.tier === 1 ? 'text-gray-300' :
              chestObj.tier === 2 ? 'text-blue-400' :
              chestObj.tier === 3 ? 'text-purple-400' :
              'text-yellow-400'
            }`}>
              {chestObj.name}
            </h4>
            <div className="flex items-center text-sm">
              <span className="text-gray-400">Tier {chestObj.tier}</span>
              <span className="mx-2 text-gray-600">•</span>
              <span className="text-gray-400">Reward Pool: {chestObj.rewardPool}</span>
            </div>
          </div>
          
          <p className="text-gray-500 text-sm mb-3">
            This chest contains random items from the {chestObj.rewardPool} pool.
          </p>
          
          {onOpenChest && (
            <button
              className="px-3 py-1 bg-yellow-900/20 text-yellow-400 border border-yellow-700 rounded text-sm hover:bg-yellow-900/30 transition-colors duration-200 w-full"
              onClick={() => onOpenChest(chestObj)}
            >
              Open Chest
            </button>
          )}
        </>
      );
    } else {
      const badgeObj = item as Badge;
      return (
        <>
          <div className="mb-2">
            <h4 className="font-pixel text-lg text-yellow-400">
              {badgeObj.name}
            </h4>
            <div className="flex items-center text-sm">
              <span className="text-gray-400">Earned: {badgeObj.dateEarned}</span>
            </div>
          </div>
          
          <p className="text-gray-500 text-sm">
            {badgeObj.description}
          </p>
        </>
      );
    }
  };
  
  return (
    <div className="h-24 bg-gray-800/50 border-t border-primary/30 p-3">
      {renderItemDetails()}
    </div>
  );
}
