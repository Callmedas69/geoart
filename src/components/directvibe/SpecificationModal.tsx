"use client";

import { CircleChevronRight } from "lucide-react";
import React from "react";

interface SpecificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SpecificationModal({
  isOpen,
  onClose,
}: SpecificationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 duration-200 bg-black/50 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative mx-2 sm:mx-4 w-full max-w-2xl bg-white border border-black animate-in zoom-in-95 duration-200 max-h-[90vh] sm:max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-black">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-bold">HOW IT WORKS</h2>
            <button
              onClick={onClose}
              className="p-1 sm:p-2 transition-colors hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-2 max-w-none prose prose-sm">
          <ul className="space-y-3 sm:space-y-2">
            <li className="flex flex-col sm:flex-row gap-1 sm:gap-2 items-start sm:items-center">
              <div className="flex gap-2 items-center flex-shrink-0">
                <CircleChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-bold text-sm sm:text-base">No strict size requirements</span>
              </div>
              <span className="text-xs sm:text-sm italic ml-6 sm:ml-0">
                images are auto-optimized by Cloudflare
              </span>
            </li>
            <li className="flex flex-col sm:flex-row gap-1 sm:gap-2 items-start sm:items-center">
              <div className="flex gap-2 items-center flex-shrink-0">
                <CircleChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-bold text-sm sm:text-base">Recommended minimum</span>
              </div>
              <span className="text-xs sm:text-sm italic ml-6 sm:ml-0">
                609 × 864 px (good quality on all devices)
              </span>
            </li>
            <li className="flex flex-col sm:flex-row gap-1 sm:gap-2 items-start sm:items-center">
              <div className="flex gap-2 items-center flex-shrink-0">
                <CircleChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-bold text-sm sm:text-base">Maximum</span>
              </div>
              <span className="text-xs sm:text-sm italic ml-6 sm:ml-0">
                10MB file size / 100 megapixels (up to 10,000 × 10,000 px)
              </span>
            </li>
            <li className="flex flex-col sm:flex-row gap-1 sm:gap-2 items-start sm:items-center">
              <div className="flex gap-2 items-center flex-shrink-0">
                <CircleChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-bold text-sm sm:text-base">Trading card aspect ratio:</span>
              </div>
              <span className="text-xs sm:text-sm italic ml-6 sm:ml-0">
                2.5:3.5 (width:height) works best for pack display
              </span>
            </li>
            <li className="flex flex-col sm:flex-row gap-1 sm:gap-2 items-start sm:items-center">
              <div className="flex gap-2 items-center flex-shrink-0">
                <CircleChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-bold text-sm sm:text-base">Use consistent dimensions</span>
              </div>
              <span className="text-xs sm:text-sm italic ml-6 sm:ml-0">
                across your collection for a clean, cohesive look
              </span>
            </li>
            <li className="flex flex-row gap-2 items-center">
              <CircleChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-bold text-sm sm:text-base">CSV file format:</span>
            </li>
          </ul>

          <div className="ml-2 sm:ml-6 space-y-2 italic text-gray-600">
            <p className="text-sm sm:text-base">
              <strong>Columns :</strong>
            </p>
            <ul className="text-xs sm:text-sm space-y-1">
              <li>
                <code className="text-xs sm:text-sm">filename</code> – exact image file name (including
                extension)
              </li>
              <li>
                <code className="text-xs sm:text-sm">rarity</code> – rarity code:
              </li>
            </ul>

            <div className="ml-4 sm:ml-6">
              <ul className="text-xs sm:text-sm space-y-0.5">
                <li>1 = Common</li>
                <li>2 = Rare</li>
                <li>3 = Epic</li>
                <li>4 = Legendary</li>
                <li>5 = Mythic</li>
              </ul>
            </div>

            <p className="text-sm sm:text-base">
              <strong>Sample CSV :</strong>
            </p>
            <pre className="overflow-x-auto p-2 sm:p-4 text-xs sm:text-sm bg-gray-50 border border-gray-300">
              {`# CSV format for GeoPack Manager
# Column 1: filename – the exact image file name
# Column 2: rarity – rarity code

filename,rarity
pepe_001.png,1   # Common
pepe_002.png,2   # Rare
pepe_003.png,3   # Epic
pepe_004.png,4   # Legendary
pepe_005.png,5   # Mythic`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
