'use client';

import { useState } from 'react';
import { useEnokiFlow } from '@mysten/enoki/react';
import {
  claimQuestXP,
  attackBoss,
  equipItem,
  openLootChest
} from '@/services/transactionService';
import clientConfig from '@/config/clientConfig';

export function useTransactions() {
  const enokiFlow = useEnokiFlow();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txDigest, setTxDigest] = useState<string | null>(null);

  const resetState = () => {
    setIsLoading(false);
    setError(null);
    setTxDigest(null);
  };

  const handleTransaction = async (
    txFunction: (signer: any, ...args: any[]) => Promise<string>,
    ...args: any[]
  ) => {
    resetState();
    setIsLoading(true);

    try {
      // Get the keypair from Enoki for signing transactions
      const signer = await enokiFlow.getKeypair({
        network: clientConfig.SUI_NETWORK_NAME,
      });

      if (!signer) {
        throw new Error('Wallet not connected');
      }

      // Use the signer's signTransaction method
      const signTransactionBlock = async (txBytes: Uint8Array) => {
        const signature = await signer.signTransaction(txBytes);
        return signature.signature;
      };

      const digest = await txFunction(signTransactionBlock, ...args);
      setTxDigest(digest);
      return digest;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const claimXP = async (avatarId: string, questId: string, xpAmount: number) => {
    return handleTransaction(claimQuestXP, avatarId, questId, xpAmount);
  };

  const attackRaidBoss = async (avatarId: string, bossId: string, damage: number) => {
    return handleTransaction(attackBoss, avatarId, bossId, damage);
  };

  const equip = async (avatarId: string, itemId: string) => {
    return handleTransaction(equipItem, avatarId, itemId);
  };

  const openChest = async (avatarId: string, chestId: string) => {
    return handleTransaction(openLootChest, avatarId, chestId);
  };

  return {
    claimXP,
    attackRaidBoss,
    equip,
    openChest,
    isLoading,
    error,
    txDigest,
    resetState,
  };
}
