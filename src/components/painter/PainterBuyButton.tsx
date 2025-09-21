"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchETHPrice } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useReadContract, useAccount } from "wagmi";
import { boosterDropV2Abi } from "@/abi/IBoosterDropV2ABI";
import { formatEther } from "viem";
import { useBuyToken } from "@/hooks/BuyFunction";

const PAINTER_CONTRACT = "0xf707a83ff6b4fb497392e3b70b25605032d4f784" as const;

export function PainterBuyButton() {
  const [ethPrice, setEthPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const { address } = useAccount();
  const {
    mintPacks,
    isLoading: isBuying,
    error: buyError,
    isConfirmed,
    txHash,
    reset,
  } = useBuyToken();

  // Get real pack price from contract
  const { data: mintPrice } = useReadContract({
    address: PAINTER_CONTRACT,
    abi: boosterDropV2Abi,
    functionName: "getMintPrice",
    args: [BigInt(quantity)],
  });

  useEffect(() => {
    const loadEthPrice = async () => {
      const price = await fetchETHPrice();
      setEthPrice(price);
    };

    loadEthPrice();
    const interval = setInterval(loadEthPrice, 300000);
    return () => clearInterval(interval);
  }, []);

  const handleBuyPack = async () => {
    if (!address) return;

    try {
      await mintPacks({
        tokenAddress: PAINTER_CONTRACT,
        tokenAmount: BigInt(quantity),
        recipient: address,
      });
    } catch (error) {
      console.error("Mint failed:", error);
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      console.log("✅ Pack minted successfully!", txHash);
    }
  }, [isConfirmed, txHash]);

  return (
    <Card className="h-full border-amber-200 shadow-xl">
      <CardContent className="flex flex-col justify-center p-8 h-full">
        <div className="text-center">
          <h3 className="mb-6 text-2xl font-semibold text-amber-900 font-heading">
            Mint Painter Packs
          </h3>

          {/* Buy Section */}
          <div className="flex flex-col gap-4 items-center">
            <div className="flex flex-col items-center">
              <label className="mb-2 text-sm font-medium text-amber-800">
                Quantity
              </label>

              {/* Preset Buttons */}
              <div className="flex gap-2 mb-3">
                {[1, 5, 10, 100].map((preset) => (
                  <Button
                    key={preset}
                    onClick={() => setQuantity(preset)}
                    variant={quantity === preset ? "default" : "outline"}
                    className={`px-3 py-1 text-sm ${
                      quantity === preset
                        ? "bg-amber-500 text-white border-amber-500"
                        : "border-amber-300 text-amber-700 hover:bg-amber-100"
                    }`}
                  >
                    {preset}
                  </Button>
                ))}
              </div>

              {/* Custom Input */}
              <div className="flex gap-2 items-center">
                <span className="text-sm text-amber-700">Custom:</span>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-24 text-center border-amber-300 focus:border-amber-500"
                />
              </div>
            </div>

            <Button
              onClick={handleBuyPack}
              disabled={!address || isBuying}
              className="px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50"
            >
              {isBuying
                ? "Minting..."
                : !address
                ? "Connect Wallet"
                : `Buy ${quantity} Pack${quantity > 1 ? "s" : ""}`}
              {mintPrice && ethPrice > 0 && (
                <span className="ml-2 text-sm opacity-90">
                  ($
                  {(parseFloat(formatEther(mintPrice)) * ethPrice).toFixed(2)})
                </span>
              )}
            </Button>
          </div>

          <p className="pt-5 mt-3 text-xs italic text-amber-600">
            * It is possible to get more than 100 packs
          </p>

          {buyError && <p className="mt-4 text-sm text-red-600">{buyError}</p>}

          {isConfirmed && txHash && (
            <p className="mt-4 text-sm text-green-600">
              ✅ {quantity} Pack{quantity > 1 ? "s" : ""} minted successfully!
              <Link
                href={`https://basescan.org/tx/${txHash}`}
                target="_blank"
                className="ml-1 underline hover:text-green-700"
              >
                View transaction
              </Link>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default PainterBuyButton;
