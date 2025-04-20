'use client';

import { useEnokiFlow, useZkLogin, useZkLoginSession } from '@mysten/enoki/react';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import clientConfig from '@/config/clientConfig';

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
  const { address: zkLoginAddress } = useZkLogin();
  const zkLoginSession = useZkLoginSession();
  const enokiFlow = useEnokiFlow();
  const router = useRouter();

  const [isConnecting, setIsConnecting] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    name?: string;
    email?: string;
    picture?: string;
  } | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const isConnected = !!zkLoginAddress;
  const address = zkLoginAddress || null;

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized && isConnected) {
      // Redirect to world map if logged in
      router.push('/world-map');
    }
  }, [isInitialized, isConnected, router]);

  // Extract user info from JWT when session changes
  useEffect(() => {
    if (zkLoginSession?.jwt) {
      try {
        const decoded = jwtDecode(zkLoginSession.jwt);
        setUserInfo({
          name: (decoded as any).name,
          email: (decoded as any).email,
          picture: (decoded as any).picture
        });
      } catch (error) {
        console.error('Failed to decode JWT:', error);
      }
    } else {
      setUserInfo(null);
    }
  }, [zkLoginSession]);

  const login = async () => {
    try {
      setIsConnecting(true);

      // Check if we're already connected
      if (isConnected && zkLoginAddress) {
        console.log('Already connected with address:', zkLoginAddress);
        return;
      }

      console.log('Starting login process with Enoki...');
      console.log('Network:', clientConfig.SUI_NETWORK_NAME);
      console.log('Client ID:', clientConfig.GOOGLE_CLIENT_ID);

      const protocol = window.location.protocol;
      const host = window.location.host;
      const customRedirectUri = `${protocol}//${host}/auth`;
      console.log('Redirect URI:', customRedirectUri);

      // Clear any previous session data
      sessionStorage.removeItem('enoki-flow-session');

      const authUrl = await enokiFlow.createAuthorizationURL({
        provider: "google",
        network: clientConfig.SUI_NETWORK_NAME,
        clientId: clientConfig.GOOGLE_CLIENT_ID,
        redirectUrl: customRedirectUri,
        extraParams: {
          scope: ["openid", "email", "profile"],
          // Add a random state parameter to prevent CSRF attacks and cache issues
          state: Math.random().toString(36).substring(2, 15),
        },
      });

      console.log('Auth URL created, redirecting...');
      router.push(authUrl);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const logout = async () => {
    try {
      await enokiFlow.logout();
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
