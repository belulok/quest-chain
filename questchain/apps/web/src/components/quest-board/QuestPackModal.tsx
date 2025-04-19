'use client';

import { useEffect, useRef } from 'react';
import { QuestPack } from '@/app/quest-board/page';

interface QuestPackModalProps {
  pack: QuestPack;
  onClose: () => void;
  addToCart: (pack: QuestPack) => void;
}

export default function QuestPackModal({ pack, onClose, addToCart }: QuestPackModalProps) {
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
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className="bg-background border-2 border-primary/50 rounded-md w-full max-w-2xl animate-[fadeIn_0.3s_ease-out]"
      >
        {/* Header */}
        <div className="border-b border-primary/30 p-4 flex justify-between items-center">
          <h2 className="font-pixel text-xl text-primary">{pack.name}</h2>
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
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Column */}
            <div className="md:w-1/3">
              {/* Thumbnail */}
              <div className="w-full aspect-square bg-gray-700 rounded-md flex items-center justify-center mb-4">
                <span className="font-pixel text-5xl text-primary">{pack.name.charAt(0)}</span>
              </div>
              
              {/* Info Box */}
              <div className="bg-gray-800/50 rounded-md p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Level Range:</span>
                  <span className="text-white text-sm">{pack.level.min}-{pack.level.max}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">XP Reward:</span>
                  <span className="text-blue-300 text-sm">{pack.xpReward} XP</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Price:</span>
                  <span className={`${pack.isFree ? 'text-green-300' : 'text-amber-300'} text-sm`}>
                    {pack.isFree ? 'Free' : `${pack.price} ${pack.currency}`}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Creator:</span>
                  <span className="text-white text-sm">{pack.creator}</span>
                </div>
              </div>
            </div>
            
            {/* Right Column */}
            <div className="md:w-2/3">
              {/* Description */}
              <div className="mb-6">
                <h3 className="font-pixel text-lg text-gray-300 mb-2">Description</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{pack.description}</p>
              </div>
              
              {/* Sample Question */}
              <div className="mb-6">
                <h3 className="font-pixel text-lg text-gray-300 mb-2">Sample Question</h3>
                <div className="bg-gray-800/50 rounded-md p-4 text-gray-300 text-sm">
                  {pack.sampleQuestion}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="border-t border-primary/30 p-4 flex justify-end">
          {pack.isOwned ? (
            <button 
              className="bg-green-700 hover:bg-green-600 text-white font-pixel py-2 px-6 rounded transition-colors duration-200"
              onClick={() => {
                console.log(`Starting quest: ${pack.name}`);
                onClose();
              }}
            >
              Start Quest
            </button>
          ) : (
            <button 
              className={`font-pixel py-2 px-6 rounded transition-colors duration-200 ${
                pack.isFree 
                  ? 'bg-green-700 hover:bg-green-600 text-white animate-pulse-slow' 
                  : 'bg-primary/20 hover:bg-primary/30 text-primary border border-primary'
              }`}
              onClick={() => {
                if (pack.isFree) {
                  console.log(`Enrolling in free quest: ${pack.name}`);
                } else {
                  addToCart(pack);
                }
                onClose();
              }}
            >
              {pack.isFree ? 'Enroll Now' : `Add to Cart • ${pack.price} ${pack.currency}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
