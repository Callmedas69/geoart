# NFTGrid Refactoring & RecentPulls Strategy

## Current State Analysis

### Issues Identified
1. **Single Responsibility Violation**: NFTGrid.tsx contains 290 lines handling multiple concerns
2. **Suboptimal Data Strategy**: Fetching entire collection instead of recent activity
3. **Missing FOMO Element**: No showcase of recent high-value pulls

### Performance & UX Impact
- Slow queries when fetching entire collection
- Poor scalability as collection grows
- No social proof or excitement generation

## Refactoring Strategy (KISS Principle - Simplified)

### 1. Component Architecture Update

#### New Page Structure
```
HomePage
├── Header
├── Hero (GSAP Parallax)
├── ContractInfo
├── RecentMint (EPIC+ pulls - FOMO marketing)
├── ActionButtons  
└── Your NFTs (wallet-connected section)
```

#### Component Responsibilities

**RecentMint.tsx** (NEW Component)
- Desktop: GSAP infinite horizontal scroll animation
- Mobile: shadcn Carousel component (infinite)
- EPIC+ recent pulls showcase (rarity >= 3)
- Positioned under ContractInfo
- **Size**: ~80 lines

**NFTCard.tsx** (Extract Card Only)
- Individual NFT presentation for grid view
- Rarity styling system integration
- Foil badge display (no filtering)
- **Size**: ~60 lines

**YourNFTs.tsx** (Refactored from NFTGrid)
- Extracted "Your NFTs" functionality from current NFTGrid
- Positioned under ActionButtons (wallet-connected section)
- Uses existing fetchUserNFTs API
- **Size**: ~120 lines

### 2. RecentMint Component Strategy

#### VibeMarket API Integration
```bash
# Example API call structure (all values from contract/environment)
curl --request GET \
  --url 'https://build.wield.xyz/vibe/boosterbox/recent?limit=${LIMIT}&contractAddress=${CONTRACT_ADDRESS}&rarityGreaterThan=${RARITY_FILTER}' \
  --header 'API-KEY: ${API_KEY}'
```

#### Data Filtering (EPIC+ Only)
```typescript
import { CONTRACTS, RARITY_LEVELS } from '@/utils/contracts'

// IMPORTANT: All data extracted from contract - NO HARDCODED VALUES
const recentPulls = await fetchRecentEpicPulls(CONTRACTS.GEO_ART, {
  rarityGreaterThan: RARITY_LEVELS.RARE, // Filter for EPIC+ (rarity >= 3)
  limit: parseInt(process.env.NEXT_PUBLIC_RECENT_PULLS_LIMIT || '20'), // From environment
});

// Fallback data if API fails
const fallbackData = [
  { id: 'loading-1', name: 'Loading...', rarity: RARITY_LEVELS.EPIC },
  { id: 'loading-2', name: 'Loading...', rarity: RARITY_LEVELS.LEGENDARY }
];
```

#### Display Strategy (Ultra Clean)
**Show Only:**
- NFT Image
- Rarity Badge (EPIC/LEGENDARY/MYTHIC)
- Foil Badge (when metadata.foil !== "Normal")

**No Display:**
- Token ID
- Timestamp  
- Owner address
- Status

**Badge Display Examples:**
- `[EPIC] [FOIL]` - Both badges when foil variant
- `[LEGENDARY]` - Single rarity badge when normal

#### Benefits of RecentMint Component Approach
1. **FOMO Marketing**: Users see recent high-value pulls before buying
2. **Social Proof**: Real recent activity validates contract
3. **Performance**: Pre-filtered server-side (EPIC+ only)
4. **Visual Impact**: Responsive animations (GSAP desktop, carousel mobile)
5. **Conversion Optimization**: Perfect positioning before action buttons
6. **Contract-Driven**: All data extracted from contract, simple fallbacks on failure

### 3. Implementation Status

#### ✅ COMPLETED: Component Extraction & Creation
- ✅ **NFTCard.tsx**: Extracted reusable card component (~80 lines)
  - Fixed image height to 192px (h-48) for consistent display
  - Implemented proper foil display with fallback dash ("-")
  - Updated layout with `justify-between` for balanced spacing
  - Shows "GEO ART #${nft.id}" with fallback
- ✅ **RecentMint.tsx**: Created new component (~193 lines)
  - ✅ **useGSAP Integration**: Replaced useEffect with @gsap/react useGSAP hook
  - ✅ **VibeMarket API**: Integrated `/api/recent-pulls` endpoint
  - ✅ **Data Processing**: Fixed API response mapping to extract actual foil values
  - ✅ **Contract-driven data**: Uses CONTRACTS.GEO_ART and RARITY_LEVELS.RARE
  - ✅ **Desktop**: GSAP infinite horizontal scroll animation with proper scope
  - ✅ **Mobile**: shadcn Carousel component for touch interaction
  - ✅ **Fallbacks**: Simple dash ("-") fallbacks, no random calculations

#### ✅ COMPLETED: API Integration & Data Flow
- ✅ **API Route**: Created `/api/recent-pulls/route.ts` endpoint
- ✅ **Data Mapping**: Fixed `fetchRecentEpicPulls()` to process real API data
- ✅ **Metadata Extraction**: Properly maps `box.metadata.foil` from API response
- ✅ **Fallback Strategy**: Uses "-" for missing data instead of random generation
- ✅ **TypeScript Fixes**: Added proper rarity checks to prevent undefined errors

#### ✅ COMPLETED: YourNFTs Component & Performance Optimization
- ✅ **YourNFTs.tsx**: Complete component implementation (~264 lines)
  - ✅ **Wallet Integration**: useAccount hook with proper connection states
  - ✅ **API Integration**: fetchUserNFTs with contract-driven configuration
  - ✅ **Performance Fixes**: Removed timeout debouncing, added cancellation flags
  - ✅ **Error Handling**: Preserves existing data on network errors
  - ✅ **State Management**: Race condition prevention with cleanup
  - ✅ **Responsive Layout**: 1-4 column grid with proper pagination
  - ✅ **Loading States**: Professional loading and empty state UX
  - ✅ **KISS Principle**: Simplified pagination (single page display)

#### ✅ ALL COMPONENTS COMPLETED
- 🎉 **Component Architecture**: All planned components are now implemented

### 4. Updated File Structure

```
src/components/
├── RecentMint.tsx               # ✅ COMPLETED - EPIC+ pulls with useGSAP animations
├── NFTCard.tsx                  # ✅ COMPLETED - Reusable card with fixed height & foil display
├── YourNFTs.tsx                 # ✅ COMPLETED - Performance-optimized user NFTs component
├── ui/                          # shadcn/ui components (existing + Carousel)
└── ...

src/app/api/
├── recent-pulls/                # ✅ COMPLETED - New API endpoint
│   └── route.ts                 # Maps VibeMarket /recent endpoint
├── collection-data/             # Existing
└── contract-info/               # Existing

src/utils/
├── api.ts                       # ✅ UPDATED - Fixed fetchRecentEpicPulls() data mapping
└── ...
```

### 5. Expected Results

#### Performance Improvements
- **Component Separation**: NFTGrid (290 lines) → RecentMint (193) + YourNFTs (264) + NFTCard (80)
- **Page Loading**: Faster with targeted EPIC+ API calls
- **User Engagement**: FOMO-driven conversion optimization
- **Memory Optimization**: Removed timeout accumulation, added proper cleanup
- **Race Condition Prevention**: Request cancellation and state management

#### User Experience Transformation
- **FOMO Marketing**: Recent EPIC+ pulls create excitement before purchase
- **Social Proof**: Real marketplace activity validation
- **Clean Visual Flow**: Hero → Info → RecentMint → Actions → YourNFTs
- **Mobile Optimized**: Infinite carousel perfect for mobile touch interaction

#### Technical Benefits
- **Single Responsibility**: Each component has clear purpose
- **Responsive Animations**: GSAP desktop infinite scroll + shadcn mobile carousel
- **API Efficiency**: Pre-filtered server-side data
- **Contract-Driven Architecture**: No hardcoded values, all data from contract
- **Resilient Fallbacks**: Simple loading states when APIs fail
- **Maintainability**: Focused, testable components

## Implementation Summary

**New Components:**
1. **RecentMint.tsx** (193 lines) - EPIC+ pulls with useGSAP animations, positioned under ContractInfo
2. **YourNFTs.tsx** (264 lines) - Performance-optimized user NFTs with proper state management
3. **NFTCard.tsx** (80 lines) - Reusable card component with fixed height & foil display

**Removed Components:**
1. **NFTGrid.tsx** (290 lines) - Split into focused, single-responsibility components

**New Features:**
- **Separated Layout**: No toggle system, both sections always visible
- **Optimal Positioning**: RecentMint (FOMO) → Actions → YourNFTs (personal)

**New API Integration:**
- **fetchRecentEpicPulls()** - VibeMarket API with contract-driven filtering

**Security & Resilience:**
- **No hardcoded values**: All data extracted from contract/environment
- **Simple fallbacks**: Loading states when APIs fail or return no data

**Result**: Clean, conversion-optimized, professional FOMO marketing funnel with contract-driven architecture.
