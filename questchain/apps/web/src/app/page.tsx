'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import LoadingScreen from '@/components/LoadingScreen';
import { useCustomWallet } from '@/hooks/useCustomWallet';

// Import GameContainer with dynamic loading to prevent SSR issues with Phaser
const GameContainer = dynamic(
  () => import('@/components/GameContainer'),
  { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center">Loading game...</div> }
);

export default function Home() {
  const { isConnected, isConnecting } = useCustomWallet();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loginVisible, setLoginVisible] = useState(false);

  useEffect(() => {
    // Simulate loading assets with progress
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

  // Redirect to world map if already logged in
  useEffect(() => {
    if (isConnected) {
      router.push('/world-map');
    }
  }, [isConnected, router]);

  const handleStartClick = () => {
    setLoginVisible(true);
  };

  const handleLogin = (provider: 'google' | 'apple' | 'email') => {
    console.log(`Logging in with ${provider}`);
    // The actual login is handled in the LoginOptions component
    setLoginVisible(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between relative overflow-hidden">
      {isLoading && <LoadingScreen progress={loadingProgress} />}

      {/* Game Container */}
      <div className="w-full h-screen">
        <GameContainer className="w-full h-full" />
      </div>
    </main>
  );
}
