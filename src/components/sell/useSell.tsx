"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { CONTRACTS } from "@/utils/contracts";
import { boosterDropV2Abi } from "@/abi/IBoosterDropV2ABI";
import { boosterTokenV2Abi } from "@/abi/IBoosterTokenV2ABI";
import { formatEther } from "viem";

type SellStep = 'idle' | 'step1' | 'step2' | 'completed' | 'error';

/**
 * 2-step sell hook: NFT -> Tokens -> ETH
 */
export const useSell = () => {
  const { address } = useAccount();
  const [currentStep, setCurrentStep] = useState<SellStep>('idle');
  const [step1Hash, setStep1Hash] = useState<string | null>(null);
  const [step2Hash, setStep2Hash] = useState<string | null>(null);
  
  // Transaction handling
  const { writeContract, isPending, data: hash, error, reset: resetWrite } = useWriteContract();
  
  // Step 1 confirmation
  const { 
    isLoading: isStep1Confirming, 
    isSuccess: isStep1Success
  } = useWaitForTransactionReceipt({
    hash: currentStep === 'step1' ? hash : undefined,
  });
  
  // Step 2 confirmation
  const { 
    isLoading: isStep2Confirming, 
    isSuccess: isStep2Success
  } = useWaitForTransactionReceipt({
    hash: currentStep === 'step2' ? hash : undefined,
  });
  
  // Get token contract address
  const { data: tokenAddress } = useReadContract({
    address: CONTRACTS.GEO_ART,
    abi: boosterDropV2Abi,
    functionName: "boosterTokenAddress",
  });

  /**
   * Start 2-step sell process: NFT -> Tokens -> ETH
   */
  const sellNFT = async (tokenId: string) => {
    if (!address || !CONTRACTS.GEO_ART) {
      throw new Error("Wallet not connected or contract not available");
    }

    setCurrentStep('step1');
    
    try {
      // Step 1: NFT -> Tokens
      await writeContract({
        address: CONTRACTS.GEO_ART,
        abi: boosterDropV2Abi,
        functionName: "sellAndClaimOffer",
        args: [BigInt(tokenId)],
      });
    } catch (error) {
      setCurrentStep('error');
      throw error;
    }
  };
  
  /**
   * Execute step 2: Tokens -> ETH
   */
  const executeStep2 = async (tokenAmount: bigint) => {
    if (!address || !tokenAddress) {
      throw new Error("Missing requirements for step 2");
    }

    setCurrentStep('step2');
    
    try {
      // Calculate minimum payout (2% slippage)
      const minPayout = (tokenAmount * BigInt(98)) / BigInt(100);
      
      await writeContract({
        address: tokenAddress as `0x${string}`,
        abi: boosterTokenV2Abi,
        functionName: "sell",
        args: [tokenAmount, address, minPayout],
      });
    } catch (error) {
      setCurrentStep('error');
      throw error;
    }
  };

  // Handle step 1 completion
  useEffect(() => {
    if (isStep1Success && currentStep === 'step1' && hash) {
      setStep1Hash(hash);
    }
  }, [isStep1Success, currentStep, hash]);
  
  // Handle step 2 completion
  useEffect(() => {
    if (isStep2Success && currentStep === 'step2' && hash) {
      setStep2Hash(hash);
      setCurrentStep('completed');
    }
  }, [isStep2Success, currentStep, hash]);

  const reset = () => {
    setCurrentStep('idle');
    setStep1Hash(null);
    setStep2Hash(null);
    resetWrite();
  };
  
  const isLoading = isPending || isStep1Confirming || isStep2Confirming;
  const isCompleted = currentStep === 'completed';

  return {
    // Core functionality
    sellNFT,
    executeStep2,
    
    // States
    currentStep,
    isLoading,
    isCompleted,
    error,
    
    // Transaction hashes
    step1Hash,
    step2Hash,
    
    // Step status
    isStep1Success,
    isStep2Success,
    
    // Helper
    reset,
  };
};