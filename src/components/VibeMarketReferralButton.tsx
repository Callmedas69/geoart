"use client";

import { Button } from "@/components/ui/button";

export function VibeMarketReferralButton() {
  const handleDeploy = () => {
    const referralCode =
      process.env.NEXT_PUBLIC_VIBEMARKET_REFERRAL || "C8475MDMBEAM";
    const vibeMarketUrl = `https://vibemarket.com/deploy?ref=${referralCode}`;

    window.open(vibeMarketUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Button
      size="sm"
      onClick={handleDeploy}
      className="text-sm font-medium border-primary/20 hover:border-primary hover:bg-primary/5"
    >
      Deploy Collection
    </Button>
  );
}
