import React from "react";
import { cn } from "@/lib/utils";

interface GeoLoadingProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const GeoLoading: React.FC<GeoLoadingProps> = ({ 
  text = "Loading...", 
  size = "md",
  className 
}) => {
  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div className="text-center">
        {/* Geometric Loading Spinner - Sharp, flat design */}
        <div className={cn(
          "border-2 border-black border-t-transparent animate-spin mx-auto mb-4",
          size === "sm" && "w-6 h-6",
          size === "md" && "w-8 h-8", 
          size === "lg" && "w-12 h-12"
        )} />
        <p className={cn(
          "text-black font-bold uppercase tracking-wide",
          size === "sm" && "text-sm",
          size === "md" && "text-base",
          size === "lg" && "text-lg"
        )}>
          {text.toUpperCase()}
        </p>
      </div>
    </div>
  );
};