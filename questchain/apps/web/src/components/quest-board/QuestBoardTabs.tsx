'use client';

import { useState, useEffect } from 'react';

interface QuestBoardTabsProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

interface Category {
  id: string;
  label: string;
  icon: string;
}

export default function QuestBoardTabs({ activeCategory, setActiveCategory }: QuestBoardTabsProps) {
  const [underlinePosition, setUnderlinePosition] = useState({ left: 0, width: 0 });
  const [tabRefs, setTabRefs] = useState<(HTMLButtonElement | null)[]>([]);
  
  // Define categories
  const categories: Category[] = [
    { id: 'all', label: 'All', icon: '🌐' },
    { id: 'coding', label: 'Coding', icon: '💻' },
    { id: 'math', label: 'Math', icon: '🔢' },
    { id: 'logic', label: 'Logic', icon: '🧩' },
    { id: 'esl', label: 'ESL', icon: '🗣️' },
  ];
  
  // Initialize tab refs
  useEffect(() => {
    setTabRefs(new Array(categories.length).fill(null));
  }, [categories.length]);
  
  // Update underline position when active category changes
  useEffect(() => {
    const activeIndex = categories.findIndex(cat => cat.id === activeCategory);
    if (activeIndex >= 0 && tabRefs[activeIndex]) {
      const tab = tabRefs[activeIndex];
      if (tab) {
        const { offsetLeft, offsetWidth } = tab;
        setUnderlinePosition({ left: offsetLeft, width: offsetWidth });
      }
    }
  }, [activeCategory, tabRefs, categories]);
  
  // Handle tab click
  const handleTabClick = (category: string) => {
    setActiveCategory(category);
  };
  
  // Set tab ref
  const setTabRef = (index: number, ref: HTMLButtonElement | null) => {
    if (ref && !tabRefs[index]) {
      const newRefs = [...tabRefs];
      newRefs[index] = ref;
      setTabRefs(newRefs);
      
      // Initialize underline position if this is the active tab
      if (categories[index].id === activeCategory) {
        setUnderlinePosition({ left: ref.offsetLeft, width: ref.offsetWidth });
      }
    }
  };
  
  return (
    <div className="h-8 bg-background/80 border-b border-primary/20 relative">
      <div className="flex h-full">
        {categories.map((category, index) => (
          <button
            key={category.id}
            ref={ref => setTabRef(index, ref)}
            className={`px-4 h-full flex items-center justify-center font-pixel text-sm transition-colors duration-200 ${
              activeCategory === category.id ? 'text-primary' : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => handleTabClick(category.id)}
          >
            <span className="mr-1 text-xs">{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>
      
      {/* Animated underline */}
      <div 
        className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-in-out"
        style={{ 
          left: `${underlinePosition.left}px`, 
          width: `${underlinePosition.width}px` 
        }}
      ></div>
    </div>
  );
}
