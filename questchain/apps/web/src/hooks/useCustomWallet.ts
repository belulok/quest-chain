'use client';

import { useState, useEffect } from 'react';

// Create a simple mock implementation for development
export function useCustomWallet() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Connect function - simulates wallet connection
  const connect = async () => {
    setIsConnecting(true);

    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 500));

    setIsConnecting(false);
    setIsConnected(true);
    setWalletAddress('0x1234...5678'); // Mock address

    return true;
  };

  // Disconnect function - simulates wallet disconnection
  const disconnect = async () => {
    setIsConnected(false);
    setWalletAddress(null);
    return true;
  };

  return {
    isConnected,
    isConnecting,
    walletAddress,
    connect,
    disconnect
  };
}
