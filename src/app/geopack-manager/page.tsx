"use client";

import React from "react";
import { DirectVibeUploader } from "@/components/directvibe/DirectVibeUploader";

export default function DirectVibePage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container px-4 py-12 mx-auto sm:px-6 lg:px-8">
        <section className="mb-8 text-center lg:mb-12">
          <p className="mx-auto max-w-2xl text-sm font-medium text-black md:text-xl sm:text-base">
            GeoPack Manager is a simple uploader tool on VibeMarket that lets
            you easily pack your Pack
          </p>
        </section>
        <section className="mx-auto max-w-2xl">
          <DirectVibeUploader />
        </section>
      </main>
    </div>
  );
}
