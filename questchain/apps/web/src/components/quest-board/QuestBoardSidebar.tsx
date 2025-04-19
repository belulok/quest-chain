'use client';

import { useState } from 'react';
import { QuestPack } from '@/app/quest-board/page';

interface QuestBoardSidebarProps {
  ownedPacks: QuestPack[];
}

export default function QuestBoardSidebar({ ownedPacks }: QuestBoardSidebarProps) {
  const [isMyPacksOpen, setIsMyPacksOpen] = useState(true);
  
  return (
    <div className="h-full flex flex-col">
      {/* My Packs Accordion */}
      <div className="mb-4">
        <button 
          className="w-full flex items-center justify-between font-pixel text-primary text-lg mb-2 hover:text-primary/80 transition-colors duration-200"
          onClick={() => setIsMyPacksOpen(!isMyPacksOpen)}
        >
          <span>My Packs</span>
          <span>{isMyPacksOpen ? '▼' : '►'}</span>
        </button>
        
        {isMyPacksOpen && (
          <div className="space-y-2 animate-[fadeIn_0.3s_ease-out]">
            {ownedPacks.length === 0 ? (
              <p className="text-gray-500 text-sm">No packs owned yet</p>
            ) : (
              ownedPacks.map(pack => (
                <div 
                  key={pack.id}
                  className="flex items-center justify-between bg-gray-800/50 hover:bg-gray-800 p-2 rounded-md cursor-pointer transition-colors duration-200"
                  onClick={() => console.log(`Starting quest: ${pack.name}`)}
                >
                  <div className="flex items-center">
                    <span className="mr-2">▶</span>
                    <span className="font-pixel text-sm text-gray-300">{pack.name}</span>
                  </div>
                  
                  {/* Star for completed packs (just for UI, we'll assume Arrays 101 is completed) */}
                  {pack.name === 'Arrays 101' && (
                    <span className="text-yellow-500">★</span>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
      
      {/* Help Section */}
      <div className="mt-auto">
        <h3 className="font-pixel text-gray-400 text-sm mb-2">Keyboard Shortcuts</h3>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>TAB - Navigate between packs</li>
          <li>ENTER - Select pack</li>
          <li>ESC - Close modal</li>
        </ul>
      </div>
    </div>
  );
}
