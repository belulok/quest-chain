'use client';

import { useState } from 'react';
import { Item } from './InventoryPane';

interface SellItemModalProps {
  item: Item;
  onConfirm: (item: Item, price: number) => void;
  onCancel: () => void;
}

export default function SellItemModal({ 
  item, 
  onConfirm, 
  onCancel 
}: SellItemModalProps) {
  const [price, setPrice] = useState(item.power * 2); // Suggested price based on power
  const [isListing, setIsListing] = useState(false);
  
  // Handle price change
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setPrice(value);
    }
  };
  
  // Handle confirm
  const handleConfirm = () => {
    setIsListing(true);
    
    // Simulate listing process
    setTimeout(() => {
      onConfirm(item, price);
    }, 1500);
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-background border-2 border-primary/50 rounded-md w-full max-w-xs animate-[fadeIn_0.3s_ease-out]">
        {/* Header */}
        <div className="border-b border-primary/30 p-4">
          <h2 className="font-pixel text-xl text-center text-primary">
            Sell Item
          </h2>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className={`w-12 h-12 bg-gray-800 rounded-md flex items-center justify-center border-2 ${
              item.rarity === 'common' ? 'border-gray-600' :
              item.rarity === 'rare' ? 'border-blue-600' :
              item.rarity === 'epic' ? 'border-purple-600' :
              'border-yellow-600'
            } mr-3`}>
              <div className={`text-2xl ${
                item.rarity === 'common' ? 'text-gray-300' :
                item.rarity === 'rare' ? 'text-blue-400' :
                item.rarity === 'epic' ? 'text-purple-400' :
                'text-yellow-400'
              }`}>
                {item.slot === 'head' ? '👑' :
                 item.slot === 'cape' ? '🧣' :
                 item.slot === 'weapon' ? '⚔️' :
                 item.slot === 'charm' ? '🔮' :
                 '👢'}
              </div>
            </div>
            
            <div>
              <h3 className={`font-pixel text-lg ${
                item.rarity === 'common' ? 'text-gray-300' :
                item.rarity === 'rare' ? 'text-blue-400' :
                item.rarity === 'epic' ? 'text-purple-400' :
                'text-yellow-400'
              }`}>
                {item.name}
              </h3>
              <div className="text-sm text-gray-400">
                Power +{item.power} • {item.rarity}
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-2">
              Set Price (SUI)
            </label>
            <input
              type="number"
              value={price}
              onChange={handlePriceChange}
              min="0"
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
              disabled={isListing}
            />
          </div>
          
          <p className="text-gray-500 text-sm mb-4">
            Your item will be listed in the Kiosk marketplace for other players to purchase.
          </p>
        </div>
        
        {/* Footer */}
        <div className="border-t border-primary/30 p-4 flex justify-between">
          <button 
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors duration-200"
            onClick={onCancel}
            disabled={isListing}
          >
            Cancel
          </button>
          
          <button 
            className="px-4 py-2 bg-blue-900/20 text-blue-400 border border-blue-700 rounded hover:bg-blue-900/30 transition-colors duration-200"
            onClick={handleConfirm}
            disabled={isListing}
          >
            {isListing ? 'Listing...' : 'List for Sale'}
          </button>
        </div>
      </div>
    </div>
  );
}
