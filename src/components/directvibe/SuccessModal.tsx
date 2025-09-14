"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, ExternalLink, Share, Copy } from "lucide-react";
import { getCollectionBySlug } from "@/services/collections";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectionName: string;
  featuredImageUrl?: string;
  customFeaturedImage?: File;
  slug: string;
  onBuyPacks?: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  collectionName,
  featuredImageUrl,
  customFeaturedImage,
  slug,
  onBuyPacks,
}) => {
  console.log("🎉 SuccessModal props:", {
    collectionName,
    featuredImageUrl,
    customFeaturedImage: customFeaturedImage?.name,
    slug,
  });

  // State for pack image from API
  const [packImage, setPackImage] = useState<string>("");

  // Fetch pack image when modal opens
  useEffect(() => {
    if (isOpen && slug) {
      getCollectionBySlug(slug).then((collection) => {
        if (collection?.packImage) {
          setPackImage(collection.packImage);
        }
      });
    }
  }, [isOpen, slug]);

  // Determine which image to use (packImage > custom > featured)
  const displayImageUrl =
    packImage ||
    (customFeaturedImage
      ? URL.createObjectURL(customFeaturedImage)
      : featuredImageUrl);

  const referralCode =
    process.env.NEXT_PUBLIC_VIBEMARKET_REFERRAL || "C8475MDMBEAM";
  const vibeMarketUrl = `https://vibechain.com/market/${slug}?ref=${referralCode}`;

  console.log("🔗 Generated Vibe Market URL:", vibeMarketUrl);

  // Share URLs for branded sharing
  const shareUrl = `${window.location.origin}/share/${slug}`;

  const handleDirectView = () => {
    console.log("📤 Opening Vibe Market URL:", vibeMarketUrl);
    window.open(vibeMarketUrl, "_blank", "noopener,noreferrer");
  };

  const handleShare = (platform: "twitter" | "farcaster" | "copy") => {
    const shareText = `"${collectionName}" pack is ready to open on @vibedotmarket !\n\nPacked with GeoPack Manager!\n\n${vibeMarketUrl}\n\n`;

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(shareUrl)}`,
      farcaster: `https://warpcast.com/~/compose?text=${encodeURIComponent(
        shareText
      )}&embeds[]=${encodeURIComponent(shareUrl)}`,
      copy: vibeMarketUrl,
    };

    if (platform === "copy") {
      navigator.clipboard.writeText(urls.copy);
      // Simple feedback without external dependencies
      const button = document.activeElement as HTMLButtonElement;
      const originalText = button.textContent;
      button.textContent = "Copied!";
      setTimeout(() => {
        button.textContent = originalText;
      }, 2000);
    } else {
      window.open(urls[platform], "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader className="sr-only">
          <DialogTitle>Collection Successfully Deployed</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-6">
          {/* Pack Image - Matching OG Route Style */}
          <div className="flex justify-center">
            {displayImageUrl ? (
              <div
                className="w-48 h-full"
                style={{ transform: "rotate(-7deg)" }}
              >
                <img
                  src={displayImageUrl}
                  alt={collectionName}
                  className="object-cover w-full h-full"
                  style={{
                    boxShadow: "8px 8px 16px rgba(0, 0, 0, 0.3)",
                  }}
                  onError={(e) => {
                    console.error(
                      "❌ Failed to load featured image:",
                      displayImageUrl
                    );
                    e.currentTarget.style.display = "none";
                  }}
                  onLoad={() =>
                    console.log("✅ Featured image loaded:", displayImageUrl)
                  }
                />
              </div>
            ) : (
              <div
                className="flex justify-center items-center w-48 h-64 text-4xl font-bold text-gray-700 bg-gray-50 rounded-lg border border-gray-200"
                style={{
                  transform: "rotate(-7deg)",
                  boxShadow: "8px 8px 16px rgba(0, 0, 0, 0.3)",
                  fontFamily: "system-ui",
                }}
              >
                {collectionName.slice(0, 2).toUpperCase()}{" "}
              </div>
            )}
          </div>

          {/* Collection Name - Matching OG Route Style */}
          <div className="flex gap-2 justify-center items-center text-center">
            <h3
              className="my-3 text-4xl font-bold text-gray-900 uppercase"
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                lineHeight: 1.1,
              }}
            >
              {collectionName}
            </h3>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Primary Action - Direct View */}
            <Button
              onClick={handleDirectView}
              className="flex gap-2 justify-center items-center w-full"
            >
              View on Vibe.Market
              <ExternalLink className="w-4 h-4" />
            </Button>

            {/* Optional Buy Packs Action */}
            {onBuyPacks && (
              <Button
                variant="outline"
                onClick={onBuyPacks}
                className="flex gap-2 justify-center items-center w-full bg-green-300"
              >
                Buy First Packs
              </Button>
            )}

            {/* Sharing Options */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("twitter")}
                className="flex flex-col gap-1 h-16"
              >
                <span className="text-lg">Twitter</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("farcaster")}
                className="flex flex-col gap-1 h-16"
              >
                <span className="text-lg">Farcaster</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("copy")}
                className="flex flex-col gap-1 h-16"
              >
                <span className="text-lg">Copy Link</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
