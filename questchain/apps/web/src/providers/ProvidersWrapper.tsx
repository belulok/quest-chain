'use client';

import { ReactNode } from 'react';
import { EnokiProvider } from './EnokiProvider';
import { CustomWalletProvider } from '@/contexts/CustomWallet';
import KeyboardShortcuts from '@/components/KeyboardShortcuts';

export function ProvidersWrapper({ children }: { children: ReactNode }) {
  return (
    <EnokiProvider>
      <CustomWalletProvider>
        <KeyboardShortcuts />
        {children}
      </CustomWalletProvider>
    </EnokiProvider>
  );
}
