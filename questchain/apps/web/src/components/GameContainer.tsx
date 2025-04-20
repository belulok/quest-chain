'use client';

import React, { useEffect, useRef } from 'react';
import { useCustomWallet } from '@/contexts/CustomWallet';
import dynamic from 'next/dynamic';
import WalletBridgeProvider from './WalletBridgeProvider';

// Create a client-side only component for Phaser
const PhaserGame = dynamic(
  () => import('../game/PhaserGameComponent'),
  { ssr: false }
);

interface GameContainerProps {
  className?: string;
}

export default function GameContainer({ className = '' }: GameContainerProps) {
  const { isConnected } = useCustomWallet();

  return (
    <div
      className={`w-full h-full ${className}`}
      style={{ minHeight: '600px' }}
    >
      {/* Inject the wallet bridge into the window object */}
      <WalletBridgeProvider />

      {/* Render the Phaser game */}
      <PhaserGame isConnected={isConnected} />
    </div>
  );
}
