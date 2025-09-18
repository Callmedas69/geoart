import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { vibeMarketProxyAbi, VIBEMARKET_PROXY_ADDRESS } from '@/abi/vibeMarketProxyABI';
import { parseEther } from 'viem';
import { usePublicClient } from 'wagmi';
import { VIBE_CONFIG, generateContractConfig, type ContractConfig } from '@/constants/vibeConfig';

export interface CollectionMetadata {
  name: string;
  symbol: string;
  description: string;
  creator: string;
  slug: string;
  featuredImageUrl?: string;
  bgColor?: string;
  disableFoil?: boolean;
  disableWear?: boolean;
  isNSFW?: boolean;
  twitterLink?: string;
  websiteLink?: string;
  packAmount: number; // Number of packs to purchase on deployment
  owner?: string; // Optional custom owner address
  metadataItems: Array<{
    name: string;
    description: string;
    imageUrl: string;
    rarity: string;
  }>;
}

export interface DeploymentResult {
  success: boolean;
  txHash?: string;
  dropContract?: string;
  tokenContract?: string;
  error?: string;
}

interface DeploymentProgress {
  step: 'preparing' | 'signing' | 'deploying' | 'confirming' | 'complete' | 'deployed' | 'error';
  message: string;
  progress: number;
}

export function useVibeContractDeployment() {
  const { address } = useAccount();
  const { writeContractAsync, data: hash, error: writeError, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, data: txReceipt } = useWaitForTransactionReceipt({ hash });
  const publicClient = usePublicClient();
  
  const [deploymentState, setDeploymentState] = useState<{
    progress: DeploymentProgress;
    result: DeploymentResult | null;
  }>({
    progress: { step: 'preparing', message: 'Ready to deploy', progress: 0 },
    result: null
  });


  // Extract contract addresses from transaction logs
  const extractContractAddresses = async (txHash: string) => {
    try {
      if (!publicClient) return { dropContract: '', tokenContract: '' };
      
      const receipt = await publicClient.getTransactionReceipt({ hash: txHash as `0x${string}` });
      
      let dropContract = '';
      let tokenContract = '';
      
      // Parse logs for DropCreated event from factory contract
      for (const log of receipt.logs) {
        try {
          // Check if log is from our proxy contract
          if (log.address.toLowerCase() === VIBEMARKET_PROXY_ADDRESS.toLowerCase()) {
            // DropCreated event has drop and token addresses as indexed parameters
            // topics[1] = drop contract, topics[2] = token contract, topics[3] = owner
            if (log.topics.length >= 3) {
              dropContract = `0x${log.topics[1]?.slice(-40)}` || '';
              tokenContract = `0x${log.topics[2]?.slice(-40)}` || '';
              break;
            }
          }
        } catch (error) {
          // Silently continue parsing other logs
        }
      }
      
      return { dropContract, tokenContract };
    } catch (error) {
      // Return empty addresses on extraction failure
      return { dropContract: '', tokenContract: '' };
    }
  };

  const deployCollection = async (
    draftId: string,
    metadata: CollectionMetadata,
    slug?: string,
    contractConfig?: ContractConfig
  ): Promise<DeploymentResult> => {
    if (!address) {
      const error = 'Wallet not connected';
      setDeploymentState({
        progress: { step: 'error', message: error, progress: 0 },
        result: { success: false, error }
      });
      return { success: false, error };
    }

    try {
      setDeploymentState({
        progress: { step: 'preparing', message: 'Preparing contract parameters...', progress: 10 },
        result: null
      });

      // Validate required parameters
      if (!metadata.name || !metadata.symbol) {
        throw new Error('Collection name and symbol are required');
      }
      
      if (!metadata.metadataItems || metadata.metadataItems.length < VIBE_CONFIG.VALIDATION.MIN_METADATA_ITEMS) {
        throw new Error('At least one metadata item is required');
      }
      
      if (!draftId || draftId.length < VIBE_CONFIG.VALIDATION.MIN_DRAFT_ID_LENGTH) {
        throw new Error('Valid draft ID is required');
      }


      // createDropWithConfig parameters matching DEV_CONVERSATION.md
      const packName = metadata.name; // tokenName
      const finalTokenSymbol = metadata.symbol; // tokenSymbol and nftSymbol
      const finalOwnerAddress = (metadata.owner && metadata.owner.trim() ? metadata.owner : address) as `0x${string}`; // owner
      const packAmount = BigInt(metadata.packAmount); // amount of packs to purchase
      
      // Use config from Vibe API response or fallback to default config
      const customConfig = contractConfig || generateContractConfig(slug || metadata.slug);

      // Call proxy contract to create drop with config
      const tx = await writeContractAsync({
        address: VIBEMARKET_PROXY_ADDRESS,
        abi: vibeMarketProxyAbi,
        functionName: 'createDropWithConfig',
        args: [
          packName, // tokenName
          finalTokenSymbol, // tokenSymbol
          packName, // nftName
          finalTokenSymbol, // nftSymbol
          finalOwnerAddress, // owner (custom or connected wallet)
          packAmount, // amount of packs to purchase - use passed value
          customConfig,
        ],
        value: parseEther('0'), // only Send ETH if buying packs
        gas: VIBE_CONFIG.CONTRACT.GAS_LIMIT
      });

      setDeploymentState({
        progress: { step: 'deploying', message: 'Transaction submitted, deploying contract...', progress: 50 },
        result: null
      });

      // Wait for transaction confirmation
      setDeploymentState({
        progress: { step: 'confirming', message: 'Waiting for blockchain confirmation...', progress: 80 },
        result: null
      });

      const receipt = await publicClient?.waitForTransactionReceipt({ hash: tx });
      
      if (receipt?.status === 'success') {
        
        // Extract contract addresses from transaction receipt
        const contracts = await extractContractAddresses(tx);
        
        setDeploymentState({
          progress: { step: 'deployed', message: 'Collection deployed successfully!', progress: 100 },
          result: {
            success: true,
            txHash: tx,
            dropContract: contracts.dropContract,
            tokenContract: contracts.tokenContract
          }
        });
        
        return {
          success: true,
          txHash: tx,
          dropContract: contracts.dropContract,
          tokenContract: contracts.tokenContract
        };
      } else {
        throw new Error('Transaction was reverted by the blockchain');
      }


    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Deployment failed';
      const result = { success: false, error: errorMessage };
      setDeploymentState({
        progress: { step: 'error', message: errorMessage, progress: 0 },
        result
      });
      return result;
    }
  };

  return {
    deployCollection,
    isDeploying: isPending || isConfirming,
    deploymentProgress: deploymentState.progress,
    deploymentResult: deploymentState.result,
    reset: () => setDeploymentState({
      progress: { step: 'preparing', message: 'Ready to deploy', progress: 0 },
      result: null
    })
  };
}