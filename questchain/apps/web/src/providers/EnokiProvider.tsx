'use client';

import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import clientConfig from '@/config/clientConfig';
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';

const queryClient = new QueryClient();

// Storage adapter for session storage
const sessionStorageAdapter = {
  getItem: async (key: string) => {
    return sessionStorage.getItem(key);
  },
  setItem: async (key: string, value: string) => {
    sessionStorage.setItem(key, value);
  },
  removeItem: async (key: string) => {
    sessionStorage.removeItem(key);
  },
};

// Renamed to MockWalletProvider since we're bypassing zkLogin
export function EnokiProvider({ children }: { children: ReactNode }) {
  const { networkConfig } = createNetworkConfig({
    devnet: { url: getFullnodeUrl("devnet") },
    testnet: { url: getFullnodeUrl("testnet") },
    mainnet: { url: getFullnodeUrl("mainnet") },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider
        networks={networkConfig}
        defaultNetwork={clientConfig.SUI_NETWORK_NAME}
      >
        <WalletProvider
          autoConnect
          storage={sessionStorageAdapter}
        >
          {children}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
