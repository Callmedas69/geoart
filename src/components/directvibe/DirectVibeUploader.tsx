"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAccount } from "wagmi";
import { useVibeAuth } from "@/hooks/useVibeAuth";
import { VibeFileUploadNew } from "./VibeFileUploadNew";
import { VibeCollectionForm } from "./VibeCollectionForm";
import { VibeDeploymentFlow } from "./VibeDeploymentFlow";
import { SpecificationModal } from "./SpecificationModal";

interface UploadedFile {
  file: File;
  rarity: string;
  uploadedUrl?: string;
}

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

export const DirectVibeUploader: React.FC = () => {
  const { address, isConnected } = useAccount();
  const vibeAuth = useVibeAuth();

  // KISS: Simple step-based state management
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState({
    files: [] as UploadedFile[],
    collectionData: null as CollectionData | null,
    authToken: null as string | null,
    result: null as any,
  });
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSpecModal, setShowSpecModal] = useState(false);

  // KISS: Simple step definition
  const steps = [
    { key: "connect", label: "Connect & Auth" },
    { key: "upload", label: "Upload Files" },
    { key: "details", label: "Card Details" },
    { key: "deploy", label: "Packing your card" },
  ];

  // KISS: Memoized handler functions for performance
  const handleStepComplete = useCallback(
    (stepIndex: number, data: any) => {
      setStepData((prev) => {
        const newData = { ...prev };
        switch (stepIndex) {
          case 0: // Authentication
            newData.authToken = data;
            break;
          case 1: // File Upload
            newData.files = data;
            break;
          case 2: // Collection Details
            newData.collectionData = data;
            break;
          case 3: // Deployment
            newData.result = data;
            break;
        }
        return newData;
      });

      // Move to next step (except for last step)
      if (stepIndex < steps.length - 1) {
        setCurrentStep(stepIndex + 1);
      }
    },
    [steps.length]
  );

  const handleStepBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  // Keyboard navigation support
  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent, stepIndex: number) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        // Only allow navigation to completed steps
        if (stepIndex < currentStep) {
          setCurrentStep(stepIndex);
        }
      }
    },
    [currentStep]
  );

  // Memoized step click handler
  const handleStepClick = useCallback(
    (stepIndex: number) => {
      // Allow clicking on completed steps to navigate back
      if (stepIndex < currentStep) {
        setCurrentStep(stepIndex);
      }
    },
    [currentStep]
  );

  // Memoized progress indicator for performance
  const progressIndicator = useMemo(
    () => (
      <div
        className="mx-auto mb-8 max-w-2xl"
        role="progressbar"
        aria-valuenow={currentStep + 1}
        aria-valuemin={1}
        aria-valuemax={steps.length}
        aria-label="Collection creation progress"
      >
        <div className="flex overflow-x-auto justify-center items-center">
          {steps.map((step, index) => (
            <div key={step.key} className="flex flex-shrink-0 items-center">
              {/* Geometric Step Indicator - Accessible & Responsive */}
              <div
                className={`
                w-8 h-8 sm:w-10 sm:h-10 border-1 border-black flex items-center justify-center font-bold text-xs sm:text-base
                ${
                  index === currentStep
                    ? "bg-black text-white"
                    : index < currentStep
                    ? "bg-white text-black opacity-60 cursor-pointer hover:opacity-80"
                    : "bg-white text-black opacity-40"
                }
                focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-opacity
              `}
                role="button"
                tabIndex={index === currentStep || index < currentStep ? 0 : -1}
                aria-label={`Step ${index + 1}: ${step.label}${
                  index === currentStep
                    ? " (current step)"
                    : index < currentStep
                    ? " (completed)"
                    : " (upcoming)"
                }`}
                aria-current={index === currentStep ? "step" : undefined}
                aria-pressed={index < currentStep}
                onKeyDown={(e) => handleKeyPress(e, index)}
                onClick={() => handleStepClick(index)}
              >
                {index < currentStep ? "✓" : index + 1}
              </div>

              {/* Connection Line - Responsive spacing */}
              {index < steps.length - 1 && (
                <div
                  className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 ${
                    index < currentStep
                      ? "bg-black opacity-60"
                      : "bg-black opacity-20"
                  }`}
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>

        {/* Current Step Label - Accessible & Responsive */}
        <div className="px-4 mt-8 text-center">
          <p
            className="text-base font-bold text-black sm:text-lg"
            id="current-step-label"
          >
            STEP {currentStep + 1} : {steps[currentStep].label.toUpperCase()}
          </p>
        </div>
      </div>
    ),
    [currentStep, steps, handleKeyPress, handleStepClick]
  );

  const handleAuthentication = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      if (!isConnected || !address) {
        throw new Error("Please connect your wallet first");
      }

      const token = await vibeAuth.authenticate();

      if (token) {
        handleStepComplete(0, token);
      } else {
        throw new Error("Authentication failed - no token returned");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mx-auto space-y-6 max-w-4xl">
      {/* KISS: Accessible Geometric Progress Indicator - Memoized for Performance */}
      {progressIndicator}

      {/* Error Display */}
      {error && (
        <Alert className="mx-auto max-w-2xl">
          <AlertDescription className="font-medium">
            ⚠️ {error}
          </AlertDescription>
        </Alert>
      )}

      {/* KISS: Single Active Step - Only current step visible */}
      <div className="mx-auto max-w-4xl">
        {currentStep === 0 && (
          <Card>
            <CardHeader className="border-black border-b-1">
              <CardTitle className="mb-2 text-xl">CONNECT WALLET</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Wallet Status */}
                <Card className="p-3">
                  <div className="flex gap-2 items-center">
                    {isConnected ? (
                      <>
                        <div className="w-4 h-4 bg-black"></div>
                        <span className="font-medium">Wallet Connected</span>
                        <span className="ml-auto text-sm">
                          {address?.slice(0, 6)}...{address?.slice(-4)}
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-4 h-4 border-black border-1" />
                        <span>Ready ?</span>
                      </>
                    )}
                  </div>
                </Card>

                {/* Clean Button - Geo theme built-in */}
                <Button
                  onClick={handleAuthentication}
                  disabled={isProcessing || !isConnected}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      AUTHENTICATING...
                    </>
                  ) : !isConnected ? (
                    "CONNECT WALLET FIRST"
                  ) : (
                    "AUTHENTICATE"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 1 && (
          <Card>
            <CardHeader className="border-black border-b-1">
              <CardTitle className="flex justify-between items-center mb-2 text-xl">
                <p>UPLOAD FILES</p>
                <button
                  onClick={() => setShowSpecModal(true)}
                  className="text-sm font-normal text-black underline transition-colors hover:text-gray-600"
                >
                  How it works
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VibeFileUploadNew
                onFilesUploaded={(files) => handleStepComplete(1, files)}
              />

              <Button
                onClick={handleStepBack}
                variant="secondary"
                className="mt-4"
              >
                ← BACK
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader className="border-black border-b-1">
              <CardTitle className="mb-2 text-xl">COLLECTION DETAILS</CardTitle>
            </CardHeader>
            <CardContent>
              <VibeCollectionForm
                files={stepData.files}
                onSubmit={(data) => handleStepComplete(2, data)}
                onBack={handleStepBack}
              />
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
            <CardHeader className="border-black border-b-1">
              <CardTitle className="mb-2 text-xl">
                YOUR LAST CHANCE BEFORE TAKING OFF
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VibeDeploymentFlow
                collectionData={stepData.collectionData!}
                uploadedFiles={stepData.files}
                onComplete={(result) => handleStepComplete(3, result)}
                onBack={handleStepBack}
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Specification Modal */}
      <SpecificationModal
        isOpen={showSpecModal}
        onClose={() => setShowSpecModal(false)}
      />
    </div>
  );
};
