"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { fetchETHPrice } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useReadContract } from "wagmi";
import { boosterDropV2Abi } from "@/abi/IBoosterDropV2ABI";
import { formatEther } from "viem";
import { useContractInfo } from "@/hooks/useContractInfo";

const PAINTER_CONTRACT = "0xf707a83ff6b4fb497392e3b70b25605032d4f784" as const;

export function PainterContractInfo() {
  const {
    data: contractInfo,
    loading: isLoading,
    error,
  } = useContractInfo(PAINTER_CONTRACT);
  const [ethPrice, setEthPrice] = useState<number>(0);

  // Get real pack price from contract
  const { data: mintPrice } = useReadContract({
    address: PAINTER_CONTRACT,
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
      <section className="py-12">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 text-sm font-medium font-body text-slate-900">
              Loading painter collection info...
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !contractInfo) {
    return null;
  }

  return (
    <Card className="border-amber-200 shadow-xl">
          <CardHeader className="text-center">
            <div className="flex gap-4 justify-center items-center mb-4">
              {contractInfo.image && (
                <img
                  src={contractInfo.image}
                  alt={contractInfo.name}
                  className="object-cover w-16 h-full rounded-lg border-2 border-amber-300"
                />
              )}
              <div>
                <CardTitle className="text-3xl text-amber-900 md:text-4xl font-heading">
                  {contractInfo.name}
                </CardTitle>
                <div className="flex gap-2 justify-center items-center mt-2 text-xs md:text-sm">
                  <Badge
                    variant="secondary"
                    className="font-mono text-amber-800 bg-amber-200"
                  >
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
                      className="text-amber-800 bg-amber-200"
                    >
                      {contractInfo.graduationStatus}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {contractInfo.description && (
              <p className="mx-auto max-w-3xl text-sm italic leading-relaxed text-amber-800 md:text-lg font-body">
                {contractInfo.description}
              </p>
            )}
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {mintPrice && ethPrice > 0 ? (
                <div className="text-center">
                  <div className="text-2xl font-semibold text-amber-900 font-heading">
                    $
                    {(parseFloat(formatEther(mintPrice)) * ethPrice).toFixed(2)}
                  </div>
                  <div className="text-sm text-amber-700 font-body">
                    Pack Price
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Skeleton className="mx-auto mb-2 w-20 h-8 bg-amber-200" />
                  <div className="text-sm text-amber-700 font-body">
                    Pack Price
                  </div>
                </div>
              )}

              {contractInfo?.marketCap ? (
                <div className="text-center">
                  <div className="text-2xl font-semibold text-amber-900 font-heading">
                    {contractInfo.marketCap}
                  </div>
                  <div className="text-sm text-amber-700 font-body">
                    Market Cap
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Skeleton className="mx-auto mb-2 w-24 h-8 bg-amber-200" />
                  <div className="text-sm text-amber-700 font-body">
                    Market Cap
                  </div>
                </div>
              )}

              <div className="text-center">
                <div className="text-2xl font-semibold text-amber-900 font-heading">
                  Base
                </div>
                <div className="text-sm text-amber-700 font-body">Network</div>
              </div>

              {contractInfo?.isActive !== undefined ? (
                <div className="text-center">
                  <div className="text-2xl font-semibold text-amber-900 font-heading">
                    {contractInfo.isActive ? "Active" : "Inactive"}
                  </div>
                  <div className="text-sm text-amber-700 font-body">Status</div>
                </div>
              ) : (
                <div className="text-center">
                  <Skeleton className="mx-auto mb-2 w-16 h-8 bg-amber-200" />
                  <div className="text-sm text-amber-700 font-body">Status</div>
                </div>
              )}
            </div>

            {/* Contract Addresses */}
            <div className="pt-6 border-t border-amber-200">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="mb-2 text-sm text-amber-700 font-body">
                    NFT Contract
                  </div>
                  <Link
                    href={`https://basescan.org/address/${contractInfo.contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-3 py-2 font-mono text-sm transition-colors !text-amber-900 hover:!text-orange-600 bg-amber-100 hover:bg-amber-200 rounded"
                  >
                    {addressDisplay?.nftContract}
                  </Link>
                </div>

                {contractInfo.tokenContract && (
                  <div className="text-center">
                    <div className="mb-2 text-sm text-amber-700 font-body">
                      Token Contract
                    </div>
                    <Link
                      href={`https://basescan.org/address/${contractInfo.tokenContract}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-3 py-2 font-mono text-sm transition-colors !text-amber-900 hover:!text-orange-600 bg-amber-100 hover:bg-amber-200 rounded"
                    >
                      {addressDisplay?.tokenContract}
                    </Link>
                  </div>
                )}

                {contractInfo.creator && (
                  <div className="text-center">
                    <div className="mb-2 text-sm text-amber-700 font-body">
                      Creator
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-2 font-mono text-sm !text-amber-900 bg-amber-100 rounded">
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
  );
}

export default PainterContractInfo;
