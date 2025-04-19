'use client';

import { useState } from 'react';
import { QuestPack } from '@/app/quest-board/page';

interface QuestPackGridProps {
  questPacks: QuestPack[];
  onPackClick: (pack: QuestPack) => void;
  addToCart: (pack: QuestPack) => void;
}

export default function QuestPackGrid({ questPacks, onPackClick, addToCart }: QuestPackGridProps) {
  const [hoveredPack, setHoveredPack] = useState<string | null>(null);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {questPacks.length === 0 ? (
        <div className="col-span-3 text-center py-12">
          <p className="text-gray-400 font-pixel">No quest packs found</p>
          <p className="text-gray-500 text-sm mt-2">Try adjusting your search or category filters</p>
        </div>
      ) : (
        questPacks.map(pack => (
          <div 
            key={pack.id}
            className={`bg-background/80 border-2 border-primary/30 rounded-md overflow-hidden transition-all duration-300 ${
              hoveredPack === pack.id ? 'transform rotate-y-10 scale-105' : ''
            }`}
            onMouseEnter={() => setHoveredPack(pack.id)}
            onMouseLeave={() => setHoveredPack(null)}
            onClick={() => onPackClick(pack)}
            style={{
              perspective: '1000px',
              transformStyle: 'preserve-3d'
            }}
          >
            <div className="p-4">
              <div className="flex mb-3">
                {/* Thumbnail */}
                <div className="w-16 h-16 bg-gray-700 rounded-md flex items-center justify-center mr-3">
                  <span className="font-pixel text-2xl text-primary">{pack.name.charAt(0)}</span>
                </div>
                
                <div className="flex-1">
                  {/* Title */}
                  <h3 className="font-pixel text-lg text-primary mb-1">{pack.name}</h3>
                  
                  {/* Level Range */}
                  <div className="flex items-center mb-1">
                    <span className="text-xs text-gray-400">Level {pack.level.min}-{pack.level.max}</span>
                  </div>
                  
                  {/* XP and Price */}
                  <div className="flex items-center justify-between">
                    <span className="inline-block bg-blue-900/50 text-blue-300 text-xs px-2 py-0.5 rounded-full">
                      {pack.xpReward} XP
                    </span>
                    
                    <span className={`inline-block ${pack.isFree ? 'bg-green-900/50 text-green-300' : 'bg-amber-900/50 text-amber-300'} text-xs px-2 py-0.5 rounded-full`}>
                      {pack.isFree ? 'Free' : `${pack.price} ${pack.currency}`}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Action Button */}
              <div className="flex justify-end mt-2">
                {pack.isOwned ? (
                  <button 
                    className="bg-green-700 hover:bg-green-600 text-white font-pixel text-sm py-1 px-4 rounded transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(`Starting quest: ${pack.name}`);
                    }}
                  >
                    Start
                  </button>
                ) : (
                  <button 
                    className={`${
                      pack.isFree 
                        ? 'bg-green-700 hover:bg-green-600 animate-pulse-slow' 
                        : 'bg-primary/20 hover:bg-primary/30 text-primary border border-primary'
                    } font-pixel text-sm py-1 px-4 rounded transition-colors duration-200`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (pack.isFree) {
                        console.log(`Enrolling in free quest: ${pack.name}`);
                      } else {
                        addToCart(pack);
                      }
                    }}
                  >
                    {pack.isFree ? 'Enroll' : 'Buy'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
