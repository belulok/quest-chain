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

      const protocol = window.location.protocol;
      const host = window.location.host;
      const customRedirectUri = `${protocol}//${host}/auth`;

      const authUrl = await enokiFlow.createAuthorizationURL({
        provider: "google",
        network: clientConfig.SUI_NETWORK_NAME,
        clientId: clientConfig.GOOGLE_CLIENT_ID,
        redirectUrl: customRedirectUri,
        extraParams: {
          scope: ["openid", "email", "profile"],
        },
      });

      router.push(authUrl);
    } catch (error) {
      console.error('Login failed:', error);
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
