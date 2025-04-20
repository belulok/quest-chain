/**
 * WalletBridge.ts
 *
 * This file provides a bridge between the Phaser game and the React app's wallet functionality.
 * It exposes methods to interact with the wallet from the game context.
 */

// Define the interface for wallet functions that will be injected from React
export interface WalletBridgeInterface {
  isConnected: boolean;
  address: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

// Create a global object to store the wallet functions
declare global {
  interface Window {
    walletBridge?: WalletBridgeInterface;
  }
}

// Helper functions to interact with the wallet bridge
export const isWalletConnected = (): boolean => {
  // Check if the wallet bridge exists and is connected
  if (!window.walletBridge) return false;

  // Check if we have both isConnected flag and a valid address
  const hasValidConnection = window.walletBridge.isConnected && !!window.walletBridge.address;

  // Log the connection status for debugging
  console.log('Wallet connection status:', {
    isConnected: window.walletBridge.isConnected,
    address: window.walletBridge.address,
    hasValidConnection
  });

  return hasValidConnection;
};

export const getWalletAddress = (): string | null => {
  // Check if the wallet bridge exists and has an address
  if (!window.walletBridge || !window.walletBridge.address) {
    return null;
  }

  // Ensure the address is a valid string
  const address = window.walletBridge.address;
  if (typeof address !== 'string' || address.trim() === '') {
    console.warn('Invalid wallet address:', address);
    return null;
  }

  return address;
};

export const connectWallet = async (): Promise<{success: boolean; error?: string}> => {
  try {
    // Check if the wallet bridge exists and has a login function
    if (!window.walletBridge?.login) {
      console.error('Wallet bridge not available or login function missing');
      return { success: false, error: 'Wallet connection not available' };
    }

    // Attempt to login
    console.log('Initiating wallet connection...');
    await window.walletBridge.login();

    // Wait a moment for the connection to be established
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify the connection was successful
    const connected = isWalletConnected();
    console.log('Wallet connection attempt result:', { connected });

    if (!connected) {
      return {
        success: false,
        error: 'Connection failed. Please try again.'
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error connecting wallet:', error);
    let errorMessage = 'Unknown connection error';

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    return { success: false, error: errorMessage };
  }
};

export const disconnectWallet = async (): Promise<boolean> => {
  try {
    if (window.walletBridge?.logout) {
      await window.walletBridge.logout();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error disconnecting wallet:', error);
    return false;
  }
};

// Function to format wallet address for display
export const formatAddress = (address: string | null): string => {
  if (!address) return 'Not Connected';

  if (address.length > 10) {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }

  return address;
};
