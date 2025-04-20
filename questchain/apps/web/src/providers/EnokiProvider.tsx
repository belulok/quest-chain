'use client';

import { EnokiFlowProvider } from '@mysten/enoki/react';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import clientConfig from '@/config/clientConfig';
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { registerStashedWallet } from '@mysten/zksend';

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

// Register stashed wallet for zkLogin
registerStashedWallet("QuestChain Academy", {});

export function EnokiProvider({ children }: { children: ReactNode }) {
  const { networkConfig } = createNetworkConfig({
    devnet: { url: getFullnodeUrl("devnet") },
    testnet: { url: getFullnodeUrl("testnet") },
    mainnet: { url: getFullnodeUrl("mainnet") },
  });

  // Debug: Log the Enoki API key (partially masked for security)
  const apiKey = clientConfig.ENOKI_API_KEY;
  console.log('Enoki API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set');

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider
        networks={networkConfig}
        defaultNetwork={clientConfig.SUI_NETWORK_NAME}
      >
        <WalletProvider
          autoConnect
          stashedWallet={{
            name: "QuestChain Academy",
          }}
          storage={sessionStorageAdapter}
        >
          <EnokiFlowProvider apiKey="enoki_public_3724a62c6fd1a719bb4faf0ace29c7a9">
            {children}
          </EnokiFlowProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
