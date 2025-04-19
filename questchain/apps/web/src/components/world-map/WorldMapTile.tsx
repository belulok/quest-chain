'use client';

import { useState, useEffect } from 'react';

interface BiomeProps {
  biome: any;
  isPlayerHere: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function WorldMapTile({ 
  biome, 
  isPlayerHere, 
  onClick, 
  onMouseEnter, 
  onMouseLeave 
}: BiomeProps) {
  const [pulseState, setPulseState] = useState(0);
  
  // Pulse animation for player marker
  useEffect(() => {
    if (isPlayerHere) {
      const interval = setInterval(() => {
        setPulseState(prev => (prev + 1) % 4);
      }, 250);
      
      return () => clearInterval(interval);
    }
  }, [isPlayerHere]);
  
  // If no biome data, render empty tile
  if (!biome) {
    return (
      <div className="w-16 h-16 bg-gray-800/30 rounded-md"></div>
    );
  }
  
  // Determine tile color based on biome type
  const getBiomeColor = () => {
    switch (biome.type) {
      case 'starter': return 'bg-green-700';
      case 'binary': return 'bg-blue-800';
      case 'algebra': return 'bg-purple-800';
      case 'crypto': return 'bg-yellow-700';
      case 'logic': return 'bg-red-800';
      case 'network': return 'bg-cyan-800';
      default: return 'bg-gray-700';
    }
  };
  
  // Determine fog overlay opacity
  const getFogOpacity = () => {
    if (biome.unlocked) return 0;
    return 0.6;
  };
  
  return (
    <div 
      className={`relative w-16 h-16 ${getBiomeColor()} rounded-md cursor-pointer transition-all duration-200 hover:scale-105 hover:brightness-110 border border-gray-700`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Fog of Ignorance Overlay */}
      <div 
        className="absolute inset-0 bg-black rounded-md transition-opacity duration-500"
        style={{ 
          opacity: getFogOpacity(),
          backgroundImage: biome.unlocked ? 'none' : 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAEklEQVQImWNgYGD4z4AE/gMADwMB/414xEUAAAAASUVORK5CYII=")',
          backgroundSize: '2px 2px'
        }}
      ></div>
      
      {/* Biome Icon/Symbol */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-pixel text-white text-2xl">
          {biome.type.charAt(0).toUpperCase()}
        </span>
      </div>
      
      {/* Player Marker */}
      {isPlayerHere && (
        <div className={`absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full border-2 border-white flex items-center justify-center animate-pulse`}>
          <div className={`w-6 h-6 rounded-full bg-primary-${pulseState * 100}`}></div>
        </div>
      )}
      
      {/* Completion Indicator */}
      {biome.completed && (
        <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border border-white"></div>
      )}
    </div>
  );
}
