"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { fetchCollectionData, fetchUserNFTs } from "@/utils/api";
import { CONTRACTS } from "@/utils/contracts";
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
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  metadata?: {
    foil?: string;
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

export function NFTGrid() {
  const { address, isConnected } = useAccount();
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"collection" | "owned">(
    "collection"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 8,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Items per page for server-side pagination
  const itemsPerPage = 8;

  useEffect(() => {
    const loadNFTs = async () => {
      if (!CONTRACTS.GEO_ART) return;

      setIsLoading(true);

      try {
        if (viewMode === "collection") {
          const collectionData = await fetchCollectionData(CONTRACTS.GEO_ART, {
            page: currentPage,
            limit: itemsPerPage,
          });

          if (collectionData?.data) {
            setNfts(collectionData.data);
            setPagination(collectionData.pagination);
          }
        } else if (viewMode === "owned" && address) {
          const userNFTs = await fetchUserNFTs(address, CONTRACTS.GEO_ART, {
            page: currentPage,
            limit: itemsPerPage,
          });

          // For user NFTs, we need to manually create pagination since API might not return it
          setNfts(userNFTs);
          setPagination({
            currentPage: currentPage,
            totalPages: Math.ceil(userNFTs.length / itemsPerPage),
            totalItems: userNFTs.length,
            itemsPerPage: itemsPerPage,
            hasNextPage: userNFTs.length === itemsPerPage, // Assume more if we got a full page
            hasPreviousPage: currentPage > 1,
          });
        }
      } catch (error) {
        console.error("Failed to load NFTs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Add delay to prevent rapid API calls during development
    const timeoutId = setTimeout(loadNFTs, 300);
    return () => clearTimeout(timeoutId);
  }, [viewMode, address, currentPage]);

  // Reset to first page when view mode changes
  useEffect(() => {
    setCurrentPage(1);
  }, [viewMode]);

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 text-sm font-medium font-body text-slate-700">
              Loading NFTs...
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h3 className="mb-4 text-3xl font-semibold font-heading text-slate-900">
            {viewMode === "collection" ? "GEO ART Collection" : "Your NFTs"}
          </h3>

          {/* View Toggle */}
          <div className="inline-flex border border-border">
            <Button
              onClick={() => setViewMode("collection")}
              variant={viewMode === "collection" ? "default" : "outline"}
              className="border-r-0"
            >
              Collection
            </Button>
            <Button
              onClick={() => setViewMode("owned")}
              disabled={!isConnected}
              variant={viewMode === "owned" ? "default" : "outline"}
            >
              Your NFTs
            </Button>
          </div>

          {!isConnected && viewMode === "owned" && (
            <p className="mt-2 text-sm font-body text-slate-700">
              Connect your wallet to view your NFTs
            </p>
          )}
        </div>

        {/* NFT Grid */}
        {nfts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {nfts.map((nft) => (
                <NFTCard key={nft.id} nft={nft} />
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
            <p className="font-body text-slate-700">
              {viewMode === "collection"
                ? "No NFTs found in collection"
                : "No NFTs found in your wallet"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
