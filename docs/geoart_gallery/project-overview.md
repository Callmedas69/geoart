# GEO ART - NFT Pack Opening Interface

## Project Overview
Simple frontend interface for GEO ART collection deployed on VibeMarket/Base network. Focus: Buy, Sell, and Open Pack functionality with modern minimalist design.

## Requirements
- **Collection**: GEO ART (single collection only)
- **Blockchain**: Base network
- **Smart Contracts**: Use existing VibeMarket protocols (no custom contract development)
- **Design**: Flat modern minimalist (white bg, obsidian text, no gradients/shadows)
- **Core Features**:
  - Pack opening mechanics with animations
  - Buy packs functionality
  - Sell NFTs functionality
  - Clean, simple UI

## Layout Structure ✅ IMPLEMENTED
```
Header ✅
├── Logo (top left) - GEO ART branding
└── Wallet Connect (top right) - RainbowKit integration

Hero Section ✅
└── GSAP scroll parallax image showcase (3 NFT previews)

Action Buttons ✅
├── BUY PACK - with dynamic pricing from contract
├── SELL - wallet connection required
└── OPEN PACK - wallet connection required

NFT Collection Grid ✅
├── Collection view - all NFTs in collection
├── Owned view - user's NFTs only
└── Rarity-based styling (Common/Rare/Epic/Legendary/Mythic)
```

## Key Decisions
1. **No custom smart contracts** - Use VibeMarket existing protocols
2. **Single page application** - Keep it simple
3. **Pack opening required** - Core functionality with animations
4. **Base network only** - No multi-chain support needed
5. **Wagmi over ethers.js** - Simpler, more integrated approach