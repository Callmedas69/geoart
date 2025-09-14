import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ContractInfo } from "@/components/ContractInfo";
import { RecentMint } from "@/components/RecentMint";
import { BuyButton } from "@/components/BuyButton";
import { YourNFTs } from "@/components/YourNFTs";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata = {
  title: "GeoArt",
  description:
    "GeoArt is a collection of digital geometric art launched on VibeMarket, combining abstract shapes, patterns, and symmetry to create visually striking on-chain artworks for collectors and creators",
  openGraph: {
    title: "GeoArt",
    description:
      "GeoArt is a collection of digital geometric art launched on VibeMarket, combining abstract shapes, patterns, and symmetry to create visually striking on-chain artworks for collectors and creators",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <ErrorBoundary
        fallback={
          <div className="p-4 text-center">
            Unable to load contract information
          </div>
        }
      >
        <ContractInfo />
      </ErrorBoundary>
      <ErrorBoundary
        fallback={
          <div className="p-4 text-center">Unable to load recent activity</div>
        }
      >
        <RecentMint />
      </ErrorBoundary>
      <ErrorBoundary
        fallback={
          <div className="p-4 text-center">Unable to load purchase options</div>
        }
      >
        <BuyButton />
      </ErrorBoundary>
      <ErrorBoundary
        fallback={
          <div className="p-4 text-center">Unable to load your NFTs</div>
        }
      >
        <YourNFTs />
      </ErrorBoundary>
    </main>
  );
}
