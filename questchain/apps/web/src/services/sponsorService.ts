'use client';

import { Transaction } from '@mysten/sui/transactions';
import { SuiClient } from '@mysten/sui/client';
import clientConfig from '@/config/clientConfig';

// Create a Sui client for building transactions
const suiClient = new SuiClient({ url: clientConfig.SUI_NETWORK });

interface SponsorResponse {
  txBytes: string;
  signature: string;
  expireAtTime: number;
}

/**
 * Sponsors a transaction by sending it to the sponsorship API
 * @param txb The transaction block to sponsor
 * @returns The sponsored transaction data
 */
export async function sponsorTransaction(txb: Transaction): Promise<SponsorResponse> {
  try {
    // Serialize the transaction
    const txBytes = await txb.build({
      client: suiClient,
      onlyTransactionKind: true,
    });

    // Send to our sponsorship API
    const response = await fetch('/api/sponsor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        txBytes: Buffer.from(txBytes).toString('base64'),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Sponsorship failed: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sponsoring transaction:', error);
    throw error;
  }
}
