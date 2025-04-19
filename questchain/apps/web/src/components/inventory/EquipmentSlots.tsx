'use client';

import { useState, useEffect } from 'react';
import { Avatar, Item } from './InventoryPane';

interface EquipmentSlotsProps {
  avatar: Avatar;
  onSelectItem: (item: Item | null) => void;
}

export default function EquipmentSlots({ avatar, onSelectItem }: EquipmentSlotsProps) {
  const [shimmerSlot, setShimmerSlot] = useState<string | null>(null);
  
  // Shimmer empty slots every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const emptySlots = [
        !avatar.equipHead && 'head',
        !avatar.equipCape && 'cape',
        !avatar.equipWeapon && 'weapon',
        !avatar.equipCharm && 'charm',
        !avatar.equipBoots && 'boots',
      ].filter(Boolean) as string[];
      
      if (emptySlots.length > 0) {
        const randomSlot = emptySlots[Math.floor(Math.random() * emptySlots.length)];
        setShimmerSlot(randomSlot);
        
        setTimeout(() => {
          setShimmerSlot(null);
        }, 1000);
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [avatar]);
  
  // Get slot name for display
  const getSlotName = (slot: string) => {
    switch (slot) {
      case 'head': return 'Head';
      case 'cape': return 'Cape';
      case 'weapon': return 'Weapon';
      case 'charm': return 'Charm';
      case 'boots': return 'Boots';
      default: return slot;
    }
  };
  
  // Get item in slot
  const getItemInSlot = (slot: string): Item | undefined => {
    switch (slot) {
      case 'head': return avatar.equipHead;
      case 'cape': return avatar.equipCape;
      case 'weapon': return avatar.equipWeapon;
      case 'charm': return avatar.equipCharm;
      case 'boots': return avatar.equipBoots;
      default: return undefined;
    }
  };
  
  // Render equipment slot
  const renderSlot = (slot: string) => {
    const item = getItemInSlot(slot);
    const isShimmering = shimmerSlot === slot;
    
    return (
      <div 
        className={`w-12 h-12 bg-gray-800 rounded-md flex items-center justify-center border border-gray-700 cursor-pointer hover:border-primary/50 transition-all duration-200 ${
          isShimmering ? 'animate-pulse border-yellow-500/50' : ''
        }`}
        onClick={() => item && onSelectItem(item)}
        title={item ? item.name : `Empty ${getSlotName(slot)} Slot`}
      >
        {item ? (
          <div className={`text-2xl ${
            item.rarity === 'common' ? 'text-gray-300' :
            item.rarity === 'rare' ? 'text-blue-400' :
            item.rarity === 'epic' ? 'text-purple-400' :
            'text-yellow-400'
          }`}>
            {slot === 'head' ? '👑' :
             slot === 'cape' ? '🧣' :
             slot === 'weapon' ? '⚔️' :
             slot === 'charm' ? '🔮' :
             '👢'}
          </div>
        ) : (
          <div className="text-gray-500 text-2xl">+</div>
        )}
      </div>
    );
  };
  
  return (
    <div className="px-4 py-3">
      <h3 className="font-pixel text-primary text-sm mb-2">EQUIPMENT</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Row 1 */}
        <div className="flex justify-center">
          {renderSlot('head')}
        </div>
        <div className="flex justify-center">
          {renderSlot('cape')}
        </div>
        
        {/* Row 2 */}
        <div className="flex justify-center">
          {renderSlot('weapon')}
        </div>
        <div className="flex justify-center">
          {renderSlot('charm')}
        </div>
        
        {/* Row 3 */}
        <div className="flex justify-center">
          {renderSlot('boots')}
        </div>
        <div className="flex justify-center">
          {/* Empty cell */}
          <div className="w-12 h-12 bg-transparent"></div>
        </div>
      </div>
    </div>
  );
}
