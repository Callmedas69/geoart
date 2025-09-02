"use client";

import { useState, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fetchRecentEpicPulls } from "@/utils/api";
import { CONTRACTS, RARITY_LEVELS } from "@/utils/contracts";
import { NFTCard } from "@/components/NFTCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface NFTItem {
  id: string;
  name: string;
  image: string;
  description?: string;
  rarity?: number;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  metadata?: {
    foil?: string;
    [key: string]: any;
  };
}

export function RecentMint() {
  const [recentPulls, setRecentPulls] = useState<NFTItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch recent EPIC+ pulls
  useEffect(() => {
    const loadRecentPulls = async () => {
      if (!CONTRACTS.GEO_ART) return;

      setIsLoading(true);

      try {
        // Contract-driven parameters - no hardcoded values
        const limit = parseInt(
          process.env.NEXT_PUBLIC_RECENT_PULLS_LIMIT || "12"
        );

        const pulls = await fetchRecentEpicPulls(CONTRACTS.GEO_ART, {
          rarityGreaterThan: RARITY_LEVELS.RARE, // EPIC+ only (rarity >= 3)
          limit,
        });

        setRecentPulls(pulls);
      } catch (error) {
        console.error("Failed to load recent pulls:", error);
        // Keep empty array - component handles empty state
        setRecentPulls([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecentPulls();
  }, []);

  // GSAP scroll-driven infinite horizontal animation for desktop
  useGSAP(
    () => {
      if (isMobile || !scrollContainerRef.current || recentPulls.length === 0)
        return;

      gsap.registerPlugin(ScrollTrigger);

      const container = scrollContainerRef.current;
      
      let xPercent = 0;
      let direction = -1;

      const animate = () => {
        // Reset position for seamless infinite loop
        if (xPercent < -100) {
          xPercent = 0;
        } else if (xPercent > 0) {
          xPercent = -100;
        }

        // Apply transform to both sets of duplicated items
        gsap.set(container, { xPercent: xPercent });
        
        // Move based on direction
        xPercent += 0.1 * direction;
        
        requestAnimationFrame(animate);
      };

      // ScrollTrigger to change direction
      ScrollTrigger.create({
        trigger: scrollContainerRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          direction = self.direction * -1;
        }
      });

      animate();

      return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    },
    { dependencies: [isMobile, recentPulls], scope: scrollContainerRef }
  );

  if (isLoading) {
    return (
      <section className="py-8 bg-slate-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-6 text-center">
            <h3 className="text-2xl font-semibold font-heading text-slate-900">
              Recent Pulls
            </h3>
            <p className="mt-2 text-sm font-body text-slate-600">
              Loading recent high-value pulls...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (recentPulls.length === 0) {
    // Simple fallback when no data
    return (
      <section className="py-8 bg-slate-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-6 text-center">
            <h3 className="text-2xl font-semibold font-heading text-slate-900">
              Recent Pulls
            </h3>
            <p className="mt-2 text-sm font-body text-slate-600">
              No recent pulls available
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-slate-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-semibold font-heading text-slate-900">
            Recent Pulls
          </h3>
          <p className="mt-2 text-sm font-body text-slate-600">
            See what others have pulled recently
          </p>
        </div>
      </div>

      {/* Desktop: GSAP infinite scroll - Full width */}
      {!isMobile ? (
        <div className="relative overflow-hidden whitespace-nowrap">
          <div
            ref={scrollContainerRef}
            className="relative flex gap-6"
          >
            {/* First set of items */}
            <div className="flex gap-6 flex-shrink-0">
              {recentPulls.map((nft, index) => (
                <div
                  key={`first-${nft.id}-${index}`}
                  className="flex-shrink-0 w-72 recent-mint-item"
                >
                  <NFTCard nft={nft} showActions={false} />
                </div>
              ))}
            </div>
            {/* Second set positioned at left: 100% */}
            <div className="flex gap-6 flex-shrink-0">
              {recentPulls.map((nft, index) => (
                <div
                  key={`second-${nft.id}-${index}`}
                  className="flex-shrink-0 w-72 recent-mint-item"
                >
                  <NFTCard nft={nft} showActions={false} />
                </div>
              ))}
            </div>
            </div>
          </div>
        ) : (
          /* Mobile: shadcn Carousel */
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <Carousel className="mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md">
              <CarouselContent>
                {recentPulls.map((nft) => (
                  <CarouselItem key={nft.id}>
                    <div className="p-1">
                      <NFTCard nft={nft} showActions={false} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        )}
    </section>
  );
}
