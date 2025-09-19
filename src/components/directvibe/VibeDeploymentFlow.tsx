"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Wallet,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { useAccount } from "wagmi";
import { useVibeWrapperDeployment } from "@/hooks/useVibeWrapperDeployment";
import { useVibeAuth } from "@/hooks/useVibeAuth";
import { generateContractConfig } from "@/constants/vibeConfig";
import { SuccessModal } from "./SuccessModal";
import { BuyModal } from "@/components/BuyFunction";
// Removed VibeDirectUploadService - using direct API calls (KISS approach)

interface CollectionData {
  name: string;
  symbol: string;
  description: string;
  featuredIndex: number;
  enableFoil: boolean;
  enableWear: boolean;
  isNSFW: boolean;
  twitterUsername: string;
  websiteUrl: string;
  customFeaturedImage?: File;
  packAmount: number; // Number of packs to purchase on deployment
  owner?: string; // Optional custom owner address
}

interface UploadedFile {
  file: File;
  rarity: string;
  uploadedUrl?: string;
}

interface VibeDeploymentFlowProps {
  collectionData: CollectionData;
  uploadedFiles: UploadedFile[];
  onComplete: (result: any) => void;
  onBack: () => void;
}

export const VibeDeploymentFlow: React.FC<VibeDeploymentFlowProps> = ({
  collectionData,
  uploadedFiles,
  onComplete,
  onBack,
}) => {
  const { address, isConnected } = useAccount();
  const { token, authenticate, isAuthenticated } = useVibeAuth();
  const {
    deployCollection,
    isDeploying,
    contractFee, // New: current fee from contract
  } = useVibeWrapperDeployment();

  // Debug: Log auth state
  console.log("🔍 VibeDeploymentFlow Auth State:", {
    token: token ? `${token.substring(0, 20)}...` : "null",
    isAuthenticated,
    address,
    isConnected
  });

  const [currentStep, setCurrentStep] = useState<
    "draft" | "deploy" | "confirm" | "ready" | "complete"
  >("draft");
  const [draftResult, setDraftResult] = useState<any>(null);
  const [deploymentResult, setDeploymentResult] = useState<any>(null);
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCheckingReady, setIsCheckingReady] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [dropContractAddress, setDropContractAddress] = useState<string>("");
  const [finalResult, setFinalResult] = useState<any>(null);
  const [error, setError] = useState<string>("");

  // Fetch drop contract address using slug
  const fetchDropContractAddress = async (slug: string) => {
    console.log("🔍 Fetching contract info for slug:", slug);
    try {
      const response = await fetch(`/api/contract-info?slug=${encodeURIComponent(slug)}`);
      console.log("📡 API Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("📊 API Response data:", data);
        const dropAddress = data.contractInfo?.dropContractAddress || "";
        console.log("🎯 Drop contract address:", dropAddress);
        return dropAddress;
      } else {
        console.error("❌ API Response not ok:", response.status, response.statusText);
      }
    } catch (err) {
      console.error("❌ Failed to fetch drop contract address:", err);
    }
    return "";
  };

  // Handle Buy Packs action
  const handleBuyPacks = async () => {
    const slug = draftResult?.slug;
    if (!slug) {
      console.warn("No slug available for Buy Packs");
      return;
    }

    console.log("🛒 Buy Packs clicked, fetching contract for slug:", slug);
    const contractAddress = await fetchDropContractAddress(slug);
    if (contractAddress) {
      console.log("✅ Contract address fetched:", contractAddress);
      setDropContractAddress(contractAddress);
      setShowSuccessModal(false);
      setShowBuyModal(true);
    } else {
      console.error("❌ Failed to fetch contract address");
    }
  };

  // Complete Flow: Create Draft + Deploy Contracts (KISS - single action)
  const handleCompleteDeployment = async () => {
    if (!isConnected || !address) {
      setError("Please connect your wallet first");
      return;
    }

    // Check wallet mismatch first
    const storedAddress = localStorage.getItem('vibeAuthAddress');
    if (storedAddress && address && address !== storedAddress) {
      setError(`Please switch back to your authenticated wallet: ${storedAddress.substring(0, 6)}...${storedAddress.slice(-4)}`);
      return;
    }

    // Authenticate if needed
    console.log("🔍 Pre-auth check:", { token: token ? `${token.substring(0, 20)}...` : "null", isAuthenticated });
    let authToken = token;
    if (!authToken) {
      console.log("🚀 No token found, calling authenticate()...");
      authToken = await authenticate();
      console.log("🔍 Post-auth result:", { authToken: authToken ? `${authToken.substring(0, 20)}...` : "null" });
      if (!authToken) {
        console.error("❌ Authentication failed - no token returned");
        setError("Please connect wallet and authenticate");
        return;
      }
    } else {
      console.log("✅ Using existing token:", `${authToken.substring(0, 20)}...`);
    }

    try {
      setError("");

      // Step 1: Create draft (same logic)
      setIsCreatingDraft(true);
      setCurrentStep("deploy");

      // Upload custom featured image if provided
      let customFeaturedImageUrl = "";
      if (collectionData.customFeaturedImage) {
        const formData = new FormData();
        formData.append("image", collectionData.customFeaturedImage);

        const uploadResponse = await fetch("/api/vibe-image-upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Custom featured image upload failed");
        }

        const uploadResult = await uploadResponse.json();
        if (uploadResult.success && uploadResult.imageUrl) {
          customFeaturedImageUrl = uploadResult.imageUrl;
          console.log(
            "✅ Custom featured image uploaded:",
            customFeaturedImageUrl
          );
        } else {
          throw new Error("Custom featured image upload returned no URL");
        }
      }

      // Generate slug
      const slugResponse = await fetch("/api/vibe-generate-slug", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          packName: collectionData.name,
        }),
      });

      if (!slugResponse.ok) {
        throw new Error(`Slug generation failed: ${slugResponse.statusText}`);
      }

      const slugResult = await slugResponse.json();
      const vibeMarketSlug =
        slugResult.slug || slugResult.data?.slug || "generated-slug";

      console.log("🏷️ Vibe.Market generated slug:", vibeMarketSlug);

      // Build metadata payload for draft creation
      const featuredImageUrl =
        customFeaturedImageUrl ||
        uploadedFiles[collectionData.featuredIndex]?.uploadedUrl;

      const metadataPayload = {
        creator: address,
        name: collectionData.name,
        symbol: collectionData.symbol,
        description: collectionData.description,
        featuredImageUrl,
        metadataItems: uploadedFiles.map((file, index) => ({
          name: `${collectionData.name} #${index + 1}`,
          description: `${collectionData.description} - Item #${index + 1}`,
          imageUrl: file.uploadedUrl || "",
          rarity: file.rarity,
          tokenId: index + 1,
        })),
        bgColor: "#000000",
        disableFoil: !collectionData.enableFoil,
        disableWear: !collectionData.enableWear,
        isNSFW: collectionData.isNSFW,
        twitterLink: collectionData.twitterUsername
          ? `https://twitter.com/${collectionData.twitterUsername.replace(
              "@",
              ""
            )}`
          : "",
        websiteLink: collectionData.websiteUrl,
        packAmount: collectionData.packAmount,
        owner: collectionData.owner || address,
        slug: vibeMarketSlug,
      };

      // Create draft
      const response = await fetch("/api/vibe-metadata-draft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(metadataPayload),
      });

      if (!response.ok) {
        throw new Error(`Draft creation failed: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success || !result.data?.success) {
        throw new Error("Draft creation failed - invalid response");
      }

      // Validate draftId exists
      if (!result.data.draftId) {
        console.error("❌ API Response missing draftId:", result);
        throw new Error("Draft creation failed - no draftId returned from API");
      }

      const draftData = {
        success: true,
        draftId: result.data.draftId,
        slug: vibeMarketSlug,
        metadata: metadataPayload,
        contractConfig: generateContractConfig(vibeMarketSlug),
      };

      console.log("✅ Draft created successfully:", draftData);
      setDraftResult(draftData);
      setIsCreatingDraft(false);

      // Step 2: Deploy contracts immediately
      const deployResult = await deployCollection(
        draftData.draftId,
        draftData.metadata,
        draftData.slug,
        draftData.contractConfig
      );

      if (!deployResult.success || !deployResult.txHash) {
        throw new Error(deployResult.error || "Contract deployment failed");
      }

      setDeploymentResult(deployResult);
      setCurrentStep("confirm");

      // Step 3: Proceed to confirmation with draftData directly (no state dependency)
      await confirmDeploymentWithData(deployResult.txHash, draftData, authToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deployment failed");
      setIsCreatingDraft(false);
    }
  };

  // Step 3: Confirm with Vibe.Market - No state dependency, use passed data
  const confirmDeploymentWithData = async (txHash: string, draftData: any, authToken: string) => {
    try {
      setIsConfirming(true);
      setError("");

      console.log("✅ Confirming deployment with draftId:", draftData.draftId);

      // Direct API call to deployment confirmation endpoint
      const response = await fetch("/api/vibe-metadata-confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          draftId: draftData.draftId,
          txHash,
          dropContract: deploymentResult?.dropContract,
          tokenContract: deploymentResult?.tokenContract,
        }),
      });

      if (!response.ok) {
        throw new Error(`Confirmation failed: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        // Debug deployment result structure
        console.log("🔍 Full deploymentResult:", deploymentResult);
        console.log(
          "🔍 deploymentResult keys:",
          deploymentResult ? Object.keys(deploymentResult) : "null"
        );

        // Use contract address from deployment result (not confirmation response)
        const contractAddress = deploymentResult?.dropContract;

        console.log(
          "🔍 Using contract address from deployment:",
          contractAddress
        );

        const finalData = {
          success: true,
          contractAddress: contractAddress,
          tokenContract: deploymentResult?.tokenContract,
          collectionUrl: result.data?.collectionUrl,
          txHash: txHash,
        };

        setFinalResult(finalData);

        // Always proceed - collection is deployed and confirmed
        setCurrentStep("ready");

        if (contractAddress) {
          // If we have contract address, check readiness
          await checkCollectionReady(contractAddress);
        } else {
          // If no contract address, still show success (collection is deployed)
          console.warn(
            "⚠️ No contract address from deployment, showing success anyway"
          );
          setTimeout(() => {
            setCurrentStep("complete");
            setShowSuccessModal(true);
            onComplete(finalData);
          }, 2000); // Small delay to show "ready" step briefly
        }
      } else {
        throw new Error("Confirmation failed - invalid response");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Confirmation failed");
    } finally {
      setIsConfirming(false);
    }
  };

  // Step 4: Check Collection Readiness
  const checkCollectionReady = async (contractAddress: string) => {
    try {
      setIsCheckingReady(true);
      setError("");

      // Poll the ready endpoint until collection is ready
      const maxAttempts = 30; // 5 minutes max (10 second intervals)
      let attempts = 0;

      while (attempts < maxAttempts) {
        const response = await fetch(
          `/api/vibe-collection-ready?contractAddress=${contractAddress}&chainId=8453`,
          {
            method: "GET",
          }
        );

        if (response.ok) {
          const result = await response.json();

          if (result.success && result.data?.ready) {
            console.log("✅ Collection is ready!", result.data);
            setCurrentStep("complete");
            setShowSuccessModal(true);
            onComplete(finalResult);
            return;
          }
        }

        // Wait 10 seconds before next attempt
        await new Promise((resolve) => setTimeout(resolve, 10000));
        attempts++;
      }

      // If we get here, collection didn't become ready in time
      console.log(
        "⏰ Collection readiness check timed out, but deployment was successful"
      );
      setCurrentStep("complete");
      setShowSuccessModal(true);
      onComplete(finalResult);
    } catch (err) {
      console.error("❌ Collection readiness check failed:", err);
      // Don't fail the entire flow - just proceed to complete
      setCurrentStep("complete");
      setShowSuccessModal(true);
      onComplete(finalResult);
    } finally {
      setIsCheckingReady(false);
    }
  };

  const getStepStatus = (step: string) => {
    const stepOrder = ["draft", "deploy", "confirm", "ready", "complete"];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(step);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "pending";
  };

  const StepIcon = ({ step }: { step: string }) => {
    const status = getStepStatus(step);

    if (status === "completed") {
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    } else if (status === "active") {
      return <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />;
    } else {
      return <div className="w-6 h-6 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <div className="mx-auto space-y-6 max-w-2xl">
      <div className="space-y-6">
        {/* Collection Summary */}
        <div className="p-4">
          <h3 className="mb-4 font-medium text-black">What You're Creating</h3>

          {/* Collection Identity */}
          <div className="p-3 mb-4 bg-white rounded border-1 border-black/10">
            <h4 className="mb-2 text-lg font-bold text-black">
              {collectionData.name} ({collectionData.symbol})
            </h4>
            <div className="flex flex-wrap gap-2">
              <span
                className={`px-2 py-1 text-xs rounded border-1 ${
                  collectionData.enableFoil
                    ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                    : "bg-gray-100 text-gray-500 border-gray-300"
                }`}
              >
                {collectionData.enableFoil ? "Foil Enabled" : "No Foil"}
              </span>
              <span
                className={`px-2 py-1 text-xs rounded border-1 ${
                  collectionData.enableWear
                    ? "bg-orange-100 text-orange-800 border-orange-300"
                    : "bg-gray-100 text-gray-500 border-gray-300"
                }`}
              >
                {collectionData.enableWear ? "Wear Enabled" : "No Wear"}
              </span>
              <span
                className={`px-2 py-1 text-xs rounded border-1 ${
                  collectionData.isNSFW
                    ? "bg-red-100 text-red-800 border-red-300"
                    : "bg-green-100 text-green-800 border-green-300"
                }`}
              >
                {collectionData.isNSFW ? "🔞 NSFW" : "✅ Safe For Work"}
              </span>
            </div>
          </div>

          {/* Social Links */}
          <div className="p-3 mb-4 bg-white rounded border-1 border-black/10">
            <div className="flex flex-col gap-8 md:flex-row">
              <div className="flex gap-2 items-center">
                <span className="text-xs text-black/60">Twitter:</span>
                {collectionData.twitterUsername ? (
                  <a
                    href={`https://twitter.com/${collectionData.twitterUsername.replace(
                      "@",
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 underline hover:text-blue-800"
                  >
                    {collectionData.twitterUsername.startsWith("@")
                      ? collectionData.twitterUsername
                      : `@${collectionData.twitterUsername}`}
                  </a>
                ) : (
                  <span className="text-xs text-black/40">-</span>
                )}
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-xs text-black/60">Website:</span>
                {collectionData.websiteUrl ? (
                  <a
                    href={collectionData.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 underline break-all hover:text-blue-800"
                  >
                    {collectionData.websiteUrl}
                  </a>
                ) : (
                  <span className="text-xs text-black/40">-</span>
                )}
              </div>
            </div>
          </div>

          {/* Key Numbers - Mobile Responsive */}
          <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-3">
            <div className="p-3 text-center bg-white rounded border-1 border-black/10">
              <p className="text-2xl font-bold text-black">
                {uploadedFiles.length}
              </p>
              <p className="text-sm text-black/60">Total Items</p>
            </div>
            <div className="p-3 text-center bg-white rounded border-1 border-black/10">
              <p className="text-2xl font-bold text-black">
                {collectionData.packAmount || 0}
              </p>
              <p className="text-sm text-black/60">Packs Reserved</p>
            </div>
            <div className="p-3 text-center bg-white rounded border-1 border-black/10">
              <p className="font-mono text-xs text-black break-all">
                {collectionData.owner
                  ? `${collectionData.owner.slice(
                      0,
                      6
                    )}...${collectionData.owner.slice(-4)}`
                  : "Your Wallet"}
              </p>
              <p className="text-sm text-black/60">Owner</p>
            </div>
          </div>

          {/* Rarity Distribution */}
          <div className="p-3 bg-white rounded border-1 border-black/10">
            <h4 className="mb-3 font-medium text-black">Rarity Breakdown</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-center sm:grid-cols-3 md:grid-cols-5">
              {(() => {
                const rarityCount = {
                  Common: uploadedFiles.filter(
                    (f) => f.rarity.toLowerCase() === "common"
                  ).length,
                  Rare: uploadedFiles.filter(
                    (f) => f.rarity.toLowerCase() === "rare"
                  ).length,
                  Epic: uploadedFiles.filter(
                    (f) => f.rarity.toLowerCase() === "epic"
                  ).length,
                  Legendary: uploadedFiles.filter(
                    (f) => f.rarity.toLowerCase() === "legendary"
                  ).length,
                  Mythic: uploadedFiles.filter(
                    (f) => f.rarity.toLowerCase() === "mythic"
                  ).length,
                };

                const totalFiles = uploadedFiles.length;

                return Object.entries(rarityCount).map(([rarity, count]) => {
                  const percentage =
                    totalFiles > 0 ? Math.round((count / totalFiles) * 100) : 0;
                  return (
                    <div key={rarity} className="p-2">
                      <p className="text-lg font-bold text-black">{count}</p>
                      <p className="text-xs text-black/60">{rarity}</p>
                      <p className="text-xs text-black/40">{percentage}%</p>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* File Preview - Show user's images one last time */}
          <div className="p-3 mt-4 bg-white rounded border-1 border-black/10">
            <h4 className="mb-3 font-medium text-black">
              Your Images ({uploadedFiles.length})
            </h4>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
              {uploadedFiles.slice(0, 6).map((fileData, index) => (
                <div key={index} className="relative">
                  <img
                    src={
                      fileData.uploadedUrl || URL.createObjectURL(fileData.file)
                    }
                    alt={fileData.file.name}
                    className="object-cover w-full rounded aspect-square border-1 border-black/20"
                  />
                  <div className="flex absolute inset-0 justify-center items-center rounded bg-black/40">
                    <span className="text-xs font-medium text-white">
                      {fileData.rarity}
                    </span>
                  </div>
                  {index === collectionData.featuredIndex && (
                    <div className="flex absolute -top-1 -right-1 justify-center items-center w-4 h-4 bg-yellow-500 rounded-full">
                      <span className="text-xs text-black">★</span>
                    </div>
                  )}
                </div>
              ))}
              {uploadedFiles.length > 6 && (
                <div className="flex justify-center items-center bg-gray-100 rounded border-1 border-black/20 aspect-square">
                  <span className="text-xs font-medium text-black/60">
                    +{uploadedFiles.length - 6}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Simple Deployment Status */}
        <div className="pt-6 border-t border-black/10">
          {currentStep === "draft" && (
            <div className="space-y-4">
              {!isConnected ? (
                <Alert className="bg-yellow-50 border-yellow-200 border-1">
                  <AlertTriangle className="w-4 h-4" />
                  <AlertDescription className="text-yellow-800">
                    Please connect your wallet to create your collection.
                  </AlertDescription>
                </Alert>
              ) : (
                <Button
                  onClick={handleCompleteDeployment}
                  disabled={isCreatingDraft || isDeploying}
                  className="w-full"
                  size="lg"
                >
                  {isCreatingDraft || isDeploying ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      CREATING YOUR COLLECTION...
                    </>
                  ) : (
                    "CREATE COLLECTION"
                  )}
                </Button>
              )}
            </div>
          )}

          {(currentStep === "deploy" ||
            currentStep === "confirm" ||
            currentStep === "ready") && (
            <div className="space-y-4">
              <Alert className="bg-blue-50 border-blue-200 border-1">
                <div className="flex gap-2 items-center">
                  <Loader2 className="text-blue-600 animate-spin" size={18} />
                  <AlertDescription className="text-blue-700">
                    <span className="font-medium">
                      {currentStep === "deploy" &&
                        "Creating your collection on blockchain..."}
                      {currentStep === "confirm" && "Almost ready..."}
                      {currentStep === "ready" && "Finishing up..."}
                    </span>
                    <div className="mt-2 text-sm text-blue-600">
                      This may take a few minutes, please keep this page open.
                    </div>
                  </AlertDescription>
                </div>
              </Alert>
            </div>
          )}

          {currentStep === "complete" && finalResult && (
            <div className="space-y-4">
              <Alert className="bg-green-50 border-green-200 border-1">
                <div className="flex gap-2 items-center">
                  <CheckCircle className="text-green-600" size={18} />
                  <AlertDescription className="text-green-700">
                    <span className="font-bold">
                      🎉 Your Collection is Ready to Unpack!
                    </span>
                    <div className="mt-2 space-y-1">
                      {finalResult.collectionUrl && (
                        <a
                          href={finalResult.collectionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex gap-1 items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          View on Vibe.Market <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </AlertDescription>
                </div>
              </Alert>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <Alert className="bg-red-50 border-red-200 border-1">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back to Upload
          </Button>
          {currentStep === "complete" && (
            <Button onClick={() => window.location.reload()} className="flex-1">
              Create New Collection
            </Button>
          )}
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        collectionName={collectionData.name}
        featuredImageUrl={
          uploadedFiles[collectionData.featuredIndex]?.uploadedUrl
        }
        customFeaturedImage={collectionData.customFeaturedImage}
        slug={draftResult?.slug || ""}
        onBuyPacks={handleBuyPacks}
      />

      {/* Buy Modal */}
      <BuyModal
        isOpen={showBuyModal}
        onClose={() => {
          setShowBuyModal(false);
          setShowSuccessModal(true); // Return to SuccessModal
        }}
        tokenAddress={dropContractAddress as `0x${string}`}
        creatorAddress={address as `0x${string}`}
      />
    </div>
  );
};
