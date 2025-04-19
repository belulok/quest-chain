'use client';

import { useState, useEffect } from 'react';
import { LootChest } from './InventoryPane';

interface LootChestOpenModalProps {
  chest: LootChest;
  onConfirm: (chest: LootChest) => void;
  onCancel: () => void;
}

export default function LootChestOpenModal({ 
  chest, 
  onConfirm, 
  onCancel 
}: LootChestOpenModalProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  
  // Handle confirm
  const handleConfirm = () => {
    setIsOpening(true);
    setShowParticles(true);
    
    // Simulate opening animation
    setTimeout(() => {
      onConfirm(chest);
    }, 2000);
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-background border-2 border-primary/50 rounded-md w-full max-w-xs animate-[fadeIn_0.3s_ease-out]">
        {/* Header */}
        <div className="border-b border-primary/30 p-4">
          <h2 className="font-pixel text-xl text-center text-primary">
            Open Chest
          </h2>
        </div>
        
        {/* Content */}
        <div className="p-6 text-center">
          <div className={`text-5xl mb-4 ${
            isOpening ? 'animate-[spin_2s_ease-out]' : ''
          }`}>
            🎁
          </div>
          
          <p className="text-gray-300 mb-6">
            Are you sure you want to open this {chest.name}?
          </p>
          
          <p className="text-gray-500 text-sm mb-6">
            Opening this chest will consume it and give you a random item from the {chest.rewardPool} pool.
          </p>
          
          {/* Particles */}
          {showParticles && (
            <>
              <div className="absolute top-1/4 left-1/4 text-2xl animate-float">
                ✨
              </div>
              <div className="absolute top-1/3 right-1/3 text-3xl animate-float" style={{ animationDelay: '0.2s' }}>
                ✨
              </div>
              <div className="absolute bottom-1/3 right-1/4 text-2xl animate-float" style={{ animationDelay: '0.4s' }}>
                ✨
              </div>
              <div className="absolute bottom-1/4 left-1/3 text-3xl animate-float" style={{ animationDelay: '0.6s' }}>
                ✨
              </div>
            </>
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t border-primary/30 p-4 flex justify-between">
          <button 
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors duration-200"
            onClick={onCancel}
            disabled={isOpening}
          >
            Cancel
          </button>
          
          <button 
            className="px-4 py-2 bg-yellow-900/20 text-yellow-400 border border-yellow-700 rounded hover:bg-yellow-900/30 transition-colors duration-200"
            onClick={handleConfirm}
            disabled={isOpening}
          >
            {isOpening ? 'Opening...' : 'Open'}
          </button>
        </div>
      </div>
    </div>
  );
}
