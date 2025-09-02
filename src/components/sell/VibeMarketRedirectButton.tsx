"use client";

import { Button } from "@/components/ui/button";

interface NFTItem {
  id: string;
  tokenId?: string;
  name: string;
  image: string;
  description?: string;
  rarity?: number;
  status?: string;
}

interface VibeMarketRedirectButtonProps {
  nft: NFTItem;
  disabled?: boolean;
  className?: string;
}

/**
 * Redirect to VibeMarket collection page for selling
 */
export const VibeMarketRedirectButton = ({
  nft,
  disabled,
  className,
}: VibeMarketRedirectButtonProps) => {
  const handleSellOnVibeMarket = () => {
    const baseURL = process.env.NEXT_PUBLIC_VIBEMARKET_INVENTORY_BASE_URL;
    const contractAddress = process.env.NEXT_PUBLIC_GEO_ART_DROP_ADDRESS;

    if (!baseURL || !contractAddress) {
      console.error("VibeMarket URL or contract address not configured");
      return;
    }

    const vibeMarketURL = `${baseURL}=${contractAddress}`;
    window.open(vibeMarketURL, "_blank", "noopener,noreferrer");
  };

  return (
    <Button
      onClick={handleSellOnVibeMarket}
      disabled={disabled || !nft.tokenId}
      variant="outline"
      size="sm"
      className={`text-xs font-semibold border-primary/20 hover:border-primary hover:bg-primary/5 ${className}`}
    >
      SELL
    </Button>
  );
};
