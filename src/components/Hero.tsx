"use client";

import React, { useRef } from "react";
import frameLeft from "@/assets/frameHero/frameLeft.png";
import frameMid from "@/assets/frameHero/frameMid.png";
import frameRight from "@/assets/frameHero/frameRight.png";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLDivElement[]>([]);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      // Set default shadow position
      framesRef.current.forEach((frame) => {
        if (!frame) return;
        gsap.set(frame, {
          filter: "drop-shadow(0px 6px 4px rgba(0, 0, 0, 0.2))",
        });
      });

      const handleMouseMove = (e: MouseEvent) => {
        framesRef.current.forEach((frame) => {
          if (!frame) return;

          const rect = frame.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const deltaX = (e.clientX - centerX) * 0.015;
          const deltaY = Math.max(2, (e.clientY - centerY) * 0.015 + 6);

          gsap.to(frame, {
            filter: `drop-shadow(${deltaX}px ${deltaY}px 4px rgba(0, 0, 0, 0.3))`,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      };

      container.addEventListener("mousemove", handleMouseMove);

      return () => {
        container.removeEventListener("mousemove", handleMouseMove);
      };
    },
    { scope: containerRef }
  );

  return (
    <section className="relative">
      <div
        ref={containerRef}
        className="w-full h-screen p-0 m-0 flex justify-center items-center"
      >
        <div className="flex gap-4 md:gap-8">
          <div
            ref={(el) => {
              if (el) framesRef.current[0] = el;
            }}
            className="isolate relative"
          >
            <Image 
              src={frameLeft} 
              alt="frame-left" 
              width={250} 
              height={250} 
              className="w-32 h-32 sm:w-48 sm:h-48 md:w-60 md:h-60 lg:w-[250px] lg:h-[250px]"
            />
            <h1 className="flex absolute inset-0 justify-center items-center p-0 m-0 text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-extrabold leading-none translate-y-3 tracking-wider">
              G
            </h1>
          </div>
          <div
            ref={(el) => {
              if (el) framesRef.current[1] = el;
            }}
            className="isolate relative"
          >
            <Image 
              src={frameMid} 
              alt="frame-mid" 
              width={250} 
              height={250} 
              className="w-32 h-32 sm:w-48 sm:h-48 md:w-60 md:h-60 lg:w-[250px] lg:h-[250px]"
            />
            <h1 className="flex absolute inset-0 justify-center items-center p-0 m-0 text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-extrabold leading-none translate-y-3 tracking-wider">
              E
            </h1>
          </div>
          <div
            ref={(el) => {
              if (el) framesRef.current[2] = el;
            }}
            className="isolate relative"
          >
            <Image
              src={frameRight}
              alt="frame-right"
              width={250}
              height={250}
              className="w-32 h-32 sm:w-48 sm:h-48 md:w-60 md:h-60 lg:w-[250px] lg:h-[250px]"
            />
            <h1 className="flex absolute inset-0 justify-center items-center p-0 m-0 text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-extrabold leading-none translate-y-3 tracking-wider">
              O
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
