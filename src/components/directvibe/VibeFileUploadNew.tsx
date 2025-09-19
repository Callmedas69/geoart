"use client";

import React, { useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  FileImage,
  FileText,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { VibeSpecsPanel } from "./VibeSpecsPanel";
import { useVibeAuth } from "@/hooks/useVibeAuth";
import Papa from "papaparse";

interface RarityData {
  filename: string;
  rarity: number; // 1-5 (1=common, 2=rare, 3=epic, 4=legendary, 5=mythic)
}

interface UploadedFile {
  file: File;
  rarity: string; // converted to string format for DirectVibe
  uploadedUrl?: string;
}

interface ValidationStatus {
  count: boolean;
  dimensions: boolean;
  size: boolean;
  format: boolean;
  csvMatch: boolean;
  rarityComplete: boolean;
}

interface FileUploadState {
  images: File[];
  csv: File | null;
  csvData: RarityData[];
  errors: string[];
  isValidated: boolean;
  uploadedFiles: UploadedFile[];
}

interface VibeFileUploadNewProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
}

// Rarity conversion mapping (vibe.market requires capitalized rarities)
const RARITY_MAP: { [key: number]: string } = {
  1: "Common",
  2: "Rare",
  3: "Epic",
  4: "Legendary",
  5: "Mythic",
};

const IMAGE_SPECS = {
  minWidth: 609,
  minHeight: 864,
  maxSize: 10 * 1024 * 1024, // 10MB
  formats: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
};

export const VibeFileUploadNew: React.FC<VibeFileUploadNewProps> = ({
  onFilesUploaded,
}) => {
  const vibeAuth = useVibeAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadState, setUploadState] = useState<FileUploadState>({
    images: [],
    csv: null,
    csvData: [],
    errors: [],
    isValidated: false,
    uploadedFiles: [],
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    current: 0,
    total: 0,
    currentFile: "",
  });
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>({
    count: false,
    dimensions: false,
    size: false,
    format: false,
    csvMatch: false,
    rarityComplete: false,
  });

  // File processing
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

    // Reset success state when new files are added
    setUploadSuccess(false);

    if (csvFiles[0]) {
      parseCSV(csvFiles[0]);
    }
  };

  const parseCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true, // Skip completely empty lines
      complete: (results) => {
        const errors: string[] = [];
        const csvData: RarityData[] = [];

        // Filter out empty/invalid rows before processing
        const validRows = results.data.filter((row: any) => {
          const filename = row.filename?.trim();
          const rarity = row.rarity?.trim();
          // Keep row only if it has both filename and rarity data
          return filename && rarity;
        });

        validRows.forEach((row: any, index) => {
          const filename = row.filename.trim();
          const rarity = parseInt(row.rarity.trim());

          // At this point filename is guaranteed to exist (filtered above)
          if (rarity < 1 || rarity > 5 || isNaN(rarity)) {
            errors.push(
              `Row with "${filename}": Invalid rarity (must be 1-5), found: ${row.rarity}`
            );
            return;
          }

          csvData.push({ filename, rarity });
        });

        setUploadState((prev) => ({
          ...prev,
          csvData,
          errors: errors.length > 0 ? errors : prev.errors,
          isValidated: false,
        }));
      },
      error: (error) => {
        setUploadState((prev) => ({
          ...prev,
          errors: [`CSV parsing failed: ${error.message}`],
          isValidated: false,
        }));
      },
    });
  };

  // Clear all files
  const clearAllFiles = () => {
    setUploadState({
      images: [],
      csv: null,
      csvData: [],
      errors: [],
      isValidated: false,
      uploadedFiles: [],
    });
    setUploadSuccess(false);
    setValidationStatus({
      count: false,
      dimensions: false,
      size: false,
      format: false,
      csvMatch: false,
      rarityComplete: false,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Validation
  const validateFiles = async () => {
    setIsValidating(true);
    const errors: string[] = [];
    const imageFilenames = uploadState.images.map((f) => f.name);
    const csvFilenames = uploadState.csvData.map((d) => d.filename);

    // File count validation (5-1000)
    const countValid =
      uploadState.images.length >= 5 && uploadState.images.length <= 1000;
    if (!countValid) {
      errors.push(
        `Image count must be between 5-1000. Found: ${uploadState.images.length}`
      );
    }

    // Image specs validation
    let dimensionsValid = true;
    let sizeValid = true;
    let formatValid = true;

    for (const image of uploadState.images) {
      // Size validation
      if (image.size > IMAGE_SPECS.maxSize) {
        errors.push(`${image.name} exceeds 10MB limit`);
        sizeValid = false;
      }

      // Format validation
      if (!IMAGE_SPECS.formats.includes(image.type)) {
        errors.push(
          `${image.name} has unsupported format. Use PNG, JPG, or WebP`
        );
        formatValid = false;
      }

      // Dimension validation (async)
      try {
        const dimensions = await getImageDimensions(image);
        if (
          dimensions.width < IMAGE_SPECS.minWidth ||
          dimensions.height < IMAGE_SPECS.minHeight
        ) {
          errors.push(`${image.name} is too small. Minimum: 609x864px`);
          dimensionsValid = false;
        }
      } catch (err) {
        errors.push(`${image.name} could not be processed`);
        dimensionsValid = false;
      }
    }

    // CSV-Image matching (case-insensitive)
    const csvFilenamesLower = csvFilenames.map((f) => f.toLowerCase());
    const imageFilenamesLower = imageFilenames.map((f) => f.toLowerCase());

    const csvMatchValid =
      csvFilenamesLower.length === imageFilenamesLower.length &&
      csvFilenamesLower.every((filename) =>
        imageFilenamesLower.includes(filename)
      ) &&
      imageFilenamesLower.every((filename) =>
        csvFilenamesLower.includes(filename)
      );

    if (!csvMatchValid) {
      // Check for missing images (case-insensitive)
      csvFilenames.forEach((filename) => {
        const found = imageFilenames.find(
          (imgFile) => imgFile.toLowerCase() === filename.toLowerCase()
        );
        if (!found) {
          errors.push(`Image missing for CSV entry: "${filename}"`);
        }
      });

      // Check for missing CSV entries (case-insensitive)
      imageFilenames.forEach((filename) => {
        const found = csvFilenames.find(
          (csvFile) => csvFile.toLowerCase() === filename.toLowerCase()
        );
        if (!found) {
          errors.push(`CSV entry missing for image: "${filename}"`);
        }
      });
    }

    // Rarity completeness (must have all 5 rarities)
    const rarities = uploadState.csvData.map((d) => d.rarity);
    const uniqueRarities = [...new Set(rarities)];
    const rarityComplete =
      uniqueRarities.length === 5 &&
      [1, 2, 3, 4, 5].every((r) => uniqueRarities.includes(r));

    if (!rarityComplete) {
      const missing = [1, 2, 3, 4, 5].filter(
        (r) => !uniqueRarities.includes(r)
      );
      errors.push(
        `Missing rarities: ${missing.map((r) => RARITY_MAP[r]).join(", ")}`
      );
    }

    // Update validation status
    const newValidationStatus: ValidationStatus = {
      count: countValid,
      dimensions: dimensionsValid,
      size: sizeValid,
      format: formatValid,
      csvMatch: csvMatchValid,
      rarityComplete: rarityComplete,
    };

    setValidationStatus(newValidationStatus);
    setUploadState((prev) => ({
      ...prev,
      errors,
      isValidated: errors.length === 0,
    }));
    setIsValidating(false);
  };

  const getImageDimensions = (
    file: File
  ): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  // Simple batched upload to prevent API overload
  const uploadFiles = async () => {
    if (!uploadState.isValidated) return;

    try {
      setIsUploading(true);
      setUploadProgress({
        current: 0,
        total: uploadState.images.length,
        currentFile: "",
      });

      // Authenticate if needed
      let authToken = vibeAuth.getToken();
      if (!authToken) {
        console.log("🚀 No token found in VibeFileUploadNew, calling authenticate()...");
        authToken = await vibeAuth.authenticate();
        if (!authToken) {
          throw new Error("Please connect wallet and authenticate");
        }
      }

      const uploadedFiles: UploadedFile[] = [];
      const batchSize = 3;

      // Process images in batches of 3
      for (let i = 0; i < uploadState.images.length; i += batchSize) {
        const batch = uploadState.images.slice(i, i + batchSize);

        const batchPromises = batch.map(async (image) => {
          const csvEntry = uploadState.csvData.find(
            (d) => d.filename.toLowerCase() === image.name.toLowerCase()
          );

          if (!csvEntry) return null;

          setUploadProgress((prev) => ({
            ...prev,
            currentFile: image.name,
          }));

          const formData = new FormData();
          formData.append("image", image);

          const response = await fetch("/api/vibe-image-upload", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Upload failed for ${image.name}`);
          }

          const result = await response.json();
          if (!result.success || !result.imageUrl) {
            throw new Error(
              `Upload failed for ${image.name}: ${
                result.error || "No image URL returned"
              }`
            );
          }

          return {
            file: image,
            rarity: RARITY_MAP[csvEntry.rarity],
            uploadedUrl: result.imageUrl,
          };
        });

        const batchResults = await Promise.all(batchPromises);

        batchResults.forEach((result, idx) => {
          setUploadProgress((prev) => ({
            ...prev,
            current: i + idx + 1,
          }));

          if (result) {
            uploadedFiles.push(result);
          }
        });
      }

      setUploadState((prev) => ({ ...prev, uploadedFiles }));
      setUploadSuccess(true);
      onFilesUploaded(uploadedFiles);
    } catch (err) {
      setUploadState((prev) => ({
        ...prev,
        errors: [err instanceof Error ? err.message : "Upload failed"],
      }));
      setUploadSuccess(false);
    } finally {
      setIsUploading(false);
      setUploadProgress({ current: 0, total: 0, currentFile: "" });
    }
  };

  // Get rarity distribution for specs panel (lowercase keys to match VibeSpecsPanel)
  const getRarityDistribution = () => {
    const distribution: Record<string, number> = {
      common: 0,
      rare: 0,
      epic: 0,
      legendary: 0,
      mythic: 0,
    };

    uploadState.csvData.forEach((item) => {
      const rarityString = RARITY_MAP[item.rarity];
      if (rarityString) {
        distribution[rarityString.toLowerCase()]++;
      }
    });

    return distribution;
  };

  const hasPreviewData =
    uploadState.images.length > 0 && uploadState.csvData.length > 0;

  // Status icon component for validation indicators - always visible with dynamic colors
  const StatusIcon = ({
    status,
    hasRun = false,
  }: {
    status: boolean;
    hasRun?: boolean;
  }) => {
    if (!hasRun) {
      return <Clock className="w-4 h-4 text-gray-400" />;
    }
    if (status) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="bg-white border-black border-1">
        <CardContent className="space-y-4">
          {/* Drag & Drop Area - Always visible */}
          <div
            className="p-8 space-y-4 rounded border-dashed cursor-pointer border-1 border-black/30 hover:border-black/50"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="flex gap-2 justify-center items-center">
              <Upload className="w-4 h-4 text-black/40" />
              <span className="text-sm text-black/60">
                Drop image + csv or browse
              </span>
            </div>
            <div className="flex justify-center items-center">
              <span className="text-xs text-black/60">
                CSV format: "filename","rarity" (1=common, 2=rare, 3=epic,
                4=legendary, 5=mythic)
              </span>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.csv"
            className="hidden"
            onChange={handleFileInput}
          />

          {/* Upload Summary */}
          {(uploadState.images.length > 0 || uploadState.csv) && (
            <div className="flex gap-8">
              {uploadState.images.length > 0 && (
                <div className="flex gap-2 items-center text-sm">
                  <FileImage className="w-4 h-4 text-green-600" />
                  <span className="text-black/80">
                    {uploadState.images.length} images
                  </span>
                </div>
              )}
              {uploadState.csv && (
                <div className="flex gap-2 items-center text-sm">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="text-black/80">
                    CSV: {uploadState.csv.name}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* CSV Validation Progress - Always visible when CSV loaded */}
          {uploadState.csv && (
            <div className="space-y-2">
              <span className="text-xs text-black/80">
                CSV:{" "}
                {isValidating
                  ? "Validating..."
                  : uploadState.isValidated
                  ? "Valid"
                  : "Ready"}
              </span>
              <Progress
                value={isValidating ? 50 : uploadState.isValidated ? 100 : 0}
                className="h-2"
              />

              {/* Validation Status - Always visible with dynamic colors */}
              {hasPreviewData && (
                <div className="p-2 bg-white rounded border-1 border-black/20">
                  <div className="flex gap-6 justify-between text-xs">
                    <div className="flex gap-2 items-center">
                      <StatusIcon
                        status={validationStatus.count}
                        hasRun={
                          isValidating ||
                          uploadState.isValidated ||
                          uploadState.errors.length > 0
                        }
                      />
                      <span className="text-black/80">Count (5-1000)</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <StatusIcon
                        status={validationStatus.csvMatch}
                        hasRun={
                          isValidating ||
                          uploadState.isValidated ||
                          uploadState.errors.length > 0
                        }
                      />
                      <span className="text-black/80">CSV Match</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <StatusIcon
                        status={
                          validationStatus.dimensions &&
                          validationStatus.size &&
                          validationStatus.format
                        }
                        hasRun={
                          isValidating ||
                          uploadState.isValidated ||
                          uploadState.errors.length > 0
                        }
                      />
                      <span className="text-black/80">Size & Format</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <StatusIcon
                        status={validationStatus.rarityComplete}
                        hasRun={
                          isValidating ||
                          uploadState.isValidated ||
                          uploadState.errors.length > 0
                        }
                      />
                      <span className="text-black/80">All Rarities</span>
                    </div>
                  </div>

                  {uploadState.errors.length > 0 && (
                    <div className="p-2 mt-2 bg-red-50 rounded border-red-200 border-1">
                      <p className="text-sm text-red-700">
                        {uploadState.errors[0]}
                      </p>
                      {uploadState.errors.length > 1 && (
                        <p className="mt-1 text-xs text-red-600">
                          +{uploadState.errors.length - 1} more issues
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Upload Progress - Always visible when images loaded */}
          {uploadState.images.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs text-black/80">
                Upload:{" "}
                {isUploading
                  ? `${uploadProgress.current}/${uploadProgress.total}`
                  : "Ready"}
              </span>
              <Progress
                value={
                  isUploading
                    ? (uploadProgress.current / uploadProgress.total) * 100
                    : 0
                }
                className="h-2"
              />
              {isUploading && uploadProgress.currentFile && (
                <div className="text-xs truncate text-black/60">
                  Current: {uploadProgress.currentFile}
                </div>
              )}
            </div>
          )}

          {/* Rarity Distribution - Simple Grid */}
          {hasPreviewData && (
            <div className="grid grid-cols-5 gap-2 py-8 text-center">
              {Object.entries(getRarityDistribution()).map(
                ([rarity, count]) => {
                  const percentage =
                    uploadState.images.length > 0
                      ? Math.round((count / uploadState.images.length) * 100)
                      : 0;
                  return (
                    <div key={rarity} className="p-2 bg-white rounded border-1">
                      <div className="text-lg font-bold text-black">
                        {count}
                      </div>
                      <div className="text-xs capitalize text-black/60">
                        {rarity}
                      </div>
                      <div className="text-xs text-black/40">{percentage}%</div>
                    </div>
                  );
                }
              )}
            </div>
          )}

          {/* Action Buttons - Responsive Layout */}
          {hasPreviewData && !uploadState.isValidated && (
            <div className="flex flex-col gap-2 sm:flex-row">
              {(uploadState.images.length > 0 || uploadState.csv) &&
                !uploadSuccess && (
                  <Button
                    onClick={clearAllFiles}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    CLEAR ALL
                  </Button>
                )}
              <Button
                onClick={validateFiles}
                disabled={isValidating}
                size="sm"
                className="flex-1"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="mr-2 w-3 h-3 animate-spin" />
                    VALIDATING...
                  </>
                ) : (
                  "VALIDATE FILES"
                )}
              </Button>
            </div>
          )}

          {uploadState.isValidated && (
            <Button
              onClick={uploadFiles}
              disabled={isUploading}
              className="w-full"
              size="sm"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 w-3 h-3 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </Button>
          )}

          {/* Success Badge */}
          {uploadSuccess && (
            <div className="flex gap-2 items-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-700">
                UPLOAD SUCCESSFUL
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Specs Panel */}
      <VibeSpecsPanel
        imageCount={uploadState.images.length}
        validationStatus={validationStatus}
        rarityDistribution={getRarityDistribution()}
        errors={uploadState.errors}
        images={uploadState.images}
      />
    </div>
  );
};
