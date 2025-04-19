'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import WorldMapGrid from '@/components/world-map/WorldMapGrid';
import WorldMapSidebar from '@/components/world-map/WorldMapSidebar';
import ParallaxBackground from '@/components/ParallaxBackground';
import LoadingScreen from '@/components/LoadingScreen';

export default function WorldMapPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [playerStats, setPlayerStats] = useState({
    level: 5,
    power: 120,
    xp: 4200,
    maxXp: 5000,
  });

  // Simulate loading assets with progress
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 500); // Show 'Ready!' for a moment
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden">
      {isLoading && <LoadingScreen progress={loadingProgress} />}
      
      {/* Parallax Background */}
      <ParallaxBackground />
      
      <div className="container mx-auto flex h-screen relative z-10">
        {/* Main World Map Grid */}
        <div className="flex-grow overflow-hidden">
          <WorldMapGrid />
        </div>
        
        {/* Right Sidebar */}
        <div className="w-52 bg-background/80 border-l-2 border-primary/30">
          <WorldMapSidebar playerStats={playerStats} />
        </div>
      </div>
      
      {/* Back Button */}
      <Link 
        href="/"
        className="absolute top-4 left-4 font-pixel py-2 px-4 text-sm border-2 border-primary bg-primary/20 text-primary hover:bg-primary/30 transition-all duration-200"
      >
        ← BACK
      </Link>
    </main>
  );
}
