import { useMemo } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { vibeMarketProxyAbi } from '@/abi/vibeMarketProxyABI';
import { geoPackWrapperAbi, GEOPACK_WRAPPER_ADDRESS } from '@/abi/GeoPackWrapperABI';
import { formatEther, encodeFunctionData } from 'viem';
import { VIBE_CONFIG, generateContractConfig, type ContractConfig } from '@/constants/vibeConfig';

// Same interfaces as original hook
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

export function useVibeWrapperDeployment() {
  const { address } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();

  // Single contract read for fee (KISS: minimal API calls)
  const { data: contractFee } = useReadContract({
    address: GEOPACK_WRAPPER_ADDRESS,
    abi: geoPackWrapperAbi,
    functionName: 'fee'
  });

  // Memoized fee conversion (performance optimization)
  const feeInEth = useMemo(() =>
    contractFee ? formatEther(contractFee) : '0',
    [contractFee]
  );

  const deployCollection = async (
    draftId: string,
    metadata: CollectionMetadata,
    slug?: string,
    contractConfig?: ContractConfig
  ): Promise<DeploymentResult> => {
    // KISS: Fail fast validation
    if (!contractFee) {
      throw new Error(`GeoPack Manager fee unavailable (${feeInEth} ETH required)`);
    }

    try {
      // Generate contract configuration (same as original)
      const finalOwnerAddress = metadata.owner || address;
      const finalTokenSymbol = metadata.symbol;
      const packName = metadata.name;
      const packAmount = metadata.packAmount;

      const customConfig = contractConfig || generateContractConfig(slug || metadata.slug);

      // Encode VibeMarket call (same as original hook)
      const vibeMarketCalldata = encodeFunctionData({
        abi: vibeMarketProxyAbi,
        functionName: 'createDropWithConfig',
        args: [
          packName,
          finalTokenSymbol,
          packName,
          finalTokenSymbol,
          finalOwnerAddress as `0x${string}`,
          BigInt(packAmount),
          customConfig,
        ]
      });

      // Single wrapper call (replaces direct VibeMarket call)
      const txHash = await writeContractAsync({
        address: GEOPACK_WRAPPER_ADDRESS,
        abi: geoPackWrapperAbi,
        functionName: 'deploy',
        args: [vibeMarketCalldata],
        value: contractFee,
        gas: VIBE_CONFIG.CONTRACT.GAS_LIMIT
      });

      return {
        success: true,
        txHash,
        dropContract: undefined, // Will be extracted from transaction receipt
        tokenContract: undefined, // Will be extracted from transaction receipt
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Deployment failed';

      return {
        success: false,
        error: errorMessage
      };
    }
  };

  return {
    deployCollection,
    isDeploying: isPending,
    contractFee: feeInEth, // Current fee from contract
    // Remove unnecessary exposed values for KISS
  };
}