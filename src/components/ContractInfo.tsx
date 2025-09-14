"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { fetchContractInfo, fetchETHPrice } from "@/utils/api";
import { CONTRACTS } from "@/utils/contracts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useReadContract } from "wagmi";
import { boosterDropV2Abi } from "@/abi/IBoosterDropV2ABI";
import { formatEther } from "viem";

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

export function ContractInfo() {
  const [contractInfo, setContractInfo] = useState<ContractInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ethPrice, setEthPrice] = useState<number>(0);

  // Get real pack price from contract
  const { data: mintPrice } = useReadContract({
    address: CONTRACTS.GEO_ART,
    abi: boosterDropV2Abi,
    functionName: "getMintPrice",
    args: [BigInt(1)],
  });

  // Memoize address slicing to avoid recalculation on re-renders
  const addressDisplay = useMemo(() => {
    if (!contractInfo) return null;

    return {
      nftContract: `${contractInfo.contractAddress.slice(
        0,
        6
      )}...${contractInfo.contractAddress.slice(-4)}`,
      tokenContract: contractInfo.tokenContract
        ? `${contractInfo.tokenContract.slice(
            0,
            6
          )}...${contractInfo.tokenContract.slice(-4)}`
        : null,
      creator: contractInfo.creator
        ? `${contractInfo.creator.slice(0, 6)}...${contractInfo.creator.slice(
            -4
          )}`
        : null,
    };
  }, [
    contractInfo?.contractAddress,
    contractInfo?.tokenContract,
    contractInfo?.creator,
  ]);

  useEffect(() => {
    const loadContractInfo = async () => {
      if (!CONTRACTS.GEO_ART) return;

      setIsLoading(true);
      try {
        const info = await fetchContractInfo(CONTRACTS.GEO_ART);
        setContractInfo(info);
      } catch (error) {
        console.error("Failed to load contract info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContractInfo();
  }, []);

  useEffect(() => {
    const loadEthPrice = async () => {
      const price = await fetchETHPrice();
      setEthPrice(price);
    };

    loadEthPrice();
    const interval = setInterval(loadEthPrice, 300000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <section className="py-12 bg-slate-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 text-sm font-medium font-body text-slate-900">
              Loading contract info...
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!contractInfo) {
    return null;
  }

  return (
    <section className="py-12 bg-slate-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <Card className="mx-auto max-w-4xl">
          <CardHeader className="text-center">
            <div className="flex gap-4 justify-center items-center mb-4">
              {contractInfo.image && (
                <img
                  src={contractInfo.image}
                  alt={contractInfo.name}
                  className="object-cover w-16 h-full border-1 border-border"
                />
              )}
              <div>
                <CardTitle className="text-3xl md:text-4xl font-heading text-slate-900">
                  {contractInfo.name}
                </CardTitle>
                <div className="flex gap-2 justify-center items-center mt-2 text-xs md:text-sm">
                  <Badge variant="secondary" className="font-mono">
                    ${contractInfo.symbol}
                  </Badge>
                  <Badge
                    variant={contractInfo.verified ? "default" : "outline"}
                    className={`${
                      contractInfo.verified
                        ? "bg-green-100 text-green-700 border-green-300"
                        : ""
                    }`}
                  >
                    {contractInfo.verificationStatus ||
                      (contractInfo.verified ? "✓ Verified" : "Unverified")}
                  </Badge>
                  {contractInfo.graduationStatus && (
                    <Badge
                      variant={
                        contractInfo.isGraduated ? "default" : "secondary"
                      }
                    >
                      {contractInfo.graduationStatus}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {contractInfo.description && (
              <p className="mx-auto max-w-3xl text-sm italic leading-relaxed md:text-lg text-slate-600 font-body">
                {contractInfo.description}
              </p>
            )}
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {mintPrice && ethPrice > 0 ? (
                <div className="text-center">
                  <div className="text-2xl font-semibold font-heading text-slate-900">
                    $
                    {(parseFloat(formatEther(mintPrice)) * ethPrice).toFixed(2)}
                  </div>
                  <div className="text-sm font-body text-slate-600">
                    Pack Price
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Skeleton className="mx-auto mb-2 w-20 h-8" />
                  <div className="text-sm font-body text-slate-600">
                    Pack Price
                  </div>
                </div>
              )}

              {contractInfo?.marketCap ? (
                <div className="text-center">
                  <div className="text-2xl font-semibold font-heading text-slate-900">
                    {contractInfo.marketCap}
                  </div>
                  <div className="text-sm font-body text-slate-600">
                    Market Cap
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Skeleton className="mx-auto mb-2 w-24 h-8" />
                  <div className="text-sm font-body text-slate-600">
                    Market Cap
                  </div>
                </div>
              )}

              <div className="text-center">
                <div className="text-2xl font-semibold font-heading text-slate-900">
                  Base
                </div>
                <div className="text-sm font-body text-slate-600">Network</div>
              </div>

              {contractInfo?.isActive !== undefined ? (
                <div className="text-center">
                  <div className="text-2xl font-semibold font-heading text-slate-900">
                    {contractInfo.isActive ? "Active" : "Inactive"}
                  </div>
                  <div className="text-sm font-body text-slate-600">Status</div>
                </div>
              ) : (
                <div className="text-center">
                  <Skeleton className="mx-auto mb-2 w-16 h-8" />
                  <div className="text-sm font-body text-slate-600">Status</div>
                </div>
              )}
            </div>

            {/* Contract Addresses */}
            <div className="pt-6 border-t border-border">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="mb-2 text-sm font-body text-slate-600">
                    NFT Contract
                  </div>
                  <Link
                    href={`https://basescan.org/address/${contractInfo.contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-3 py-2 font-mono text-sm transition-colors !text-slate-900 hover:!text-blue-600 bg-slate-100 hover:bg-slate-200"
                  >
                    {addressDisplay?.nftContract}
                  </Link>
                </div>

                {contractInfo.tokenContract && (
                  <div className="text-center">
                    <div className="mb-2 text-sm font-body text-slate-600">
                      Token Contract
                    </div>
                    <Link
                      href={`https://basescan.org/address/${contractInfo.tokenContract}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-3 py-2 font-mono text-sm transition-colors !text-slate-900 hover:!text-blue-600 bg-slate-100 hover:bg-slate-200"
                    >
                      {addressDisplay?.tokenContract}
                    </Link>
                  </div>
                )}

                {contractInfo.creator && (
                  <div className="text-center">
                    <div className="mb-2 text-sm font-body text-slate-600">
                      Creator
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-2 font-mono text-sm !text-slate-900 bg-slate-100">
                      {addressDisplay?.creator}
                      <span className="text-green-600" title="Verified Artist">
                        ✓
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default ContractInfo;
