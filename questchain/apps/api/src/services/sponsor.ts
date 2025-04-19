import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SuiClient } from '@mysten/sui.js/client';

// Initialize Sui client
const suiClient = new SuiClient({
  url: process.env.SUI_RPC_URL || 'https://fullnode.devnet.sui.io:443',
});

// Get sponsor key from environment
const getSponsorKeypair = (): Ed25519Keypair => {
  const privateKey = process.env.SUI_SPONSOR_PRIVATE_KEY;
  
  if (!privateKey) {
    throw new Error('SUI_SPONSOR_PRIVATE_KEY environment variable is not set');
  }
  
  return Ed25519Keypair.fromSecretKey(
    Buffer.from(privateKey.replace('0x', ''), 'hex')
  );
};

/**
 * Sponsors a transaction by:
 * 1. Deserializing the transaction bytes
 * 2. Setting the gas owner to the sponsor
 * 3. Signing the transaction with the sponsor's key
 * 4. Returning the sponsored transaction bytes
 */
export async function sponsorTransaction(
  txBytes: string,
  sender: string
): Promise<string> {
  try {
    // Get sponsor keypair
    const sponsorKeypair = getSponsorKeypair();
    const sponsorAddress = sponsorKeypair.toSuiAddress();
    
    // Deserialize the transaction
    const txBlock = TransactionBlock.from(txBytes);
    
    // Set the gas owner to the sponsor
    txBlock.setSender(sender);
    txBlock.setGasOwner(sponsorAddress);
    
    // Get gas budget
    const { effects } = await suiClient.dryRunTransactionBlock({
      transactionBlock: txBlock,
    });
    
    // Add 10% buffer to gas budget
    const gasUsed = BigInt(effects.gasUsed.computationCost) + 
                   BigInt(effects.gasUsed.storageCost) - 
                   BigInt(effects.gasUsed.storageRebate);
    
    const gasBudget = (gasUsed * BigInt(110)) / BigInt(100);
    txBlock.setGasBudget(gasBudget);
    
    // Build and sign the transaction
    const { bytes } = await txBlock.build({ client: suiClient });
    const sponsoredTxBytes = await txBlock.sign({ client: suiClient, signer: sponsorKeypair });
    
    return sponsoredTxBytes.bytes;
  } catch (error) {
    console.error('Error sponsoring transaction:', error);
    throw new Error(`Failed to sponsor transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
