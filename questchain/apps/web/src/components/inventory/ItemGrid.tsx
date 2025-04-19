'use client';

import { Item, LootChest, Badge, TabType } from './InventoryPane';

interface ItemGridProps {
  items: (Item | LootChest | Badge)[];
  activeTab: TabType;
  selectedItem: (Item | LootChest | Badge) | null;
  onSelectItem: (item: Item | LootChest | Badge | null) => void;
  onOpenLootChest: (chest: LootChest) => void;
}

export default function ItemGrid({ 
  items, 
  activeTab,
  selectedItem,
  onSelectItem,
  onOpenLootChest
}: ItemGridProps) {
  // Get rarity color
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-600';
      case 'rare': return 'border-blue-600';
      case 'epic': return 'border-purple-600';
      case 'legendary': return 'border-yellow-600';
      default: return 'border-gray-600';
    }
  };
  
  // Get chest tier color
  const getChestTierColor = (tier: number) => {
    switch (tier) {
      case 1: return 'border-gray-600';
      case 2: return 'border-blue-600';
      case 3: return 'border-purple-600';
      case 4: return 'border-yellow-600';
      default: return 'border-gray-600';
    }
  };
  
  // Render item
  const renderItem = (item: Item | LootChest | Badge) => {
    const isSelected = selectedItem && selectedItem.id === item.id;
    
    if (activeTab === 'items') {
      const itemObj = item as Item;
      return (
        <div 
          key={item.id}
          className={`w-12 h-12 bg-gray-800 rounded-md flex items-center justify-center cursor-pointer transition-all duration-200 border-2 ${
            isSelected 
              ? 'border-primary' 
              : getRarityColor(itemObj.rarity)
          } ${
            itemObj.isEquipped ? 'bg-gray-700' : ''
          } hover:scale-105`}
          onClick={() => onSelectItem(item)}
          title={itemObj.name}
        >
          <div className={`text-2xl ${
            itemObj.rarity === 'common' ? 'text-gray-300' :
            itemObj.rarity === 'rare' ? 'text-blue-400' :
            itemObj.rarity === 'epic' ? 'text-purple-400' :
            'text-yellow-400'
          }`}>
            {itemObj.slot === 'head' ? '👑' :
             itemObj.slot === 'cape' ? '🧣' :
             itemObj.slot === 'weapon' ? '⚔️' :
             itemObj.slot === 'charm' ? '🔮' :
             '👢'}
          </div>
          
          {/* Equipped indicator */}
          {itemObj.isEquipped && (
            <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
          )}
        </div>
      );
    } else if (activeTab === 'lootChests') {
      const chestObj = item as LootChest;
      return (
        <div 
          key={item.id}
          className={`w-12 h-12 bg-gray-800 rounded-md flex items-center justify-center cursor-pointer transition-all duration-200 border-2 ${
            isSelected 
              ? 'border-primary' 
              : getChestTierColor(chestObj.tier)
          } hover:scale-105`}
          onClick={() => onSelectItem(item)}
          onDoubleClick={() => onOpenLootChest(chestObj)}
          title={chestObj.name}
        >
          <div className={`text-2xl ${
            chestObj.tier === 1 ? 'text-gray-300' :
            chestObj.tier === 2 ? 'text-blue-400' :
            chestObj.tier === 3 ? 'text-purple-400' :
            'text-yellow-400'
          }`}>
            🎁
          </div>
        </div>
      );
    } else {
      const badgeObj = item as Badge;
      return (
        <div 
          key={item.id}
          className={`w-12 h-12 bg-gray-800 rounded-md flex items-center justify-center cursor-pointer transition-all duration-200 border-2 ${
            isSelected ? 'border-primary' : 'border-gray-600'
          } hover:scale-105`}
          onClick={() => onSelectItem(item)}
          title={badgeObj.name}
        >
          <div className="text-2xl text-yellow-400">
            🏆
          </div>
        </div>
      );
    }
  };
  
  return (
    <div className="px-4 py-3 h-48 overflow-y-auto">
      {items.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 text-sm">No items found</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {items.map(item => renderItem(item))}
        </div>
      )}
    </div>
  );
}
