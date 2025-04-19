'use client';

import { TransactionBlock } from '@mysten/sui/transactions';

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
export async function sponsorTransaction(txb: TransactionBlock): Promise<SponsorResponse> {
  try {
    // Serialize the transaction
    const txBytes = await txb.build({ 
      onlyTransactionKind: true,
      // We're using devnet for now
      client: { 
        url: 'https://fullnode.devnet.sui.io:443'
      }
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
