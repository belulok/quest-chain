'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WorldMapTile from './WorldMapTile';

// Define biome types
type BiomeType = 'starter' | 'binary' | 'algebra' | 'crypto' | 'logic' | 'network';

interface Biome {
  id: string;
  name: string;
  type: BiomeType;
  requiredXp: number;
  unlocked: boolean;
  completed: boolean;
  x: number;
  y: number;
}

export default function WorldMapGrid() {
  const router = useRouter();
  const [biomes, setBiomes] = useState<Biome[]>([]);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [hoveredTile, setHoveredTile] = useState<Biome | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize biomes
  useEffect(() => {
    // This would come from the blockchain in a real implementation
    const initialBiomes: Biome[] = [
      { id: 'b1', name: 'Starter Green', type: 'starter', requiredXp: 0, unlocked: true, completed: true, x: 5, y: 4 },
      { id: 'b2', name: 'Binary Caves', type: 'binary', requiredXp: 1000, unlocked: true, completed: false, x: 6, y: 4 },
      { id: 'b3', name: 'Algebra Peaks', type: 'algebra', requiredXp: 2500, unlocked: true, completed: false, x: 7, y: 3 },
      { id: 'b4', name: 'Crypto Valley', type: 'crypto', requiredXp: 4000, unlocked: true, completed: false, x: 8, y: 3 },
      { id: 'b5', name: 'Logic Forest', type: 'logic', requiredXp: 6000, unlocked: false, completed: false, x: 7, y: 5 },
      { id: 'b6', name: 'Network Nexus', type: 'network', requiredXp: 8000, unlocked: false, completed: false, x: 9, y: 4 },
    ];

    setBiomes(initialBiomes);

    // Set player position to the starter biome
    const starterBiome = initialBiomes.find(b => b.type === 'starter');
    if (starterBiome) {
      setPlayerPosition({ x: starterBiome.x, y: starterBiome.y });
    }

    // Animate tiles in with staggered delay
    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
          setPlayerPosition(prev => ({ ...prev, y: Math.max(0, prev.y - 1) }));
          break;
        case 'a':
          setPlayerPosition(prev => ({ ...prev, x: Math.max(0, prev.x - 1) }));
          break;
        case 's':
          setPlayerPosition(prev => ({ ...prev, y: Math.min(7, prev.y + 1) }));
          break;
        case 'd':
          setPlayerPosition(prev => ({ ...prev, x: Math.min(11, prev.x + 1) }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTileClick = (biome: Biome) => {
    if (biome.unlocked) {
      console.log(`Navigating to biome: ${biome.name}`);
      // Navigate to the challenge room
      router.push(`/challenge-room/${biome.id}`);

      // Store last biome ID in localStorage
      localStorage.setItem('lastBiomeId', biome.id);
    } else {
      console.log(`Biome ${biome.name} is locked. Required XP: ${biome.requiredXp}`);
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="grid grid-cols-12 grid-rows-8 gap-1 p-4">
        {/* Generate a 12x8 grid */}
        {Array.from({ length: 8 }).map((_, rowIndex) => (
          Array.from({ length: 12 }).map((_, colIndex) => {
            const biome = biomes.find(b => b.x === colIndex && b.y === rowIndex);
            const isPlayerHere = playerPosition.x === colIndex && playerPosition.y === rowIndex;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`transition-all duration-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{
                  transitionDelay: `${(rowIndex * 12 + colIndex) * 60}ms`,
                }}
              >
                <WorldMapTile
                  biome={biome}
                  isPlayerHere={isPlayerHere}
                  onClick={() => biome && handleTileClick(biome)}
                  onMouseEnter={() => biome && setHoveredTile(biome)}
                  onMouseLeave={() => setHoveredTile(null)}
                />
              </div>
            );
          })
        ))}
      </div>

      {/* Tooltip */}
      {hoveredTile && (
        <div
          className="absolute bg-background/90 border border-primary/50 p-2 rounded-md font-pixel text-sm text-white z-10"
          style={{
            top: `${hoveredTile.y * 68 + 120}px`,
            left: `${hoveredTile.x * 68 + 120}px`,
          }}
        >
          <p className="text-primary">{hoveredTile.name}</p>
          <p className="text-xs">Required XP: {hoveredTile.requiredXp}</p>
          <p className="text-xs">{hoveredTile.unlocked ? 'Unlocked' : 'Locked'}</p>
        </div>
      )}
    </div>
  );
}
