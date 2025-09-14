import type { Metadata } from "next";
import { League_Spartan, Sanchez } from "next/font/google";
import { Web3Provider } from "@/providers/web3-provider";
import { Header } from "@/components/Header";
import "./globals.css";

const leagueSpartan = League_Spartan({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const sanchez = Sanchez({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "GEO ART",
  description: "Geometric Art on VibeMarket",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${leagueSpartan.variable} ${sanchez.variable} antialiased`}
      >
        <Web3Provider>
          <Header />
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
