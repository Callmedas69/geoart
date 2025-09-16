# Architecture Documentation

## Frontend Architecture (KISS Principle)

### Component Structure (KISS)
```
src/
├── components/
│   ├── ui/                    // shadcn/ui only
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── scroll-area.tsx
│   ├── Header.tsx             // Logo + Wallet
│   ├── Hero.tsx               // Minimal GSAP parallax showcase
│   ├── ActionButtons.tsx      // Buy/Sell/Open Pack
│   ├── PackOpening.tsx        // Modal + animation
│   └── NFTGrid.tsx            // Collection display
├── hooks/
│   ├── useVibeMarket.ts     // API integration
│   ├── usePackOpening.ts    // Contract interactions
│   └── useNFTCollection.ts  // NFT data management
├── types/
│   ├── vibemarket.ts
│   └── nft.ts
├── abi/
│   └── vibemarket.ts        // All contract ABIs & TypeScript types
├── utils/
│   ├── contracts.ts         // Contract addresses & constants
│   └── api.ts              // VibeMarket API helpers
└── lib/
    └── utils.ts            // shadcn utilities (cn function)
```

### shadcn/ui Integration
- **Button Component**: All action buttons (Buy/Sell/Open Pack)
- **Card Component**: NFT displays and pack reveals  
- **Dialog Component**: Pack opening modal experience
- **GSAP (minimal)**: Basic parallax scroll only, no complex animations
- **Theme**: Flat design - no gradients, shadows, or 3D effects

### Color Theme Configuration
```css
/* globals.css - shadcn theme variables */
:root {
  --background: 0 0% 100%;        /* Pure white */
  --foreground: 224 71% 4%;       /* Obsidian */
  --primary: 224 71% 4%;          /* Obsidian for buttons */
  --primary-foreground: 0 0% 98%; /* Nearly white text on buttons */
  --secondary: 220 14% 96%;       /* Light gray for subtle elements */
  --secondary-foreground: 224 71% 4%; /* Obsidian text on light */
  --muted: 220 14% 96%;
  --muted-foreground: 220 8% 46%;
  --accent: 220 14% 96%;
  --accent-foreground: 224 71% 4%;
  --border: 220 13% 91%;
  --input: 220 13% 91%;
  --ring: 224 71% 4%;
}
```

### Data Flow
1. **Wallet Connection** → RainbowKit → Wagmi
2. **NFT Data** → VibeMarket API → React State
3. **NFT Images** → Metadata URI → IPFS/Arweave → Next.js Image
4. **Buy Packs** → IBoosterDropV2.mint() → Auto pack opening
5. **Sell NFTs** → IBoosterDropV2.sellAndClaimOffer() → Transaction
6. **Collection Display** → API + getTokenRarity() → Grid Component

### Image Handling
- **Static Assets**: `public/assets/` (logo, pack designs, UI elements)
- **NFT Images**: On-chain metadata → IPFS → Cached by Next.js
- **Fallbacks**: Local placeholders for error states
- **Optimization**: Next.js Image component with automatic optimization

### Integration Points
- **VibeMarket API**: `https://build.wield.xyz/vibe/boosterbox`
- **Base Network**: Chain ID 8453
- **Smart Contracts**: VibeMarket protocol contracts
- **Wallet**: RainbowKit + Wagmi v2