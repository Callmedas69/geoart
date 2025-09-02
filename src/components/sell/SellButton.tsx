"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSell } from "./useSell";

interface NFTItem {
  id: string;
  tokenId?: string;
  name: string;
  image: string;
  description?: string;
  rarity?: number;
  status?: string;
}

interface SellButtonProps {
  nft: NFTItem;
  sellPrice?: { eth: string; usd: string | null };
  onSuccess: () => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * 2-Step sell button: NFT -> Tokens -> ETH
 */
export const SellButton = ({
  nft,
  sellPrice,
  onSuccess,
  onError,
  disabled,
  className,
}: SellButtonProps) => {
  const {
    sellNFT,
    executeStep2,
    currentStep,
    isLoading,
    isCompleted,
    error,
    step1Hash,
    step2Hash,
    isStep1Success,
    reset,
  } = useSell();

  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Calculate progress percentage (3 steps: Confirm -> Sign NFT -> Sign Token)
  const getProgressPercentage = () => {
    switch (currentStep) {
      case "idle":
        return 0;
      case "step1":
        return 33; // Confirmed, signing NFT
      case "step2":
        return 67; // NFT signed, signing token
      case "completed":
        return 100;
      case "error":
        return 0;
      default:
        return 0;
    }
  };

  // Get step status for horizontal flow
  const getStepStatus = (step: "confirm" | "nft" | "token") => {
    switch (step) {
      case "confirm":
        return currentStep !== "idle" ? "●" : "○";
      case "nft":
        return isStep1Success ? "●" : currentStep === "step1" ? "🔄" : "○";
      case "token":
        return currentStep === "completed"
          ? "●"
          : currentStep === "step2"
          ? "🔄"
          : "○";
      default:
        return "○";
    }
  };

  const handleSell = () => {
    if (!nft.tokenId) {
      onError?.("No tokenId available for this NFT");
      return;
    }
    setShowModal(true);
  };

  const confirmSell = async () => {
    if (!nft.tokenId) return;

    try {
      await sellNFT(nft.tokenId);
    } catch (error) {
      onError?.(error instanceof Error ? error.message : "Transaction failed");
    }
  };

  const cancelSell = () => {
    setShowModal(false);
    reset();
  };

  // Close modal on backdrop click (only in idle state)
  const handleBackdropClick = () => {
    if (currentStep === "idle") {
      setShowModal(false);
      reset();
    }
  };

  // Handle step 1 completion -> trigger step 2
  useEffect(() => {
    if (isStep1Success && currentStep === "step1") {
      // TODO: Get actual token amount from contract
      // For now, using estimated amount based on rarity
      const estimatedTokens = BigInt(92500) * BigInt(10 ** 18); // 92,500 tokens
      executeStep2(estimatedTokens);
    }
  }, [isStep1Success, currentStep, executeStep2]);

  // Handle final completion
  useEffect(() => {
    if (isCompleted) {
      setShowModal(false);
      setShowSuccessModal(true);
      onSuccess();
    }
  }, [isCompleted, onSuccess]);

  // Handle errors
  useEffect(() => {
    if (error) {
      onError?.(error.message || "Transaction failed");
    }
  }, [error, onError]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showModal && currentStep === "idle") {
        setShowModal(false);
        reset();
      }
    };

    if (showModal) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [showModal, currentStep, reset]);

  return (
    <>
      <Button
        onClick={handleSell}
        disabled={disabled || isLoading || !nft.tokenId}
        variant="destructive"
        size="sm"
        className={`text-xs font-semibold ${className}`}
      >
        {isLoading ? (
          <>
            <div className="mr-1 w-3 h-3 rounded-full border border-white animate-spin border-t-transparent" />
            Selling...
          </>
        ) : (
          "SELL"
        )}
      </Button>

      {/* Modal 1: Confirmation & Progress */}
      {showModal && (
        <div
          className="flex fixed inset-0 z-[1050] justify-center items-center bg-black/50"
          onClick={handleBackdropClick}
        >
          <div
            className="p-6 mx-6 min-w-[500px] min-h-[350px] bg-white shadow-lg justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {currentStep === "idle" ? (
              // Confirmation State
              <>
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Sell NFT #{nft.id}
                </h3>

                <div className="mb-6 space-y-4">
                  {sellPrice ? (
                    <div className="p-3 bg-green-50 rounded-md border border-green-200">
                      <p className="mb-1 text-sm font-medium text-green-800">
                        💰 You will receive:
                      </p>
                      <p className="text-lg font-bold text-green-900">
                        {sellPrice.eth} ETH
                      </p>
                      {sellPrice.usd && (
                        <p className="text-sm text-green-700">
                          ≈ ${sellPrice.usd} USD
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                      <p className="text-sm text-gray-600">
                        Calculating sell price...
                      </p>
                    </div>
                  )}

                  <div className="p-3 bg-orange-50 rounded-md border border-orange-200">
                    <p className="mb-2 text-sm font-medium text-orange-800">
                      ⚠️ Requires 2 signatures:
                    </p>
                    <ul className="space-y-1 text-sm text-orange-700">
                      <li>• Convert NFT to tokens</li>
                      <li>• Convert tokens to ETH</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={cancelSell}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmSell}
                    className="flex-1 px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                    disabled={!sellPrice}
                  >
                    Confirm
                  </button>
                </div>
              </>
            ) : (
              // Progress State
              <>
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Processing Sale...
                </h3>

                <div className="mb-6 space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Progress</span>
                      <span>{getProgressPercentage()}%</span>
                    </div>
                    <Progress value={getProgressPercentage()} className="h-2" />
                  </div>

                  {/* Horizontal Step Flow */}
                  <div className="flex justify-between items-center px-4">
                    {/* Step 1: Confirm */}
                    <div className="flex flex-col items-center text-center">
                      <div className="flex justify-center items-center mb-2 w-8 h-8 text-lg">
                        {getStepStatus("confirm")}
                      </div>
                      <span className="text-xs text-gray-600">Confirm</span>
                    </div>

                    {/* Connection Line 1 */}
                    <div className="flex-1 mx-2 h-px bg-gray-300"></div>

                    {/* Step 2: Sign NFT */}
                    <div className="flex flex-col items-center text-center">
                      <div className="flex justify-center items-center mb-2 w-8 h-8 text-lg">
                        {getStepStatus("nft")}
                      </div>
                      <span className="text-xs text-gray-600">
                        Sign 1: Sell
                      </span>
                      <span className="text-xs text-gray-600">GEO NFT</span>
                    </div>

                    {/* Connection Line 2 */}
                    <div className="flex-1 mx-2 h-px bg-gray-300"></div>

                    {/* Step 3: Sign Token */}
                    <div className="flex flex-col items-center text-center">
                      <div className="flex justify-center items-center mb-2 w-8 h-8 text-lg">
                        {getStepStatus("token")}
                      </div>
                      <span className="text-xs text-gray-600">
                        Sign 2: Sell
                      </span>
                      <span className="text-xs text-gray-600">GEO Token</span>
                    </div>
                  </div>

                  <div className="text-sm text-center text-gray-600">
                    {currentStep === "step1" &&
                      "Please confirm transaction #1 in your wallet..."}
                    {currentStep === "step2" &&
                      "Please confirm transaction #2 in your wallet..."}
                    {currentStep === "error" &&
                      "Transaction failed. Please try again."}
                  </div>
                </div>

                {currentStep !== "completed" && (
                  <button
                    onClick={cancelSell}
                    className="px-4 py-2 w-full text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                    disabled={isLoading}
                  >
                    Cancel Process
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal 2: Success */}
      {showSuccessModal && (
        <div className="flex fixed inset-0 z-[1060] justify-center items-center bg-black/50">
          <div className="p-6 mx-6 min-w-[500px] min-h-[350px] bg-white shadow-lg">
            <h3 className="flex items-center mb-4 text-lg font-semibold text-green-700">
              ✅ Sale Complete!
            </h3>

            <div className="mb-6 space-y-4">
              {sellPrice && (
                <div className="p-3 bg-green-50 rounded-md border border-green-200">
                  <p className="mb-1 text-sm text-green-700">Received:</p>
                  <p className="text-lg font-bold text-green-800">
                    {sellPrice.eth} ETH
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              {step2Hash && (
                <a
                  href={`https://basescan.org/tx/${step2Hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-2 text-center text-blue-600 rounded border border-blue-200 hover:bg-blue-50"
                >
                  View Transaction
                </a>
              )}
              <button
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
