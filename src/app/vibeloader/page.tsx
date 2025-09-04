"use client";

import React, { useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert } from "@/components/ui/alert";
import {
  Upload,
  FileImage,
  FileText,
  AlertCircle,
  CheckCircle,
  Wallet,
  ExternalLink,
  Copy,
  Info,
} from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Papa from "papaparse";
import { useVibeDeployment } from "@/hooks/useVibeDeployment";
import { DeploymentProgress } from "@/services/vibeDeployment";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CustomConnectButton } from "@/components/CustomConnectButton";

interface RarityData {
  filename: string;
  rarity: number;
}

interface FileUploadState {
  images: File[];
  csv: File | null;
  csvData: RarityData[];
  errors: string[];
  isValidated: boolean;
}

interface CollectionConfig {
  tokenName: string;
  tokenSymbol: string;
  nftName: string;
  nftSymbol: string;
  description?: string;
  twitterUsername?: string;
  website?: string;
  bgColor: string;
  packImage?: File;
  useFoil: boolean;
  useWear: boolean;
  isNSFW: boolean;
}

const Vibeloader = () => {
  const [uploadState, setUploadState] = useState<FileUploadState>({
    images: [],
    csv: null,
    csvData: [],
    errors: [],
    isValidated: false,
  });

  const [config, setConfig] = useState<CollectionConfig>({
    tokenName: "",
    tokenSymbol: "",
    nftName: "",
    nftSymbol: "",
    bgColor: "#0072F1",
    useFoil: true,
    useWear: true,
    isNSFW: false,
  });

  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<string>("");

  const { address, isConnected } = useAccount();
  const {
    isDeploying,
    deploymentResult,
    error: deploymentError,
    deployCollection,
    resetDeployment,
    isWalletConnected,
  } = useVibeDeployment({
    onProgress: (progress: DeploymentProgress) => {
      setDeploymentProgress(progress.progress);
      setCurrentStep(progress.step);
    },
  });

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      processFiles(files);
    },
    []
  );

  const processFiles = (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    const csvFiles = files.filter((file) => file.name.endsWith(".csv"));

    setUploadState((prev) => ({
      ...prev,
      images: [...prev.images, ...imageFiles],
      csv: csvFiles[0] || prev.csv,
      errors: [],
      isValidated: false,
    }));

    if (csvFiles[0]) {
      parseCSV(csvFiles[0]);
    }
  };

  const parseCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const errors: string[] = [];
        const csvData: RarityData[] = [];

        results.data.forEach((row: any, index) => {
          const filename = row.filename?.trim();
          const rarity = parseInt(row.rarity);

          if (!filename) {
            errors.push(`Row ${index + 1}: Missing filename`);
            return;
          }

          if (!rarity || rarity < 1 || rarity > 5) {
            errors.push(`Row ${index + 1}: Invalid rarity (must be 1-5)`);
            return;
          }

          csvData.push({ filename, rarity });
        });

        setUploadState((prev) => ({
          ...prev,
          csvData,
          errors,
          isValidated: errors.length === 0,
        }));
      },
      error: (error) => {
        setUploadState((prev) => ({
          ...prev,
          errors: [`CSV Parse Error: ${error.message}`],
          isValidated: false,
        }));
      },
    });
  };

  const validateFiles = () => {
    const errors: string[] = [];
    const imageFilenames = uploadState.images.map((f) => f.name);
    const csvFilenames = uploadState.csvData.map((d) => d.filename);

    // Check if all CSV filenames have corresponding images
    csvFilenames.forEach((filename) => {
      if (!imageFilenames.includes(filename)) {
        errors.push(`Image missing for: ${filename}`);
      }
    });

    // Check if all images have CSV entries
    imageFilenames.forEach((filename) => {
      if (!csvFilenames.includes(filename)) {
        errors.push(`CSV entry missing for: ${filename}`);
      }
    });

    setUploadState((prev) => ({
      ...prev,
      errors,
      isValidated: errors.length === 0,
    }));
  };

  const isReadyToDeploy =
    uploadState.isValidated &&
    config.tokenName &&
    config.tokenSymbol &&
    config.nftName &&
    config.nftSymbol &&
    isConnected;

  const handleDeployment = async () => {
    if (!isReadyToDeploy) return;

    await deployCollection(config, uploadState.images, uploadState.csvData);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="container px-4 py-8 mx-auto max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">
          VibeMarket NFT Collection Deployer
        </h1>
        <p className="text-muted-foreground">
          Deploy your NFT collection on VibeMarket bonding curve platform
        </p>
      </div>

      {/* Technical Specifications */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            <Info className="w-5 h-5 text-blue-600" />
            VibeMarket Pack Creation Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900">Image Requirements</h4>
              <ul className="space-y-1 text-blue-800">
                <li>
                  • <Badge variant="secondary">PNG, JPG, WebP</Badge> formats
                  only
                </li>
                <li>
                  • <Badge variant="secondary">609×864px</Badge> minimum
                  recommended
                </li>
                <li>
                  • <Badge variant="secondary">10MB</Badge> max file size
                </li>
                <li>
                  • <Badge variant="secondary">100MP</Badge> max resolution
                </li>
                <li>• No animated GIFs supported</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900">Collection Limits</h4>
              <ul className="space-y-1 text-blue-800">
                <li>
                  • <Badge variant="secondary">4-1000</Badge> images per pack
                </li>
                <li>
                  • <Badge variant="secondary">100</Badge> files per upload
                  batch
                </li>
                <li>
                  • <Badge variant="secondary">18</Badge> character pack name
                  limit
                </li>
                <li>
                  • <Badge variant="secondary">5</Badge> character symbol limit
                </li>
                <li>• 1 card per booster pack</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Upload Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="p-8 text-center rounded-lg border-2 border-gray-300 border-dashed transition-colors cursor-pointer hover:border-gray-400"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <Upload className="mx-auto mb-4 w-12 h-12 text-gray-400" />
            <p className="mb-2 text-lg font-medium">Drop your files here</p>
            <p className="mb-4 text-sm text-muted-foreground">
              Upload images (.jpg, .png, .gif) and CSV file (filename,rarity)
            </p>
            <Button variant="outline">Choose Files</Button>
            <input
              id="file-input"
              type="file"
              multiple
              accept="image/*,.csv"
              className="hidden"
              onChange={handleFileInput}
            />
          </div>

          {/* File Summary */}
          {(uploadState.images.length > 0 || uploadState.csv) && (
            <div className="mt-4 space-y-2">
              {uploadState.images.length > 0 && (
                <div className="flex gap-2 items-center">
                  <FileImage className="w-4 h-4" />
                  <span>{uploadState.images.length} images uploaded</span>
                </div>
              )}
              {uploadState.csv && (
                <div className="flex gap-2 items-center">
                  <FileText className="w-4 h-4" />
                  <span>CSV file: {uploadState.csv.name}</span>
                </div>
              )}
            </div>
          )}

          {/* Validation Button */}
          {uploadState.images.length > 0 && uploadState.csv && (
            <Button onClick={validateFiles} className="mt-4">
              Validate Files
            </Button>
          )}

          {/* Errors */}
          {uploadState.errors.length > 0 && (
            <Alert className="mt-4">
              <AlertCircle className="w-4 h-4" />
              <div>
                <h4 className="font-medium">Validation Errors:</h4>
                <ul className="mt-1 list-disc list-inside">
                  {uploadState.errors.map((error, index) => (
                    <li key={index} className="text-sm">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            </Alert>
          )}

          {/* Success */}
          {uploadState.isValidated && (
            <Alert className="mt-4">
              <CheckCircle className="w-4 h-4" />
              <div>
                <h4 className="font-medium">Files validated successfully!</h4>
                <p className="text-sm">Ready to configure collection</p>
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Collection Configuration */}
      {uploadState.isValidated && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Collection Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tokenName">Token Name *</Label>
                <Input
                  id="tokenName"
                  type="text"
                  placeholder="e.g., MyArt Token"
                  value={config.tokenName}
                  maxLength={18}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      tokenName: e.target.value,
                    }))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  {config.tokenName.length}/18 characters
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tokenSymbol">Token Symbol *</Label>
                <Input
                  id="tokenSymbol"
                  type="text"
                  placeholder="e.g., MYART"
                  value={config.tokenSymbol}
                  maxLength={5}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      tokenSymbol: e.target.value.toUpperCase(),
                    }))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  {config.tokenSymbol.length}/5 characters
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nftName">NFT Collection Name *</Label>
                <Input
                  id="nftName"
                  type="text"
                  placeholder="e.g., MyArt NFTs"
                  value={config.nftName}
                  maxLength={18}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, nftName: e.target.value }))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  {config.nftName.length}/18 characters
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nftSymbol">NFT Symbol *</Label>
                <Input
                  id="nftSymbol"
                  type="text"
                  placeholder="e.g., MYNFT"
                  value={config.nftSymbol}
                  maxLength={5}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      nftSymbol: e.target.value.toUpperCase(),
                    }))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  {config.nftSymbol.length}/5 characters
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Collection description (optional)"
                value={config.description || ""}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter Username</Label>
                <Input
                  id="twitter"
                  type="text"
                  placeholder="Without @ symbol"
                  value={config.twitterUsername || ""}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      twitterUsername: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://example.com"
                  value={config.website || ""}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, website: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bgColor">Background Color</Label>
              <div className="flex gap-3 items-center">
                <input
                  id="bgColor"
                  type="color"
                  className="w-12 h-10 rounded-md border cursor-pointer"
                  value={config.bgColor}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, bgColor: e.target.value }))
                  }
                />
                <Input
                  type="text"
                  className="w-24"
                  value={config.bgColor}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, bgColor: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Features</h4>
              <label className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={config.useFoil}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      useFoil: e.target.checked,
                    }))
                  }
                />
                <span className="text-sm">Enable Foil Effects</span>
              </label>
              <label className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={config.useWear}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      useWear: e.target.checked,
                    }))
                  }
                />
                <span className="text-sm">Enable Wear Mechanics</span>
              </label>
              <label className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={config.isNSFW}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, isNSFW: e.target.checked }))
                  }
                />
                <span className="text-sm">NSFW Content</span>
              </label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wallet Connection */}
      {uploadState.isValidated && !isConnected && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <Wallet className="w-5 h-5" />
              Connect Wallet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              Connect your wallet to deploy your collection to VibeMarket on
              Base network.
            </p>
            <div className="flex justify-center">
              <CustomConnectButton />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deployment Section */}
      {isReadyToDeploy && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Deploy Collection</CardTitle>
          </CardHeader>
          <CardContent>
            {!isDeploying && !deploymentResult && (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                  <span className="text-sm font-medium">Connected Wallet:</span>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </Badge>
                </div>

                <Button onClick={handleDeployment} className="w-full" size="lg">
                  Deploy to VibeMarket
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  This will create 3 contracts: NFT Collection, Bonding Curve
                  Token, and Uniswap V3 Pool
                </p>
              </div>
            )}

            {isDeploying && (
              <div className="space-y-4">
                <Progress value={deploymentProgress} className="w-full" />
                <div className="text-sm text-center text-muted-foreground">
                  {currentStep}
                </div>
                <div className="text-xs text-center text-muted-foreground">
                  {deploymentProgress}% complete
                </div>
              </div>
            )}

            {deploymentError && (
              <Alert className="mt-4">
                <AlertCircle className="w-4 h-4" />
                <div>
                  <h4 className="font-medium">Deployment Failed</h4>
                  <p className="mt-1 text-sm">{deploymentError}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetDeployment}
                    className="mt-2"
                  >
                    Try Again
                  </Button>
                </div>
              </Alert>
            )}

            {deploymentResult && (
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="w-4 h-4" />
                  <div>
                    <h4 className="font-medium">Deployment Successful! 🎉</h4>
                    <p className="mt-1 text-sm">
                      Your collection is now live on VibeMarket
                    </p>
                  </div>
                </Alert>

                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-muted">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">NFT Contract:</span>
                      <div className="flex gap-2 items-center">
                        <Badge variant="outline" className="font-mono text-xs">
                          {deploymentResult.dropAddress.slice(0, 6)}...
                          {deploymentResult.dropAddress.slice(-4)}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(deploymentResult.dropAddress)
                          }
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Token Contract:
                      </span>
                      <div className="flex gap-2 items-center">
                        <Badge variant="outline" className="font-mono text-xs">
                          {deploymentResult.tokenAddress.slice(0, 6)}...
                          {deploymentResult.tokenAddress.slice(-4)}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(deploymentResult.tokenAddress)
                          }
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() =>
                      window.open(deploymentResult.marketURL, "_blank")
                    }
                    className="w-full"
                    size="lg"
                  >
                    <ExternalLink className="mr-2 w-4 h-4" />
                    View on VibeMarket
                  </Button>

                  <Button
                    variant="outline"
                    onClick={resetDeployment}
                    className="w-full"
                  >
                    Deploy Another Collection
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex gap-2 items-start">
              <FileImage className="h-4 w-4 mt-0.5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">File Requirements</p>
                <p className="text-sm text-muted-foreground">
                  Upload images (PNG, JPG, WebP) and CSV with filename,rarity
                  format
                </p>
              </div>
            </div>
            <div className="flex gap-2 items-start">
              <Badge className="mt-0.5">1-5</Badge>
              <div>
                <p className="text-sm font-medium">Rarity Scale</p>
                <p className="text-sm text-muted-foreground">
                  1=Common, 2=Rare, 3=Epic, 4=Legendary, 5=Mythic
                </p>
              </div>
            </div>
            <div className="flex gap-2 items-start">
              <Wallet className="h-4 w-4 mt-0.5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Base Network</p>
                <p className="text-sm text-muted-foreground">
                  Ensure you have ETH on Base network for gas fees
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Vibeloader;
