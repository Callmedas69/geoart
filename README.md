# GeoArt NFT Collection

A professional NFT collection platform built on Base network, enabling users to mint, trade, and manage GeoArt NFTs.

## Features

- **NFT Minting**: Mint GeoArt NFTs directly from the platform
- **Wallet Integration**: Seamless wallet connection via RainbowKit
- **Real-time Data**: Live contract information and recent mint activity
- **User Portfolio**: View and manage your owned NFTs
- **Base Network**: Built on Base for fast, low-cost transactions
- **Responsive Design**: Mobile-first design with professional UI

## Tech Stack

- **Next.js 14** - App Router with TypeScript
- **Wagmi** - Ethereum library for React
- **RainbowKit** - Wallet connection interface
- **Tailwind CSS** - Utility-first styling
- **Viem** - TypeScript interface for Ethereum
- **GSAP** - High-performance animations

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd geoart

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Setup

Create `.env.local` with:

```bash
# Required
NEXT_PUBLIC_VIBEMARKET_REFERRAL=your_referral_code

# Optional
NEXT_PUBLIC_ALCHEMY_ID=your_alchemy_key
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/                 # Next.js App Router
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── test/           # Development/testing components
├── utils/              # Utility functions
├── abi/                # Smart contract ABIs
└── assets/             # Static assets
```

## Key Components

- **Header** - Navigation with wallet connection
- **Hero** - Animated landing section
- **ContractInfo** - Live blockchain data display
- **BuyButton** - NFT minting interface
- **YourNFTs** - User portfolio management
- **RecentMint** - Recent activity feed

## Smart Contracts

Built on Base network with:
- **BoosterDropV2** - Main NFT contract
- **BoosterTokenV2** - Utility token contract

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint check
```

## Deployment

Deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Or any other platform supporting Next.js.

## Contributing

1. Follow KISS principle - keep it simple
2. Maintain TypeScript strict mode
3. Use existing component patterns
4. Test wallet interactions thoroughly

## License

MIT License - see LICENSE file for details.