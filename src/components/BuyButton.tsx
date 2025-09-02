"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useBalance,
} from "wagmi";
import { CONTRACTS } from "@/utils/contracts";
import { boosterDropV2Abi } from "@/abi/IBoosterDropV2ABI";
import { boosterTokenV2Abi } from "@/abi/IBoosterTokenV2ABI";
import { formatEther, parseEther } from "viem";
import { fetchETHPrice } from "@/utils/api";

export function BuyButton() {
  const { address, isConnected, chain } = useAccount();
  const [quantity, setQuantity] = useState<number | string>(1);
  const [quantityInput, setQuantityInput] = useState("1");
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<"buy" | null>(null);
  const [ethPrice, setEthPrice] = useState<number>(0);

  // Contract reads
  const currentAmount = quantity as number;

  const { data: mintPrice } = useReadContract({
    address: CONTRACTS.GEO_ART,
    abi: boosterDropV2Abi,
    functionName: "getMintPrice",
    args: [BigInt(currentAmount)],
    query: { enabled: isConnected && chain?.id === 8453 },
  });

  // Real mint price in ETH (no mock USD conversion)
  const mintPriceETH = mintPrice ? parseFloat(formatEther(mintPrice)) : 0;

  const { data: tokenAddress } = useReadContract({
    address: CONTRACTS.GEO_ART,
    abi: boosterDropV2Abi,
    functionName: "boosterTokenAddress",
    query: { enabled: isConnected },
  });


  // Get actual wallet ETH balance using Wagmi's useBalance hook
  const { data: balanceData } = useBalance({
    address: address,
    chainId: 8453, // Base chain
    query: { enabled: !!address && isConnected },
  });

  const actualBalance = balanceData
    ? parseFloat(formatEther(balanceData.value))
    : 0;


  // Transaction handling
  const { writeContract, isPending, data: hash, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Fetch ETH price from Wield API using utils function
  useEffect(() => {
    const loadEthPrice = async () => {
      const price = await fetchETHPrice();
      setEthPrice(price);
    };

    loadEthPrice();
    // Update price every 5 minutes
    const interval = setInterval(loadEthPrice, 300000);
    return () => clearInterval(interval);
  }, []);

  // Clear active action when transaction is complete or fails
  useEffect(() => {
    if (!isPending && !isConfirming) {
      setActiveAction(null);
    }
  }, [isPending, isConfirming]);

  const showConfirmation = () => {
    setPendingAction("buy");
    setShowConfirmDialog(true);
  };

  const handleConfirm = () => {
    if (!isConnected || !address || chain?.id !== 8453 || !mintPrice) return;
    
    setShowConfirmDialog(false);
    setActiveAction("buy");
    setPendingAction(null);

    writeContract({
      address: CONTRACTS.GEO_ART,
      abi: boosterDropV2Abi,
      functionName: "mint",
      args: [BigInt(currentAmount), address, address, address],
      value: mintPrice,
    });
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
    setPendingAction(null);
  };

  // Handle input changes
  const handleQuantityChange = (value: string) => {
    setQuantityInput(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 10000) {
      setQuantity(numValue);
    } else if (value === "") {
      setQuantity(1);
    }
  };

  // Handle preset button clicks
  const handlePresetClick = (value: number) => {
    setQuantityInput(value.toString());
    setQuantity(value);
  };

  // Validation helper
  const isValidQuantity = (value: string) => {
    const num = parseInt(value);
    return !isNaN(num) && num >= 1 && num <= 10000;
  };

  // Balance validation
  const hasEnoughBalance = mintPrice
    ? actualBalance >= parseFloat(formatEther(mintPrice))
    : true;
  const balanceError = !hasEnoughBalance && mintPrice;

  // Shared Quick Input Selector - Row Layout
  const QuickInputSelector = () => (
    <div className="mb-6">
      <label className="block mb-3 text-sm font-medium text-center text-slate-900">
        Quantity
      </label>

      {/* Single row: Input field + Preset buttons */}
      <div className="flex flex-wrap gap-3 justify-center items-center mb-3">
        {/* Input field */}
        <input
          aria-label="Quantity"
          type="text"
          value={quantityInput}
          onChange={(e) => handleQuantityChange(e.target.value)}
          placeholder="Qty"
          className={`px-3 py-2 w-20 text-center font-medium rounded border-2 ${
            isValidQuantity(quantityInput)
              ? "border-gray-300 focus:border-blue-500"
              : "border-red-300 focus:border-red-500"
          } focus:outline-none focus:ring-1 focus:ring-blue-200`}
        />

        {/* Preset buttons */}
        {[1, 5, 10, 100].map((preset) => (
          <button
            key={preset}
            onClick={() => handlePresetClick(preset)}
            className={`px-3 py-2 font-medium rounded transition-colors ${
              quantity === preset
                ? "bg-slate-700 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  );

  const isTransacting = isPending || isConfirming;

  return (
    <section className="py-16 bg-white">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h3 className="mb-8 text-3xl font-semibold font-heading text-slate-900">
            Ready to Start Collecting?
          </h3>

          {!isConnected ? (
            <p className="mt-4 text-sm font-body text-slate-700">
              Connect your wallet to get started
            </p>
          ) : (
            <div className="mx-auto max-w-2xl">
              {/* Shared Quick Input Selector */}
              <QuickInputSelector />

              {/* Action Button */}
              <div className="flex justify-center items-center mb-6">
                <Button
                  onClick={showConfirmation}
                  size="lg"
                  className="min-w-[140px]"
                  disabled={
                    (isPending && activeAction === "buy") ||
                    !mintPrice ||
                    !hasEnoughBalance
                  }
                >
                  {isPending && activeAction === "buy"
                    ? "Processing..."
                    : !hasEnoughBalance
                    ? "Insufficient Balance"
                    : "BUY PACK"}
                </Button>
              </div>

              {/* Information Container */}
              <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50 border md:grid-cols-2">
                {/* Left: Total Fund on Wallet */}
                <div className="text-left">
                  <h4 className="mb-1 text-sm font-semibold text-gray-600">
                    Wallet Balance
                  </h4>
                  {balanceData ? (
                    <p className="text-lg font-bold text-slate-900">
                      {actualBalance.toFixed(5)} ETH
                      {ethPrice > 0 && (
                        <span className="text-sm text-gray-600">
                          {" "}/ ${(actualBalance * ethPrice).toFixed(2)} USD
                        </span>
                      )}
                    </p>
                  ) : (
                    <Skeleton className="h-7 w-32" />
                  )}
                  {/* Validation messages */}
                  {!isValidQuantity(quantityInput) && quantityInput !== "" && (
                    <p className="mt-2 text-[10px] text-red-600">
                      Please enter a number between 1-10,000
                    </p>
                  )}

                  {balanceError && (
                    <p className="mt-2 text-[10px] text-red-600 italic">
                      Insufficient balance
                    </p>
                  )}
                </div>

                {/* Right: Total Pack Price */}
                <div className="text-right">
                  <h4 className="mb-1 text-sm font-semibold text-gray-600">
                    {`${currentAmount} Pack${currentAmount > 1 ? "s" : ""}`}
                  </h4>
                  {mintPrice ? (
                    <div>
                      <p className="text-lg font-bold text-slate-900">
                        {parseFloat(formatEther(mintPrice)).toFixed(5)} ETH
                      </p>
                      {ethPrice > 0 && (
                        <p className="text-sm text-gray-600">
                          ${(parseFloat(formatEther(mintPrice)) * ethPrice).toFixed(2)} USD
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <Skeleton className="h-7 w-24 mb-1" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Transaction Status */}
          {error && (
            <div className="p-3 mt-4 text-sm text-red-700 bg-red-100 border border-red-400">
              Transaction failed: {error.message}
            </div>
          )}

          {isSuccess && (
            <div className="p-3 mt-4 text-sm italic text-green-700">
              Transaction successful!
              {hash && (
                <a
                  href={`https://basescan.org/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 !text-blue-600 underline"
                >
                  View on BaseScan
                </a>
              )}
            </div>
          )}

          {/* Confirmation Dialog */}
          {showConfirmDialog && (
            <div className="flex fixed inset-0 z-50 justify-center items-center duration-200 bg-black/50 animate-in fade-in">
              <div className="p-6 mx-4 max-w-sm bg-white border border-gray-200 duration-200 animate-in zoom-in-95">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Confirm BUY
                </h3>

                <div className="mb-6 space-y-2 text-sm text-gray-600">
                  <p>
                    Quantity: {currentAmount} pack
                    {currentAmount > 1 ? "s" : ""}
                  </p>
                  {mintPrice && (
                    <p>
                      Cost: {parseFloat(formatEther(mintPrice)).toFixed(5)} ETH
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 px-4 py-2 text-white border bg-slate-800 hover:bg-slate-900 border-slate-800"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}