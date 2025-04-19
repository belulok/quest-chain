'use client';

import { useState, useEffect, useRef } from 'react';
import AvatarHeader from './AvatarHeader';
import AvatarPortrait from './AvatarPortrait';
import EquipmentSlots from './EquipmentSlots';
import BackpackTabs from './BackpackTabs';
import ItemGrid from './ItemGrid';
import SelectedItemInfo from './SelectedItemInfo';
import LootChestOpenModal from './LootChestOpenModal';
import SellItemModal from './SellItemModal';

// Define item types
export type ItemSlot = 'head' | 'cape' | 'weapon' | 'charm' | 'boots';
export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type TabType = 'items' | 'lootChests' | 'badges';

export interface Item {
  id: string;
  name: string;
  slot: ItemSlot;
  power: number;
  rarity: ItemRarity;
  spriteCid: string;
  description: string;
  isEquipped?: boolean;
}

export interface LootChest {
  id: string;
  name: string;
  tier: number;
  rewardPool: string;
  spriteCid: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  dateEarned: string;
  spriteCid: string;
}

export interface Avatar {
  level: number;
  xp: number;
  maxXp: number;
  equipHead?: Item;
  equipCape?: Item;
  equipWeapon?: Item;
  equipCharm?: Item;
  equipBoots?: Item;
}

interface InventoryPaneProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InventoryPane({ isOpen, onClose }: InventoryPaneProps) {
  // State
  const [avatar, setAvatar] = useState<Avatar>({
    level: 3,
    xp: 245,
    maxXp: 300,
    equipWeapon: {
      id: 'item1',
      name: 'Bronze Sword',
      slot: 'weapon',
      power: 3,
      rarity: 'common',
      spriteCid: 'sword',
      description: 'A basic sword made of bronze.',
      isEquipped: true
    },
    equipHead: {
      id: 'item2',
      name: 'Leather Cap',
      slot: 'head',
      power: 1,
      rarity: 'common',
      spriteCid: 'cap',
      description: 'A simple leather cap.',
      isEquipped: true
    }
  });
  
  const [items, setItems] = useState<Item[]>([
    {
      id: 'item1',
      name: 'Bronze Sword',
      slot: 'weapon',
      power: 3,
      rarity: 'common',
      spriteCid: 'sword',
      description: 'A basic sword made of bronze.',
      isEquipped: true
    },
    {
      id: 'item2',
      name: 'Leather Cap',
      slot: 'head',
      power: 1,
      rarity: 'common',
      spriteCid: 'cap',
      description: 'A simple leather cap.',
      isEquipped: true
    },
    {
      id: 'item3',
      name: 'Iron Sword',
      slot: 'weapon',
      power: 5,
      rarity: 'rare',
      spriteCid: 'iron-sword',
      description: 'A sturdy sword made of iron.'
    },
    {
      id: 'item4',
      name: 'Wizard Hat',
      slot: 'head',
      power: 3,
      rarity: 'rare',
      spriteCid: 'wizard-hat',
      description: 'A pointy hat worn by wizards.'
    },
    {
      id: 'item5',
      name: 'Cloak of Shadows',
      slot: 'cape',
      power: 4,
      rarity: 'epic',
      spriteCid: 'cloak',
      description: 'A mysterious cloak that blends with shadows.'
    }
  ]);
  
  const [lootChests, setLootChests] = useState<LootChest[]>([
    {
      id: 'chest1',
      name: 'Common Chest',
      tier: 1,
      rewardPool: 'common',
      spriteCid: 'common-chest'
    },
    {
      id: 'chest2',
      name: 'Rare Chest',
      tier: 2,
      rewardPool: 'rare',
      spriteCid: 'rare-chest'
    }
  ]);
  
  const [badges, setBadges] = useState<Badge[]>([
    {
      id: 'badge1',
      name: 'First Quest',
      description: 'Completed your first quest',
      dateEarned: '2023-05-15',
      spriteCid: 'quest-badge'
    },
    {
      id: 'badge2',
      name: 'Boss Slayer',
      description: 'Defeated a raid boss',
      dateEarned: '2023-06-20',
      spriteCid: 'boss-badge'
    }
  ]);
  
  const [activeTab, setActiveTab] = useState<TabType>('items');
  const [selectedItem, setSelectedItem] = useState<Item | LootChest | Badge | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLootChestModal, setShowLootChestModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  
  const paneRef = useRef<HTMLDivElement>(null);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      
      if (e.key === 'i' && !isOpen) {
        // This would be handled by the parent component
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
  
  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (paneRef.current && !paneRef.current.contains(e.target as Node) && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Filter items based on search query
  const filteredItems = () => {
    if (activeTab === 'items') {
      return items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (activeTab === 'lootChests') {
      return lootChests.filter(chest => 
        chest.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      return badges.filter(badge => 
        badge.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  };
  
  // Handle equip item
  const handleEquipItem = (item: Item) => {
    // Check if item is already equipped
    if (item.isEquipped) return;
    
    // Update avatar equipment
    const newAvatar = { ...avatar };
    
    // Unequip current item in that slot if any
    const currentEquipped = items.find(i => i.slot === item.slot && i.isEquipped);
    if (currentEquipped) {
      const updatedItems = items.map(i => 
        i.id === currentEquipped.id ? { ...i, isEquipped: false } : i
      );
      setItems(updatedItems);
    }
    
    // Equip new item
    const updatedItems = items.map(i => 
      i.id === item.id ? { ...i, isEquipped: true } : i
    );
    setItems(updatedItems);
    
    // Update avatar equipment
    switch (item.slot) {
      case 'head':
        newAvatar.equipHead = { ...item, isEquipped: true };
        break;
      case 'cape':
        newAvatar.equipCape = { ...item, isEquipped: true };
        break;
      case 'weapon':
        newAvatar.equipWeapon = { ...item, isEquipped: true };
        break;
      case 'charm':
        newAvatar.equipCharm = { ...item, isEquipped: true };
        break;
      case 'boots':
        newAvatar.equipBoots = { ...item, isEquipped: true };
        break;
    }
    
    // Play spin animation
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
    }, 1000);
    
    setAvatar(newAvatar);
    
    // In a real implementation, this would call the on-chain equip function
    console.log(`Equipped ${item.name} in ${item.slot} slot`);
  };
  
  // Handle sell item
  const handleSellItem = (item: Item) => {
    setSelectedItem(item);
    setShowSellModal(true);
  };
  
  // Handle burn item
  const handleBurnItem = (item: Item) => {
    if (confirm(`Are you sure you want to burn ${item.name}?`)) {
      // Remove item from inventory
      const updatedItems = items.filter(i => i.id !== item.id);
      setItems(updatedItems);
      
      // If item was equipped, update avatar
      if (item.isEquipped) {
        const newAvatar = { ...avatar };
        switch (item.slot) {
          case 'head':
            newAvatar.equipHead = undefined;
            break;
          case 'cape':
            newAvatar.equipCape = undefined;
            break;
          case 'weapon':
            newAvatar.equipWeapon = undefined;
            break;
          case 'charm':
            newAvatar.equipCharm = undefined;
            break;
          case 'boots':
            newAvatar.equipBoots = undefined;
            break;
        }
        setAvatar(newAvatar);
      }
      
      setSelectedItem(null);
      
      // In a real implementation, this would call the on-chain burn function
      console.log(`Burned ${item.name}`);
    }
  };
  
  // Handle open loot chest
  const handleOpenLootChest = (chest: LootChest) => {
    setSelectedItem(chest);
    setShowLootChestModal(true);
  };
  
  // Handle confirm loot chest open
  const handleConfirmOpenChest = (chest: LootChest) => {
    // Generate a random item as reward
    const slots: ItemSlot[] = ['head', 'cape', 'weapon', 'charm', 'boots'];
    const rarities: ItemRarity[] = ['common', 'rare', 'epic', 'legendary'];
    
    const randomSlot = slots[Math.floor(Math.random() * slots.length)];
    const randomRarity = chest.tier <= 1 ? 'common' : 
                         chest.tier === 2 ? (Math.random() > 0.7 ? 'rare' : 'common') : 
                         'epic';
    
    const newItem: Item = {
      id: `item${Date.now()}`,
      name: `${randomRarity.charAt(0).toUpperCase() + randomRarity.slice(1)} ${
        randomSlot === 'head' ? 'Helmet' :
        randomSlot === 'cape' ? 'Cloak' :
        randomSlot === 'weapon' ? 'Sword' :
        randomSlot === 'charm' ? 'Amulet' :
        'Boots'
      }`,
      slot: randomSlot,
      power: randomRarity === 'common' ? 2 : 
             randomRarity === 'rare' ? 5 : 
             randomRarity === 'epic' ? 8 : 12,
      rarity: randomRarity,
      spriteCid: `${randomRarity}-${randomSlot}`,
      description: `A ${randomRarity} ${randomSlot} found in a ${chest.name}.`
    };
    
    // Add item to inventory
    setItems([...items, newItem]);
    
    // Remove chest from inventory
    const updatedChests = lootChests.filter(c => c.id !== chest.id);
    setLootChests(updatedChests);
    
    setShowLootChestModal(false);
    setSelectedItem(newItem);
    
    // In a real implementation, this would call the on-chain open_chest function
    console.log(`Opened ${chest.name} and received ${newItem.name}`);
  };
  
  // Handle confirm sell
  const handleConfirmSell = (item: Item, price: number) => {
    // Remove item from inventory
    const updatedItems = items.filter(i => i.id !== item.id);
    setItems(updatedItems);
    
    // If item was equipped, update avatar
    if (item.isEquipped) {
      const newAvatar = { ...avatar };
      switch (item.slot) {
        case 'head':
          newAvatar.equipHead = undefined;
          break;
        case 'cape':
          newAvatar.equipCape = undefined;
          break;
        case 'weapon':
          newAvatar.equipWeapon = undefined;
          break;
        case 'charm':
          newAvatar.equipCharm = undefined;
          break;
        case 'boots':
          newAvatar.equipBoots = undefined;
          break;
      }
      setAvatar(newAvatar);
    }
    
    setShowSellModal(false);
    setSelectedItem(null);
    
    // In a real implementation, this would call the on-chain list_in_kiosk function
    console.log(`Listed ${item.name} for sale at ${price} SUI`);
  };
  
  return (
    <div 
      className={`fixed top-0 right-0 h-full w-80 bg-background border-l-2 border-primary/30 transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      ref={paneRef}
      style={{ 
        boxShadow: isOpen ? '-4px 0 15px rgba(0, 0, 0, 0.3)' : 'none',
        animation: isOpen ? 'bounce-in 0.5s ease-out' : 'none'
      }}
    >
      {/* Header */}
      <AvatarHeader 
        avatar={avatar} 
        onClose={onClose} 
      />
      
      {/* Avatar Portrait */}
      <AvatarPortrait 
        avatar={avatar} 
        isSpinning={isSpinning} 
      />
      
      {/* Equipment Slots */}
      <EquipmentSlots 
        avatar={avatar} 
        onSelectItem={setSelectedItem} 
      />
      
      {/* Backpack Tabs */}
      <BackpackTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      {/* Item Grid */}
      <ItemGrid 
        items={filteredItems()} 
        activeTab={activeTab}
        selectedItem={selectedItem}
        onSelectItem={setSelectedItem}
        onOpenLootChest={handleOpenLootChest}
      />
      
      {/* Selected Item Info */}
      {selectedItem && (
        <SelectedItemInfo 
          item={selectedItem} 
          activeTab={activeTab}
          onEquip={activeTab === 'items' ? handleEquipItem : undefined}
          onSell={activeTab === 'items' ? handleSellItem : undefined}
          onBurn={activeTab === 'items' ? handleBurnItem : undefined}
          onOpenChest={activeTab === 'lootChests' ? handleOpenLootChest : undefined}
        />
      )}
      
      {/* Loot Chest Modal */}
      {showLootChestModal && selectedItem && activeTab === 'lootChests' && (
        <LootChestOpenModal 
          chest={selectedItem as LootChest} 
          onConfirm={handleConfirmOpenChest}
          onCancel={() => setShowLootChestModal(false)}
        />
      )}
      
      {/* Sell Item Modal */}
      {showSellModal && selectedItem && activeTab === 'items' && (
        <SellItemModal 
          item={selectedItem as Item} 
          onConfirm={handleConfirmSell}
          onCancel={() => setShowSellModal(false)}
        />
      )}
    </div>
  );
}
