"use client";

import React from "react";
import { DirectVibeUploader } from "@/components/directvibe/DirectVibeUploader";

export default function DirectVibePage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="text-center mb-8 lg:mb-12">
          <p className="mx-auto max-w-2xl text-sm sm:text-base font-medium text-black">
            Upload your NFT collection directly to Vibe.Market platform using
            their native upload system. Simple, fast, and guaranteed
            compatibility.
          </p>
        </section>
        <section className="max-w-2xl mx-auto">
          <DirectVibeUploader />
        </section>
      </main>
    </div>
  );
}
