"use client";

import React from "react";
import { PainterGallery } from "@/components/painter/PainterGallery";
import { PainterContractInfo } from "@/components/painter/PainterContractInfo";
import { PainterBuyButton } from "@/components/painter/PainterBuyButton";

export default function PainterPage() {
  return (
    <div className="w-full bg-orange-50">
      <div className="flex flex-col items-center pt-28">
        <div className="text-9xl font-bold">THE PAINTER</div>
        <div>TOP 30 MOST VALUABLE PAINTING ALL THE TIME</div>
      </div>
      <PainterGallery />
      <section className="py-12 mt-8 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <PainterContractInfo />
            </div>
            <div>
              <PainterBuyButton />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
