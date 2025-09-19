"use client";

import { CustomConnectButton } from "@/components/CustomConnectButton";
import Link from "next/link";
import MenuBar from "./MenuBar";

export function Header() {
  return (
    <header className="w-full border-b border-border">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-4xl font-bold tracking-tighter font-heading text-foreground">
                GEOART
              </h1>
            </Link>
          </div>

          {/* Navigation - Centered */}
          <div className="flex items-center justify-center flex-1">
            <MenuBar />
          </div>

          {/* Wallet Connect */}
          <div className="flex items-center">
            <CustomConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}
