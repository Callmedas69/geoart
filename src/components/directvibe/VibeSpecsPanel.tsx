"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Image } from "lucide-react";

interface ValidationStatus {
  count: boolean;
  dimensions: boolean;
  size: boolean;
  format: boolean;
  csvMatch: boolean;
  rarityComplete: boolean;
}

interface VibeSpecsPanelProps {
  imageCount: number;
  validationStatus: ValidationStatus;
  rarityDistribution: Record<string, number>;
  errors: string[];
  images: File[];
}

const IMAGE_SPECS = {
  count: "5 – 1000 images",
  minDimensions: "609 x 864 px minimum",
  maxSize: "10MB or 100 megapixels max",
  formats: "PNG, JPG/JPEG, non-animated WebP",
  rarities: ["common", "rare", "epic", "legendary", "mythic"],
};

export const VibeSpecsPanel: React.FC<VibeSpecsPanelProps> = ({
  imageCount,
  validationStatus,
  rarityDistribution,
  errors,
  images,
}) => {
  return (
    <div className="space-y-4">
      {/* Image Preview Section */}
      {images.length > 0 && (
        <Card className="bg-white border-1 border-black/20">
          <CardHeader>
            <CardTitle className="flex gap-2 items-center text-black">
              <Image className="w-5 h-5" />
              Image Preview ({imageCount} images)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
              {images.slice(0, 20).map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={image.name}
                    className="object-cover w-full h-full rounded border-1 border-black/20"
                    onLoad={(e) => {
                      // Clean up the object URL to prevent memory leaks
                      setTimeout(() => {
                        if (e.currentTarget && e.currentTarget.src) {
                          URL.revokeObjectURL(e.currentTarget.src);
                        }
                      }, 1000);
                    }}
                  />
                  <div className="absolute inset-0 rounded transition-colors bg-black/0 hover:bg-black/10" />
                </div>
              ))}
              {images.length > 20 && (
                <div className="flex justify-center items-center bg-gray-100 rounded border-1 aspect-square border-black/20">
                  <span className="text-xs text-gray-600">
                    +{images.length - 20}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
