import { useState, useEffect } from 'react';
import { fetchContractInfo } from '@/utils/api';

interface ContractInfo {
  contractAddress: string;
  name: string;
  symbol: string;
  description?: string;
  image?: string;
  totalSupply?: number;
  maxSupply?: number;
  mintPrice?: string;
  creator?: string;
  chainId?: number;
  verified?: boolean;
  createdAt?: string;
  // VibeMarket specific fields
  tokenContract?: string;
  marketCap?: string;
  isGraduated?: boolean;
  isActive?: boolean;
  isVerifiedArtist?: boolean;
  // Status text from contract
  verificationStatus?: string;
  graduationStatus?: string;
  status?: string;
}

interface UseContractInfoState {
  data: ContractInfo | null;
  loading: boolean;
  error: string | null;
}

export function useContractInfo(contractAddress: `0x${string}` | null) {
  const [state, setState] = useState<UseContractInfoState>({
    data: null,
    loading: !!contractAddress,
    error: null,
  });

  useEffect(() => {
    if (!contractAddress) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    let aborted = false;
    const controller = new AbortController();

    const loadContractInfo = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const info = await fetchContractInfo(contractAddress);

        if (!aborted) {
          setState({ data: info, loading: false, error: null });
        }
      } catch (error) {
        if (!aborted) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to load contract info';
          setState({ data: null, loading: false, error: errorMessage });
        }
      }
    };

    loadContractInfo();

    return () => {
      aborted = true;
      controller.abort();
    };
  }, [contractAddress]);

  return state;
}