'use client';

import { TransactionBlock } from '@mysten/sui/transactions';
import { SuiClient } from '@mysten/sui/client';
import { sponsorTransaction } from './sponsorService';
import clientConfig from '@/config/clientConfig';

// Create a Sui client
const suiClient = new SuiClient({ url: clientConfig.SUI_NETWORK });

/**
 * Executes a transaction with gas sponsorship
 * @param txb The transaction block to execute
 * @param signer The signer function to sign the transaction
 * @returns The transaction digest
 */
export async function executeTransaction(
  txb: TransactionBlock,
  signer: (txb: Uint8Array) => Promise<Uint8Array>
): Promise<string> {
  try {
    // Sponsor the transaction
    const { txBytes, signature } = await sponsorTransaction(txb);

    // Convert base64 string to Uint8Array
    const txBytesArray = Uint8Array.from(Buffer.from(txBytes, 'base64'));
    
    // Sign the transaction with the user's signer
    const userSignature = await signer(txBytesArray);

    // Execute the transaction with both signatures
    const result = await suiClient.executeTransactionBlock({
      transactionBlock: txBytes,
      signatures: [signature, userSignature],
    });

    return result.digest;
  } catch (error) {
    console.error('Error executing transaction:', error);
    throw error;
  }
}

/**
 * Claims XP for completing a quest
 * @param signer The signer function
 * @param avatarId The avatar object ID
 * @param questId The quest object ID
 * @param xpAmount The amount of XP to claim
 * @returns The transaction digest
 */
export async function claimQuestXP(
  signer: (txb: Uint8Array) => Promise<Uint8Array>,
  avatarId: string,
  questId: string,
  xpAmount: number
): Promise<string> {
  const packageId = clientConfig.PACKAGE_ID;
  if (!packageId) {
    throw new Error('Package ID not configured');
  }

  const txb = new TransactionBlock();
  
  // Call the claim_quest_xp function from the questchain module
  txb.moveCall({
    target: `${packageId}::questchain::claim_quest_xp`,
    arguments: [
      txb.object(avatarId),
      txb.object(questId),
      txb.pure(xpAmount),
    ],
  });

  return executeTransaction(txb, signer);
}

/**
 * Attacks a boss in a raid
 * @param signer The signer function
 * @param avatarId The avatar object ID
 * @param bossId The boss object ID
 * @param damage The amount of damage to deal
 * @returns The transaction digest
 */
export async function attackBoss(
  signer: (txb: Uint8Array) => Promise<Uint8Array>,
  avatarId: string,
  bossId: string,
  damage: number
): Promise<string> {
  const packageId = clientConfig.PACKAGE_ID;
  if (!packageId) {
    throw new Error('Package ID not configured');
  }

  const txb = new TransactionBlock();
  
  // Call the attack_boss function from the questchain module
  txb.moveCall({
    target: `${packageId}::questchain::attack_boss`,
    arguments: [
      txb.object(avatarId),
      txb.object(bossId),
      txb.pure(damage),
    ],
  });

  return executeTransaction(txb, signer);
}

/**
 * Equips an item to an avatar
 * @param signer The signer function
 * @param avatarId The avatar object ID
 * @param itemId The item object ID
 * @returns The transaction digest
 */
export async function equipItem(
  signer: (txb: Uint8Array) => Promise<Uint8Array>,
  avatarId: string,
  itemId: string
): Promise<string> {
  const packageId = clientConfig.PACKAGE_ID;
  if (!packageId) {
    throw new Error('Package ID not configured');
  }

  const txb = new TransactionBlock();
  
  // Call the equip function from the questchain module
  txb.moveCall({
    target: `${packageId}::questchain::equip`,
    arguments: [
      txb.object(avatarId),
      txb.object(itemId),
    ],
  });

  return executeTransaction(txb, signer);
}

/**
 * Opens a loot chest
 * @param signer The signer function
 * @param avatarId The avatar object ID
 * @param chestId The chest object ID
 * @returns The transaction digest
 */
export async function openLootChest(
  signer: (txb: Uint8Array) => Promise<Uint8Array>,
  avatarId: string,
  chestId: string
): Promise<string> {
  const packageId = clientConfig.PACKAGE_ID;
  if (!packageId) {
    throw new Error('Package ID not configured');
  }

  const txb = new TransactionBlock();
  
  // Call the open_chest function from the questchain module
  txb.moveCall({
    target: `${packageId}::questchain::open_chest`,
    arguments: [
      txb.object(avatarId),
      txb.object(chestId),
    ],
  });

  return executeTransaction(txb, signer);
}
