# Components Architecture

## Phase 2 Components ✅ COMPLETED

### Core Layout Components

#### Header.tsx ✅
**Location**: `src/components/Header.tsx`
**Purpose**: Main navigation header
**Features**:
- GEO ART logo (League Spartan font)
- RainbowKit ConnectButton integration
- Fixed header with border-bottom
- Responsive design (max-width container)

```tsx
export function Header() {
  return (
    <header className="w-full bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-2xl font-heading font-semibold">GEO ART</h1>
          <ConnectButton />
        </div>
      </div>
    </header>
  )
}
```

#### Hero.tsx ✅
**Location**: `src/components/Hero.tsx`
**Purpose**: Hero section with GSAP parallax
**Features**:
- Minimal GSAP ScrollTrigger integration
- 3-column NFT preview grid
- Parallax effect on `.hero-image` class
- Responsive design (1 column on mobile, 3 on desktop)
- Clean typography hierarchy

```tsx
// GSAP Implementation (minimal)
gsap.to('.hero-image', {
  y: -50,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero-section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1
  }
})
```

### Action Components

#### ActionButtons.tsx ✅
**Location**: `src/components/ActionButtons.tsx`
**Purpose**: Main action buttons for pack operations
**Features**:
- Dynamic pricing with `useReadContract` hook
- Wallet connection validation
- Three buttons: BUY PACK, SELL, OPEN PACK
- Contract integration with `getMintPrice()` method
- Responsive button layout

```tsx
const { data: mintPrice } = useReadContract({
  address: CONTRACTS.GEO_ART,
  abi: [{ name: 'getMintPrice', type: 'function', ... }],
  functionName: 'getMintPrice',
})
```

### Data Display Components

#### NFTGrid.tsx ✅
**Location**: `src/components/NFTGrid.tsx`
**Purpose**: NFT collection and user inventory display
**Features**:
- Toggle between Collection/Owned views
- VibeMarket API integration
- Rarity-based styling system
- Responsive grid layout (1-4 columns)
- Loading states and error handling
- shadcn/ui Card components

**Rarity System**:
- Common (1): Gray colors
- Rare (2): Blue colors  
- Epic (3): Purple colors
- Legendary (4): Gold colors
- Mythic (5): Red colors

```tsx
// API Integration
const collectionData = await fetchCollectionData(CONTRACTS.GEO_ART)
const userNFTs = await fetchUserNFTs(address, CONTRACTS.GEO_ART)
```

## Utility Modules ✅

### contracts.ts ✅
**Location**: `src/utils/contracts.ts`
**Purpose**: Contract configuration and rarity system
**Features**:
- Environment variable validation
- Rarity level constants and helpers
- Color mapping for rarity display
- Type definitions

### api.ts ✅  
**Location**: `src/utils/api.ts`
**Purpose**: VibeMarket API integration
**Features**:
- Collection data fetching
- User NFT fetching
- NFT metadata retrieval
- Error handling and fallbacks

## Component Hierarchy

```
HomePage (src/app/page.tsx)
├── Header
├── Hero
│   └── GSAP Parallax Container
├── ActionButtons
│   ├── BUY PACK Button
│   ├── SELL Button
│   └── OPEN PACK Button
└── NFTGrid
    ├── View Toggle (Collection/Owned)
    └── NFT Cards Grid
        └── Individual NFT Cards
```

## State Management

### Wagmi Integration
- `useAccount()` - Wallet connection state
- `useReadContract()` - Contract read operations
- No additional state management needed

### React State
- Local state for NFT data loading
- View mode toggle (collection vs owned)
- Loading and error states

## Design System Integration

### Typography Classes
- `font-heading` - League Spartan for headlines/buttons
- `font-body` - Sanchez for body text/descriptions

### Color System
- `bg-white` - Background
- `text-foreground` - Primary text (obsidian)
- `text-muted-foreground` - Secondary text
- Rarity-specific colors via utility functions

### Layout Utilities
- `max-w-7xl mx-auto` - Consistent container width
- Responsive padding: `px-4 sm:px-6 lg:px-8`
- Grid systems: `grid grid-cols-1 md:grid-cols-3`

## Next Steps (Phase 3)

### Pack Opening Modal
- Modal component with GSAP animations
- Card reveal system
- Transaction handling

### Contract Integration
- Write contract operations (mint, sell)
- Transaction feedback
- Error handling

This architecture follows KISS principles with flat component structure, minimal state management, and clear separation of concerns.