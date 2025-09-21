"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Image from "next/image";
import { PAINTINGS } from "@/data/painter/paintings";
import type { PainterGalleryProps } from "@/types/painter";

const AUTO_SCROLL_SPEED = 120;
const INTERACTION_DELAY = 3000;
const SCROLL_SENSITIVITY = 0.5;
const TOUCH_SENSITIVITY = 0.5;

import salvatorMundo from "@/assets/thepainter/1. Salvator Mundo.webp";
import interchange from "@/assets/thepainter/2. Interchange by Willem de Kooning.webp";
import cardPlayers from "@/assets/thepainter/3. The Card Players by Paul Cézanne.webp";
import nafeaFaa from "@/assets/thepainter/4. Nafea Faa Ipoipo (When Will You Marry) by Paul Gauguin.webp";
import number17a from "@/assets/thepainter/5. Number 17A by Jackson Pollock.webp";
import standardBearer from "@/assets/thepainter/6. The Standard Bearer by Rembrandt.webp";
import shotSage from "@/assets/thepainter/7. Shot Sage Blue Marilyn by Andy Warhol.webp";
import no6Violet from "@/assets/thepainter/8. No. 6 (Violet, Green and Red) by Mark Rothko.webp";
import wasserschlangen from "@/assets/thepainter/9. Wasserschlangen II (Water Serpents II) by Gustav Klimt.webp";
import pendantPortraits from "@/assets/thepainter/10. Pendant portraits of Maerten Soolmans and Oopjen Coppit by Rembrandt.webp";
import lesFemmes from "@/assets/thepainter/11. Les Femmes d'Alger (Version O) by Pablo Picasso.webp";
import nuCouche from "@/assets/thepainter/12. Nu couchÃ© by Amedeo Modigliani.webp";
import otahi from "@/assets/thepainter/13. Otahi by Paul Gauguin.webp";
import leReve from "@/assets/thepainter/14. Le RÃªve by Pablo Picasso.webp";
import adeleII from "@/assets/thepainter/15. Portrait of Adele Bloch-Bauer II by Gustav Klimt.webp";
import lesPoseuses from "@/assets/thepainter/16. Les Poseuses, Ensemble (Petite version) by Georges Seurat.webp";
import threeStudies from "@/assets/thepainter/17. Three Studies of Lucian Freud by Francis Bacon.webp";
import twelveLandscape from "@/assets/thepainter/18. Twelve Landscape Screens by Qi Baishi.webp";
import no5Jackson from "@/assets/thepainter/19. No. 5, 1948 by Jackson Pollock.webp";
import femmeMontre from "@/assets/thepainter/20. Femme Ã  la montre by Pablo Picasso.webp";
import montagneSainte from "@/assets/thepainter/21. La Montagne Sainte-Victoire by Paul CÃ©zanne.webp";
import adeleBauer from "@/assets/thepainter/23. Portrait of Adele Bloch by Bauer I.webp";
import theScream from "@/assets/thepainter/24. The Scream by Edvard Munch.webp";
import flag from "@/assets/thepainter/25. Flag by Jaspepe Johns.webp";

const IMAGE_MAP = {
  "1. Salvator Mundo.webp": salvatorMundo,
  "2. Interchange by Willem de Kooning.webp": interchange,
  "3. The Card Players by Paul Cézanne.webp": cardPlayers,
  "4. Nafea Faa Ipoipo (When Will You Marry) by Paul Gauguin.webp": nafeaFaa,
  "5. Number 17A by Jackson Pollock.webp": number17a,
  "6. The Standard Bearer by Rembrandt.webp": standardBearer,
  "7. Shot Sage Blue Marilyn by Andy Warhol.webp": shotSage,
  "8. No. 6 (Violet, Green and Red) by Mark Rothko.webp": no6Violet,
  "9. Wasserschlangen II (Water Serpents II) by Gustav Klimt.webp":
    wasserschlangen,
  "10. Pendant portraits of Maerten Soolmans and Oopjen Coppit by Rembrandt.webp":
    pendantPortraits,
  "11. Les Femmes d'Alger (Version O) by Pablo Picasso.webp": lesFemmes,
  "12. Nu couchÃ© by Amedeo Modigliani.webp": nuCouche,
  "13. Otahi by Paul Gauguin.webp": otahi,
  "14. Le RÃªve by Pablo Picasso.webp": leReve,
  "15. Portrait of Adele Bloch-Bauer II by Gustav Klimt.webp": adeleII,
  "16. Les Poseuses, Ensemble (Petite version) by Georges Seurat.webp":
    lesPoseuses,
  "17. Three Studies of Lucian Freud by Francis Bacon.webp": threeStudies,
  "18. Twelve Landscape Screens by Qi Baishi.webp": twelveLandscape,
  "19. No. 5, 1948 by Jackson Pollock.webp": no5Jackson,
  "20. Femme Ã  la montre by Pablo Picasso.webp": femmeMontre,
  "21. La Montagne Sainte-Victoire by Paul CÃ©zanne.webp": montagneSainte,
  "23. Portrait of Adele Bloch by Bauer I.webp": adeleBauer,
  "24. The Scream by Edvard Munch.webp": theScream,
  "25. Flag by Jaspepe Johns.webp": flag,
};

export function PainterGallery({ className = "" }: PainterGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Create 2 sets for seamless infinite scroll
  const duplicatedPaintings = [...PAINTINGS, ...PAINTINGS];

  useGSAP(
    () => {
      const container = containerRef.current;
      const scrollContainer = scrollContainerRef.current;

      if (!container || !scrollContainer) return;

      // KISS: Simple scroll with basic reset
      let currentPosition = 0;
      let startX = 0;
      let isDragging = false;
      let autoScrollTween: gsap.core.Tween | null = null;
      let scrollDirection = -1; // -1 = right to left, 1 = left to right
      let delayedCallTimer: gsap.core.Tween | null = null;

      const singleSetWidth = scrollContainer.scrollWidth / 2;

      const updatePosition = (newPosition: number) => {
        // Seamless loop without jumps
        while (newPosition <= -singleSetWidth) {
          newPosition += singleSetWidth;
        }
        while (newPosition > 0) {
          newPosition -= singleSetWidth;
        }
        currentPosition = newPosition;
        gsap.to(scrollContainer, {
          x: currentPosition,
          duration: 0.1,
          ease: "power2.out",
        });
      };

      const startAutoScroll = () => {
        if (autoScrollTween) autoScrollTween.kill();
        const targetPosition = scrollDirection === -1 ? -singleSetWidth : 0;
        const startPosition = scrollDirection === -1 ? currentPosition : currentPosition;
        const distance = Math.abs(targetPosition - startPosition);
        const duration = (distance / singleSetWidth) * AUTO_SCROLL_SPEED;

        autoScrollTween = gsap.to(scrollContainer, {
          x: targetPosition,
          duration,
          ease: "none",
          onComplete: () => {
            if (scrollDirection === -1) {
              currentPosition = 0;
              gsap.set(scrollContainer, { x: 0 });
            } else {
              currentPosition = -singleSetWidth;
              gsap.set(scrollContainer, { x: -singleSetWidth });
            }
            startAutoScroll();
          },
        });
      };

      const stopAutoScroll = () => {
        if (autoScrollTween) {
          autoScrollTween.kill();
          autoScrollTween = null;
        }
      };

      // Start auto-scroll on load
      startAutoScroll();

      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        stopAutoScroll();
        if (Math.abs(e.deltaY) > 0) {
          scrollDirection = e.deltaY > 0 ? -1 : 1;
        }
        updatePosition(currentPosition - e.deltaY * SCROLL_SENSITIVITY);
        if (delayedCallTimer) delayedCallTimer.kill();
        delayedCallTimer = gsap.delayedCall(INTERACTION_DELAY / 1000, () => {
          if (!isDragging) startAutoScroll();
        });
      };

      const handleTouchStart = (e: TouchEvent) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        stopAutoScroll();
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const deltaX = e.touches[0].clientX - startX;
        if (Math.abs(deltaX) > 0) {
          scrollDirection = deltaX > 0 ? 1 : -1;
        }
        updatePosition(currentPosition + deltaX * TOUCH_SENSITIVITY);
        startX = e.touches[0].clientX;
      };

      const handleTouchEnd = () => {
        isDragging = false;
        if (delayedCallTimer) delayedCallTimer.kill();
        delayedCallTimer = gsap.delayedCall(INTERACTION_DELAY / 1000, () => {
          if (!isDragging) startAutoScroll();
        });
      };

      container.addEventListener("wheel", handleWheel, { passive: false });
      container.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      container.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      container.addEventListener("touchend", handleTouchEnd, { passive: true });

      return () => {
        container.removeEventListener("wheel", handleWheel);
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
        container.removeEventListener("touchend", handleTouchEnd);
        if (autoScrollTween) autoScrollTween.kill();
        if (delayedCallTimer) delayedCallTimer.kill();
      };
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden mt-28 w-full ${className}`}
    >
      <div ref={scrollContainerRef} className="flex items-center h-full">
        {duplicatedPaintings.map((painting, index) => (
          <div
            key={`${painting.id}-${Math.floor(index / PAINTINGS.length)}`}
            className="flex-shrink-0 mx-1.5 w-48 sm:w-64 md:w-80 lg:w-96 xl:w-[500px] 2xl:w-[600px] flex flex-col"
          >
            <div className="relative flex-shrink-0 h-80 sm:h-96 md:h-[400px] lg:h-[450px] xl:h-[500px] 2xl:h-[600px]">
              <Image
                src={IMAGE_MAP[painting.filename as keyof typeof IMAGE_MAP]}
                alt={painting.title}
                fill
                className="object-contain"
                draggable={false}
                priority={index < 3}
              />
            </div>
            <div className="mt-2 text-center">
              <h3 className="text-sm font-medium sm:text-base md:text-lg lg:text-xl xl:text-xl 2xl:text-2xl">
                {painting.title}
              </h3>
              {painting.artist && (
                <p className="mt-1 text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg 2xl:text-xl">
                  {painting.artist}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
