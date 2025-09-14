"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Settings,
  ArrowLeft,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { generateSlug } from "@/utils/slugGenerator";
import {
  generateTokenSymbol,
  isValidTokenSymbol,
} from "@/utils/tokenSymbolGenerator";

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

interface VibeCollectionFormProps {
  files: UploadedFile[];
  onSubmit: (data: CollectionData) => void;
  onBack: () => void;
}

export const VibeCollectionForm: React.FC<VibeCollectionFormProps> = ({
  files,
  onSubmit,
  onBack,
}) => {
  const [formData, setFormData] = useState<CollectionData>({
    name: "My Collection",
    symbol: "MCL",
    description: "My awesome NFT collection on Vibe.Market",
    featuredIndex: 0,
    enableFoil: true,
    enableWear: true,
    isNSFW: false,
    twitterUsername: "",
    websiteUrl: "",
    packAmount: 0, // Default: no packs purchased on deployment
    owner: "", // Default: empty (will use connected wallet)
  });
  const [customFeaturedFile, setCustomFeaturedFile] = useState<File | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (
    field: keyof CollectionData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-generate token symbol when collection name changes
    if (field === "name" && typeof value === "string") {
      const tokenSymbol = generateTokenSymbol(value);
      setFormData((prev) => ({ ...prev, symbol: tokenSymbol }));
    }
  };

  const handleCustomFeaturedUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setCustomFeaturedFile(file);
      setFormData((prev) => ({ ...prev, customFeaturedImage: file }));
    }
  };

  const isValid =
    formData.name.trim() &&
    formData.symbol.trim() &&
    formData.description.trim();

  // Pagination logic
  const itemsPerPage = 6;
  const totalPages = Math.ceil(files.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const currentFiles = files.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mobile-first layout: stack on mobile, side-by-side on desktop */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Custom Featured Image Upload */}
          <div className="flex-shrink-0 w-full lg:w-64 lg:h-64">
            <input
              type="file"
              accept="image/*"
              onChange={handleCustomFeaturedUpload}
              className="hidden"
              id="customFeatured"
            />
            <Label
              htmlFor="customFeatured"
              className="block overflow-hidden w-full h-72 rounded-lg border-dashed transition-colors cursor-pointer border-1 border-black/30 hover:border-black/50"
            >
              {customFeaturedFile ? (
                <div className="relative w-full h-full group">
                  <img
                    src={URL.createObjectURL(customFeaturedFile)}
                    alt="Custom featured"
                    className="object-contain p-2 w-full h-72"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCustomFeaturedFile(null);
                      setFormData((prev) => ({
                        ...prev,
                        customFeaturedImage: undefined,
                      }));
                    }}
                    className="flex absolute top-2 right-2 z-10 justify-center items-center w-6 h-6 text-xl text-red-600 rounded-full transition-colors"
                  >
                    ×
                  </button>
                  <div className="flex absolute inset-0 justify-center items-center transition-colors bg-black/0 group-hover:bg-black/20">
                    <span className="text-sm font-medium text-white opacity-0 group-hover:opacity-100">
                      Click to change
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center w-full h-full text-black/60">
                  <Upload size={24} className="mb-2" />
                  <span className="text-xs italic">Custom Featured Image</span>
                </div>
              )}
            </Label>
            <p className="mt-2 text-xs italic text-black/60">
              Upload a custom image or select from collection items below
            </p>
          </div>

          {/* Form Fields */}
          <div className="flex-1 space-y-6">
            {/* Collection Info */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name" className="mb-1 text-black/80">
                  Collection Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Enter collection name"
                  className="italic bg-white text-black/50 border-1 border-black/30"
                  required
                />
              </div>
              <div>
                <Label htmlFor="symbol" className="mb-1 text-black/80">
                  Symbol
                </Label>
                <Input
                  id="symbol"
                  value={formData.symbol}
                  onChange={(e) =>
                    updateField("symbol", e.target.value.toUpperCase())
                  }
                  placeholder="e.g. TST"
                  className="italic bg-white text-black/50 border-1 border-black/30"
                  maxLength={10}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="mb-1 text-black/80">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Describe your collection..."
                className="italic bg-white text-black/50 border-black/30"
                rows={3}
                required
              />
            </div>

            {/* Social & Settings */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="twitterUsername" className="mb-1 text-black/80">
                  Twitter Username
                </Label>
                <Input
                  id="twitterUsername"
                  value={formData.twitterUsername}
                  onChange={(e) =>
                    updateField("twitterUsername", e.target.value)
                  }
                  placeholder="@username"
                  className="italic bg-white text-black/50 border-1 border-black/30"
                />
              </div>
              <div>
                <Label htmlFor="websiteUrl" className="mb-1 text-black/80">
                  Website URL
                </Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => updateField("websiteUrl", e.target.value)}
                  placeholder="https://example.com"
                  className="italic bg-white text-black/50 border-1 border-black/30"
                />
              </div>
            </div>

            {/* Advanced Deployment Settings*/}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Pack Amount */}
              <div>
                <Label htmlFor="packAmount" className="mb-1 text-black/80">
                  Pre-buy
                </Label>
                <Input
                  id="packAmount"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.packAmount}
                  onChange={(e) =>
                    updateField("packAmount", parseInt(e.target.value) || 0)
                  }
                  placeholder="0"
                  className="text-black/40 bg-gray-100 border-1 border-black/20 placeholder:text-black/30 cursor-not-allowed"
                  disabled
                />
                <p className="mt-1 text-xs italic text-black/40">
                  Reserved packs before anyone else (max : 100)
                </p>
              </div>

              {/* Owner Address */}
              <div>
                <Label htmlFor="owner" className="mb-1 text-black/80">
                  Owner Address
                </Label>
                <Input
                  id="owner"
                  type="text"
                  value={formData.owner || ""}
                  onChange={(e) => updateField("owner", e.target.value)}
                  placeholder="optional"
                  className="text-black bg-white border-1 border-black/30 placeholder:text-black/50 placeholder:italic"
                />
                <p className="mt-1 text-xs italic text-black/40">
                  Leave empty to use your connected wallet as owner
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Foil & Wear & NSFW */}
        <div className="p-4 bg-gray-50 rounded-lg border-1 border-black/20">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex justify-between items-center">
              <div>
                <Label className="mb-1 text-black/80">Foil</Label>
                <p className="text-xs italic text-black/40">
                  Add special foil effects to cards
                </p>
              </div>
              <Switch
                checked={formData.enableFoil}
                onCheckedChange={(checked) =>
                  updateField("enableFoil", checked)
                }
              />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <Label className="mb-1 text-black/80">Wear</Label>
                <p className="text-xs italic text-black/40">
                  Add wear and aging effects to cards
                </p>
              </div>
              <Switch
                checked={formData.enableWear}
                onCheckedChange={(checked) =>
                  updateField("enableWear", checked)
                }
              />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <Label className="mb-1 text-black/80">NSFW</Label>
                <p className="text-xs italic text-black/40">
                  Mark collection as Not Safe For Work
                </p>
              </div>
              <Switch
                checked={formData.isNSFW}
                onCheckedChange={(checked) => updateField("isNSFW", checked)}
              />
            </div>
          </div>
        </div>

        {/* Image preview */}
        <div className="grid grid-cols-1 space-y-4">
          {/* Featured Image Selection */}
          <div>
            {/* Collection Items Selection */}
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                {currentFiles.map((fileData, pageIndex) => {
                  const actualIndex = startIndex + pageIndex;
                  return (
                    <div
                      key={actualIndex}
                      onClick={() => {
                        updateField("featuredIndex", actualIndex);
                        setCustomFeaturedFile(null);
                        setFormData((prev) => ({
                          ...prev,
                          customFeaturedImage: undefined,
                        }));
                      }}
                      className={`relative cursor-pointer rounded-lg overflow-hidden border-1 transition-colors ${
                        formData.featuredIndex === actualIndex &&
                        !customFeaturedFile
                          ? "border-black ring-2 ring-black/20"
                          : "border-black/30 hover:border-black/50"
                      }`}
                    >
                      <img
                        src={
                          fileData.uploadedUrl ||
                          URL.createObjectURL(fileData.file)
                        }
                        alt={fileData.file.name}
                        className="object-cover w-full h-24 sm:h-28 md:h-32"
                      />
                      <div className="flex absolute inset-0 justify-center items-center bg-black/40">
                        <div className="text-center text-white">
                          <p className="text-xs font-medium">
                            {fileData.rarity}
                          </p>
                          <p className="text-xs opacity-75">
                            #{actualIndex + 1}
                          </p>
                        </div>
                      </div>
                      {formData.featuredIndex === actualIndex &&
                        !customFeaturedFile && (
                          <div className="flex absolute top-1 right-1 justify-center items-center w-4 h-4 bg-green-500 rounded-full">
                            <span className="text-xs text-white">✓</span>
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <span className="text-xs italic text-black/60">
                    page {currentPage + 1} of {totalPages}
                  </span>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
                    }
                    disabled={currentPage === totalPages - 1}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
            <p className="mt-3 text-xs italic text-black/60">
              {customFeaturedFile
                ? "Using custom featured image"
                : "This will be the main image shown for your collection"}
            </p>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Upload
          </Button>
          <Button type="submit" disabled={!isValid} className="flex-1">
            Ready ?
          </Button>
        </div>
      </form>
    </div>
  );
};
