"use client";

import { useState, useEffect } from "react";
import { formatEther, parseEther } from "viem";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBuyToken } from "@/hooks/BuyFunction";
import { useEthPrice } from "@/hooks/useEthPrice";
import { BuyModalProps } from "@/types/BuyFunction";

export function BuyModal({
  isOpen,
  onClose,
  tokenAddress,
  creatorAddress,
}: BuyModalProps) {
  const [firstBuyPackAmount, setFirstBuyPackAmount] = useState("");
  const [ethCost, setEthCost] = useState<bigint | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const {
    mintPacks,
    getMintPrice,
    formatPrice,
    parsePrice,
    isLoading,
    error,
    isConfirmed,
    txHash,
    reset,
  } = useBuyToken();

  const {
    formatEthWithUsd,
    isLoading: isEthPriceLoading,
    error: ethPriceError,
  } = useEthPrice();

  // Calculate ETH cost when first buy pack amount changes
  useEffect(() => {
    const calculateCost = async () => {
      if (
        !firstBuyPackAmount ||
        !tokenAddress ||
        isNaN(Number(firstBuyPackAmount)) ||
        Number(firstBuyPackAmount) < 0
      ) {
        setEthCost(null);
        return;
      }

      try {
        setIsCalculating(true);
        const firstBuyPackAmountBigInt = BigInt(
          Math.floor(Number(firstBuyPackAmount))
        );
        const cost = await getMintPrice(tokenAddress, firstBuyPackAmountBigInt);
        setEthCost(cost);
      } catch (err) {
        setEthCost(null);
      } finally {
        setIsCalculating(false);
      }
    };

    const debounceTimer = setTimeout(calculateCost, 300);
    return () => clearTimeout(debounceTimer);
  }, [firstBuyPackAmount, tokenAddress, getMintPrice]);

  // Handle mint transaction
  const handleMint = async () => {
    if (!firstBuyPackAmount || !ethCost) return;

    try {
      const firstBuyPackAmountBigInt = BigInt(
        Math.floor(Number(firstBuyPackAmount))
      );
      await mintPacks({
        tokenAddress,
        tokenAmount: firstBuyPackAmountBigInt,
        recipient: creatorAddress,
      });
    } catch (err) {
      // Error handled by useBuyToken hook
    }
  };

  // Reset form when modal closes
  const handleClose = () => {
    setFirstBuyPackAmount("");
    setEthCost(null);
    reset();
    onClose();
  };

  // Handle successful transaction
  useEffect(() => {
    if (isConfirmed) {
      console.log(
        "🎉 BuyModal: Transaction confirmed, closing in 3 seconds..."
      );
      // Auto-close after successful purchase or stay open to show success
      setTimeout(() => {
        console.log("🚪 BuyModal: Auto-closing modal");
        handleClose();
      }, 3000);
    }
  }, [isConfirmed]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white border-black sm:max-w-md border-1">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-bold tracking-wide uppercase">
            Buy Your Packs
          </DialogTitle>
          <DialogDescription className="text-sm font-medium">
            Buy your packs before sharing publicly
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Pack Amount Input */}
          <div className="space-y-2">
            <Label
              htmlFor="pack-amount"
              className="text-sm font-bold uppercase"
            >
              Number of Packs
            </Label>
            <Input
              id="pack-amount"
              type="number"
              placeholder="0"
              min="0"
              step="1"
              value={firstBuyPackAmount}
              onChange={(e) => setFirstBuyPackAmount(e.target.value)}
              disabled={isLoading}
              className="h-12 font-mono text-lg font-bold text-center bg-white border-black border-1 focus:ring-2 focus:ring-black focus:ring-offset-2"
            />
          </div>

          {/* Price Display */}
          <div className="space-y-2">
            <Label className="text-sm font-bold uppercase">Total Cost</Label>
            <div className="flex flex-col justify-center items-center p-2 bg-gray-50 border-black min-h-12 border-1">
              {isCalculating ? (
                <span className="font-mono text-lg font-bold animate-pulse">
                  Calculating...
                </span>
              ) : ethCost ? (
                <div className="text-center">
                  <div className="font-mono text-lg font-bold">
                    {isEthPriceLoading || ethPriceError
                      ? `${formatPrice(ethCost)} ETH`
                      : formatEthWithUsd(parseFloat(formatPrice(ethCost)))}
                  </div>
                  {ethPriceError && (
                    <div className="mt-1 text-xs text-red-500">
                      USD price unavailable
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <div className="font-mono text-lg text-gray-400">
                    0.0000 ETH (~$0.00)
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Transaction Status */}
          {error && (
            <div className="p-3 bg-red-50 border-red-500 border-1">
              <p className="text-sm font-bold text-red-600 uppercase">
                {error}
              </p>
            </div>
          )}

          {txHash && (
            <div className="p-3 bg-green-50 border-green-500 border-1">
              <p className="text-sm font-bold text-green-600 uppercase">
                {isConfirmed
                  ? "Packs Minted Successfully!"
                  : "Minting In Progress..."}
              </p>
              <p className="mt-1 font-mono text-xs break-all">{txHash}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 h-12 font-bold uppercase"
            >
              Cancel
            </Button>
            <Button
              onClick={handleMint}
              disabled={
                isLoading ||
                !firstBuyPackAmount ||
                Number(firstBuyPackAmount) <= 0 ||
                !ethCost ||
                isCalculating
              }
              className="flex-1 h-12 font-bold uppercase"
            >
              {isLoading ? "Packing..." : "Buy Packs"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
