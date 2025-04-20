'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface CustomWalletContextType {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  userInfo: {
    name?: string;
    email?: string;
    picture?: string;
  } | null;
}

const CustomWalletContext = createContext<CustomWalletContextType>({
  isConnected: false,
  isConnecting: false,
  address: null,
  login: async () => {},
  logout: async () => {},
  userInfo: null,
});

export function CustomWalletProvider({ children }: { children: ReactNode }) {
  // Bypass zkLogin and use a mock wallet instead
  const router = useRouter();

  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{
    name?: string;
    email?: string;
    picture?: string;
  } | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized && isConnected) {
      // Redirect to world map if logged in
      router.push('/world-map');
    }
  }, [isInitialized, isConnected, router]);

  // Set mock user info when connected
  useEffect(() => {
    if (isConnected && address) {
      setUserInfo({
        name: 'QuestChain Player',
        email: 'player@questchain.academy',
        picture: '/assets/QuestChain Assets/human.png'
      });
    } else {
      setUserInfo(null);
    }
  }, [isConnected, address]);

  const login = async () => {
    try {
      setIsConnecting(true);

      // Check if we're already connected
      if (isConnected && address) {
        console.log('Already connected with address:', address);
        return;
      }

      console.log('Starting mock wallet login process...');

      // Generate a mock Sui address
      const mockAddress = '0x' + Array.from({length: 64}, () =>
        Math.floor(Math.random() * 16).toString(16)).join('');

      // Set connected state
      setIsConnected(true);
      setAddress(mockAddress);

      console.log('Mock wallet connected with address:', mockAddress);

      // No need to redirect for mock wallet
      // Just simulate a successful connection

      return;
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out mock wallet...');
      setIsConnected(false);
      setAddress(null);
      setUserInfo(null);
      sessionStorage.clear();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <CustomWalletContext.Provider
      value={{
        isConnected,
        isConnecting,
        address,
        login,
        logout,
        userInfo
      }}
    >
      {children}
    </CustomWalletContext.Provider>
  );
}

export function useCustomWallet() {
  return useContext(CustomWalletContext);
}
