'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ParallaxBackground from '@/components/ParallaxBackground';
import PixelCharacter from '@/components/PixelCharacter';
import NavigationIcons from '@/components/NavigationIcons';
import LoadingScreen from '@/components/LoadingScreen';
import PixelButton from '@/components/PixelButton';
import LoginOptions from '@/components/LoginOptions';
import GameLogo from '@/components/GameLogo';
import GameFooter from '@/components/GameFooter';
import UserProfileButton from '@/components/UserProfileButton';
import { useCustomWallet } from '@/contexts/CustomWallet';

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
      {/* Parallax Background */}
      <ParallaxBackground />

      {/* Main Content */}
      <div className="container mx-auto flex flex-col items-center justify-center py-12 px-4 relative z-10">
        {/* User Profile Button (top right) */}
        <div className="absolute top-4 right-4">
          <UserProfileButton />
        </div>
        {/* Logo */}
        <GameLogo />

        {/* Buttons */}
        <div className="flex flex-col gap-4 mb-8 w-full max-w-xs">
          <PixelButton
            onClick={handleStartClick}
            fullWidth
            animate
          >
            START
          </PixelButton>

          <PixelButton
            variant="secondary"
            fullWidth
          >
            CONTINUE
          </PixelButton>
        </div>

        {/* Social Login Row (conditionally rendered) */}
        {loginVisible && (
          <div className="mb-8">
            <LoginOptions onLogin={handleLogin} />
          </div>
        )}

        {/* Character Display */}
        <div className="relative w-48 h-48 mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-float">
              <PixelCharacter />
            </div>
          </div>
        </div>

        {/* Navigation Icons */}
        <NavigationIcons />

        {/* Footer */}
        <GameFooter />
      </div>
    </main>
  );
}
