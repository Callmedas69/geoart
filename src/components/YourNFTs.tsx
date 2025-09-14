"use client";

import { useState, useEffect, useCallback } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { fetchUserNFTs } from "@/utils/api";
import { CONTRACTS } from "@/utils/contracts";
import { boosterDropV2Abi } from "@/abi/IBoosterDropV2ABI";
import { boosterTokenV2Abi } from "@/abi/IBoosterTokenV2ABI";
import { NFTCard } from "@/components/NFTCard";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface NFTItem {
  id: string;
  name: string;
  image: string;
  description?: string;
  rarity?: number;
  status?: string;
  rarityName?: string;
  tokenId?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  metadata?: {
    foil?: string;
    imageUrl?: string;
    unopenedImageUrl?: string;
    [key: string]: any;
  };
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function YourNFTs() {
  const { address, isConnected } = useAccount();
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 8,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Batch operations state
  const [selectedNFTs, setSelectedNFTs] = useState<Set<string>>(new Set());
  const [batchMode, setBatchMode] = useState(false);
  const [showBatchConfirm, setShowBatchConfirm] = useState(false);
  const [pendingBatchAction, setPendingBatchAction] = useState<
    "sell" | "unpack" | null
  >(null);

  // Sequential batch sell state
  const [batchSellQueue, setBatchSellQueue] = useState<NFTItem[]>([]);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [batchSellInProgress, setBatchSellInProgress] = useState(false);
  const [currentBatchStep, setCurrentBatchStep] = useState<1 | 2>(1); // Track if we're on step 1 (sell) or step 2 (convert)

  // Refresh state
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Transaction handling for batch operations
  const { writeContract, isPending, data: hash, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Get entropy fee for batch unpacking
  const { data: entropyFee } = useReadContract({
    address: CONTRACTS.GEO_ART,
    abi: boosterDropV2Abi,
    functionName: "getEntropyFee",
    query: { enabled: !!address },
  });

  // Get token contract address for batch sell step 2
  const { data: tokenAddress } = useReadContract({
    address: CONTRACTS.GEO_ART,
    abi: boosterDropV2Abi,
    functionName: "boosterTokenAddress",
    query: { enabled: !!address },
  });

  // Items per page - contract-driven or environment variable
  const itemsPerPage = parseInt(
    process.env.NEXT_PUBLIC_USER_NFTS_PER_PAGE || "8"
  );

  useEffect(() => {
    let isCancelled = false;

    const loadUserNFTs = async () => {
      if (!CONTRACTS.GEO_ART || !address) return;

      setIsLoading(true);

      try {
        const userNFTs = await fetchUserNFTs(address, CONTRACTS.GEO_ART, {
          page: currentPage,
          limit: itemsPerPage,
        });

        if (isCancelled) return;

        if (Array.isArray(userNFTs)) {
          setNfts(userNFTs);
          setPagination({
            currentPage: currentPage,
            totalPages: 1, // Keep it simple - show all on one page
            totalItems: userNFTs.length,
            itemsPerPage: itemsPerPage,
            hasNextPage: false,
            hasPreviousPage: false,
          });
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Failed to load user NFTs:", error);
          // Don't reset existing data on error
          setIsLoading(false);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadUserNFTs();

    return () => {
      isCancelled = true;
    };
  }, [address, currentPage, itemsPerPage]);

  // Reset to first page when wallet connection changes
  useEffect(() => {
    setCurrentPage(1);
  }, [address]);

  // Batch operations helpers
  const toggleNFTSelection = (nftId: string) => {
    setSelectedNFTs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nftId)) {
        newSet.delete(nftId);
      } else {
        newSet.add(nftId);
      }
      return newSet;
    });
  };

  const selectAllNFTs = () => {
    setSelectedNFTs(new Set(nfts.map((nft) => nft.id)));
  };

  const clearSelection = useCallback(() => {
    setSelectedNFTs(new Set());
  }, []);

  const getSelectedNFTs = () => {
    return nfts.filter((nft) => selectedNFTs.has(nft.id));
  };

  const getUnrevealedSelected = () => {
    return getSelectedNFTs().filter((nft) => nft.status === "minted");
  };

  // Smart refresh function - reload NFT data without page refresh
  const refreshNFTData = async () => {
    if (!CONTRACTS.GEO_ART || !address || isRefreshing) return;

    setIsRefreshing(true);

    try {
      const userNFTs = await fetchUserNFTs(address, CONTRACTS.GEO_ART, {
        page: currentPage,
        limit: itemsPerPage,
      });

      if (Array.isArray(userNFTs)) {
        setNfts(userNFTs);
        setPagination({
          currentPage: currentPage,
          totalPages: 1,
          totalItems: userNFTs.length,
          itemsPerPage: itemsPerPage,
          hasNextPage: false,
          hasPreviousPage: false,
        });
      }
    } catch (error) {
      console.error("Failed to refresh NFT data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Batch transaction handlers
  const handleBatchSell = () => {
    setPendingBatchAction("sell");
    setShowBatchConfirm(true);
  };

  const handleBatchUnpack = () => {
    setPendingBatchAction("unpack");
    setShowBatchConfirm(true);
  };

  const confirmBatchAction = () => {
    const selectedNFTsList = getSelectedNFTs();

    if (pendingBatchAction === "sell") {
      // Start sequential batch sell process
      if (selectedNFTsList.length > 0) {
        setBatchSellQueue(selectedNFTsList);
        setCurrentBatchIndex(0);
        setBatchSellInProgress(true);

        // Start with the first NFT
        const firstNFT = selectedNFTsList[0];
        if (firstNFT?.tokenId) {
          writeContract({
            address: CONTRACTS.GEO_ART,
            abi: boosterDropV2Abi,
            functionName: "sellAndClaimOffer",
            args: [BigInt(firstNFT.tokenId)],
          });
        }
      }
    } else if (pendingBatchAction === "unpack") {
      // For batch unpack, we can pass multiple token IDs to the open function
      const unrevealedNFTs = getUnrevealedSelected();
      const tokenIds = unrevealedNFTs
        .filter((nft) => nft.tokenId)
        .map((nft) => BigInt(nft.tokenId!));

      if (tokenIds.length > 0 && entropyFee) {
        writeContract({
          address: CONTRACTS.GEO_ART,
          abi: boosterDropV2Abi,
          functionName: "open",
          args: [tokenIds],
          value: entropyFee as bigint, // Pay entropy fee
        });
      }
    }

    setShowBatchConfirm(false);
    setPendingBatchAction(null);
  };

  const cancelBatchAction = () => {
    setShowBatchConfirm(false);
    setPendingBatchAction(null);
    // Reset batch sell state
    setBatchSellInProgress(false);
    setBatchSellQueue([]);
    setCurrentBatchIndex(0);
    setCurrentBatchStep(1);
  };

  // Handle successful batch transaction with 2-step process
  useEffect(() => {
    if (isSuccess && batchSellInProgress) {
      const currentNFT = batchSellQueue[currentBatchIndex];

      if (currentBatchStep === 1) {
        // Step 1 completed: NFT sold for tokens, now convert tokens to ETH
        setCurrentBatchStep(2);

        // Small delay, then execute step 2 for current NFT
        setTimeout(() => {
          if (tokenAddress && address && currentNFT) {
            // For simplicity, use a fixed token amount (this should be calculated based on rarity)
            // In a real implementation, you'd want to get the actual rarity-based token amount
            const tokenAmount = BigInt("20000000000000000000000"); // 20,000 tokens (example)

            writeContract({
              address: tokenAddress as `0x${string}`,
              abi: boosterTokenV2Abi,
              functionName: "sell",
              args: [
                tokenAmount, // Token amount to sell
                address, // Recipient (your wallet)
                BigInt(0), // minPayout (0 for now)
                address, // referrer (yourself)
                address, // originReferrer (yourself)
              ],
            });
          }
        }, 1000); // 1 second delay
      } else if (currentBatchStep === 2) {
        // Step 2 completed: Tokens converted to ETH, move to next NFT
        const nextIndex = currentBatchIndex + 1;

        if (nextIndex < batchSellQueue.length) {
          // More NFTs to sell - reset to step 1 for next NFT
          setCurrentBatchIndex(nextIndex);
          setCurrentBatchStep(1);
          const nextNFT = batchSellQueue[nextIndex];

          if (nextNFT?.tokenId) {
            setTimeout(() => {
              writeContract({
                address: CONTRACTS.GEO_ART,
                abi: boosterDropV2Abi,
                functionName: "sellAndClaimOffer",
                args: [BigInt(nextNFT.tokenId!)],
              });
            }, 1000); // 1 second delay
          }
        } else {
          // All NFTs processed - complete batch operation
          setBatchSellInProgress(false);
          setBatchSellQueue([]);
          setCurrentBatchIndex(0);
          setCurrentBatchStep(1);
          clearSelection();
          setBatchMode(false);
          refreshNFTData(); // Smart refresh without page reload
        }
      }
    } else if (isSuccess && !batchSellInProgress) {
      // Regular batch unpack completed
      clearSelection();
      setBatchMode(false);
      refreshNFTData(); // Smart refresh without page reload
    }
  }, [
    isSuccess,
    batchSellInProgress,
    currentBatchIndex,
    currentBatchStep,
    batchSellQueue,
    tokenAddress,
    address,
    clearSelection,
  ]);

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h3 className="mb-4 text-3xl font-semibold font-heading text-slate-900">
              Your Geo Art
            </h3>
            <div className="inline-flex items-center px-4 py-2 text-sm font-medium font-body text-slate-700">
              Loading your Geo...
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="relative mb-8 text-center">
          <h3 className="mb-4 text-3xl font-semibold font-heading text-slate-900">
            Your Geo Art
          </h3>

          {/* Manual refresh button - subtle, positioned top-right */}
          {nfts.length > 0 && (
            <button
              onClick={refreshNFTData}
              disabled={isRefreshing}
              className="absolute top-0 right-0 p-2 transition-colors text-slate-400 hover:text-slate-600 disabled:opacity-50"
              title="Refresh NFT data"
            >
              <svg
                className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Batch Operations Controls */}
        {nfts.length > 0 && (
          <div className="flex flex-col gap-4 mb-6">
            {/* <div className="flex justify-between items-center">
              <Button
                variant={batchMode ? "default" : "outline"}
                onClick={() => {
                  setBatchMode(!batchMode);
                  if (batchMode) {
                    clearSelection();
                  }
                }}
                className="text-sm"
              >
                {batchMode ? "Exit Batch Mode" : "Batch Operations"}
              </Button>

              {batchMode && (
                <div className="flex gap-2 items-center text-sm text-slate-600">
                  <span>{selectedNFTs.size} selected</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={
                      selectedNFTs.size === nfts.length
                        ? clearSelection
                        : selectAllNFTs
                    }
                  >
                    {selectedNFTs.size === nfts.length
                      ? "Clear All"
                      : "Select All"}
                  </Button>
                </div>
              )}
            </div> */}

            {/* Batch Action Buttons */}
            {/* {batchMode && selectedNFTs.size > 0 && (
              <div className="flex gap-2">
                <Button
                  onClick={handleBatchSell}
                  disabled={selectedNFTs.size === 0 || isPending || isConfirming}
                  className="text-sm bg-red-600 hover:bg-red-700"
                >
                  {isPending && pendingBatchAction === "sell" ? "..." : `SELL SELECTED (${selectedNFTs.size})`}
                </Button>
                {getUnrevealedSelected().length > 0 && (
                  <Button
                    onClick={handleBatchUnpack}
                    disabled={getUnrevealedSelected().length === 0 || isPending || isConfirming}
                    className="text-sm bg-orange-600 hover:bg-orange-700"
                  >
                    {isPending && pendingBatchAction === "unpack" ? "..." : `UNPACK SELECTED (${getUnrevealedSelected().length})`}
                  </Button>
                )}
              </div>
            )} */}
          </div>
        )}

        {/* NFT Grid */}
        {nfts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {nfts.map((nft) => (
                <NFTCard
                  key={nft.id}
                  nft={nft}
                  showActions={!batchMode} // Hide individual actions in batch mode
                  batchMode={batchMode}
                  isSelected={selectedNFTs.has(nft.id)}
                  onToggleSelection={toggleNFTSelection}
                  onTransactionSuccess={() => {
                    // Smart refresh NFT data after successful transaction
                    refreshNFTData();
                  }}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (pagination.hasPreviousPage) {
                            setCurrentPage(currentPage - 1);
                          }
                        }}
                        className={
                          !pagination.hasPreviousPage
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>

                    {[...Array(pagination.totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(pageNumber);
                            }}
                            isActive={currentPage === pageNumber}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (pagination.hasNextPage) {
                            setCurrentPage(currentPage + 1);
                          }
                        }}
                        className={
                          !pagination.hasNextPage
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="text-center">
            <div className="p-8 rounded-lg border-2 border-dashed border-slate-300">
              <div className="mb-4">
                <svg
                  className="mx-auto w-16 h-16 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>

              <p className="text-xs italic font-body text-slate-600">
                You don't own any Geo
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Batch Confirmation Dialog */}
      {showBatchConfirm && (
        <div className="flex fixed inset-0 z-50 justify-center items-center duration-200 bg-black/50 animate-in fade-in">
          <div className="p-6 mx-4 max-w-md bg-white border border-gray-200 duration-200 animate-in zoom-in-95">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Confirm Batch {pendingBatchAction === "sell" ? "SELL" : "UNPACK"}
            </h3>

            <div className="mb-6 space-y-2 text-sm text-gray-600">
              <p>Selected packs: {selectedNFTs.size}</p>
              {pendingBatchAction === "unpack" && (
                <p>
                  Unrevealed packs to unpack: {getUnrevealedSelected().length}
                </p>
              )}

              {pendingBatchAction === "sell" && (
                <>
                  {batchSellInProgress ? (
                    <div className="p-3 bg-blue-50 rounded border border-blue-200">
                      <div className="flex gap-2 items-center mb-2">
                        <div className="w-4 h-4 rounded-full border-2 border-blue-600 animate-spin border-t-transparent"></div>
                        <p className="font-medium text-blue-800">
                          Processing batch sell...
                        </p>
                      </div>
                      <p className="text-sm text-blue-600">
                        NFT {currentBatchIndex + 1} of {batchSellQueue.length} -
                        Step {currentBatchStep}/2
                        <br />
                        <span className="text-xs">
                          {currentBatchStep === 1
                            ? "Selling NFT for tokens..."
                            : "Converting tokens to ETH..."}
                        </span>
                      </p>
                      <div className="mt-2 w-full h-2 bg-blue-200 rounded-full">
                        <div
                          className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              ((currentBatchIndex * 2 + currentBatchStep) /
                                (batchSellQueue.length * 2)) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-red-50 rounded border border-red-200">
                      <p className="font-medium text-red-800">
                        ⚠️ This will sell ALL selected NFTs permanently
                      </p>
                      <p className="mt-1 text-xs text-red-600">
                        2-step process per Pack: Sell → Convert to ETH
                        (automatic)
                      </p>
                    </div>
                  )}
                </>
              )}

              {pendingBatchAction === "unpack" && (
                <div className="p-3 bg-orange-50 rounded border border-orange-200">
                  <p className="font-medium text-orange-800">
                    🎲 This will reveal the rarity of all selected packs
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={cancelBatchAction}
                disabled={isPending || isConfirming || batchSellInProgress}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 hover:bg-gray-200 disabled:opacity-50"
              >
                {batchSellInProgress ? "Processing..." : "Cancel"}
              </button>
              <button
                onClick={confirmBatchAction}
                disabled={isPending || isConfirming || batchSellInProgress}
                className={`flex-1 px-4 py-2 text-white border disabled:opacity-50 ${
                  pendingBatchAction === "sell"
                    ? "bg-red-600 hover:bg-red-700 border-red-600"
                    : "bg-orange-600 hover:bg-orange-700 border-orange-600"
                }`}
              >
                {batchSellInProgress
                  ? "Processing..."
                  : isPending || isConfirming
                  ? "Processing..."
                  : `Confirm ${pendingBatchAction?.toUpperCase()}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Status */}
      {error && (
        <div className="fixed right-4 bottom-4 p-4 max-w-sm text-sm text-red-700 bg-red-100 rounded border border-red-400">
          Batch transaction failed: {error.message}
        </div>
      )}

      {isSuccess && (
        <div className="fixed right-4 bottom-4 p-4 max-w-sm text-sm text-green-700 bg-green-100 rounded border border-green-400">
          Batch transaction successful!
          {hash && (
            <a
              href={`https://basescan.org/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-blue-600 underline"
            >
              View on BaseScan
            </a>
          )}
        </div>
      )}
    </section>
  );
}
