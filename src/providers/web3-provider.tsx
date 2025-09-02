"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { config } from "@/lib/wagmi";
import { useState } from "react";
import { obsidianTheme } from "@/components/CustomConnectButton";
import { CustomAvatar } from "@/components/CustomAvatar";
import "@rainbow-me/rainbowkit/styles.css";

// Create QueryClient once to prevent multiple instances
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
    },
  },
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config} reconnectOnMount={false}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={obsidianTheme}
          avatar={CustomAvatar}
          modalSize="compact"
          showRecentTransactions={false}
          coolMode={false}
          appInfo={{
            appName: "GeoArt",
            learnMoreUrl: "https://geoart.gallery",
          }}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
