'use client';

import { useEffect } from 'react';
import { useCustomWallet } from '@/contexts/CustomWallet';

/**
 * WalletBridgeProvider
 *
 * This component injects the wallet functionality into the global window object
 * so that the Phaser game can access it.
 */
export function WalletBridgeProvider() {
  const { isConnected, address, login, logout } = useCustomWallet();

  useEffect(() => {
    // Log wallet status for debugging
    console.log('Wallet status in provider:', { isConnected, address });

    // Inject wallet functions into the global window object
    window.walletBridge = {
      isConnected,
      address,
      login: async () => {
        try {
          console.log('Initiating wallet login from bridge...');

          // Check if we're already connected
          if (isConnected && address) {
            console.log('Already connected, returning true');
            return true;
          }

          // Start the login process
          await login();

          // Wait a moment for the connection to be established
          // Increased timeout to give more time for the redirect and authentication
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Check if we're connected after login attempt
          const connected = !!window.walletBridge?.isConnected && !!window.walletBridge?.address;
          console.log('Login result:', { connected, address: window.walletBridge?.address });

          return connected;
        } catch (error) {
          console.error('Login failed:', error);
          return false;
        }
      },
      logout: async () => {
        try {
          console.log('Initiating wallet logout...');
          await logout();

          // Wait a moment for the disconnection to complete
          await new Promise(resolve => setTimeout(resolve, 500));

          // Verify we're disconnected
          const disconnected = !window.walletBridge?.isConnected;
          console.log('Logout result:', { disconnected });

          return disconnected;
        } catch (error) {
          console.error('Logout failed:', error);
          return false;
        }
      }
    };

    // Cleanup function
    return () => {
      delete window.walletBridge;
    };
  }, [isConnected, address, login, logout]);

  // This component doesn't render anything
  return null;
}

export default WalletBridgeProvider;
