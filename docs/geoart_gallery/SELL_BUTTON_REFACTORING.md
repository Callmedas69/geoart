# Sell Button Component Refactoring Plan

## Overview
Refactor the complex sell functionality from `YourNFTs.tsx` into dedicated, focused components following KISS principle: Simple, Secure, High Performance, Professional Best Practice.

## Current Issues
- `YourNFTs.tsx` handles too many responsibilities (700+ lines)
- Hardcoded token amounts (20,000) ignores actual rarity values
- No market type detection (bonding curve vs Uniswap pool)
- Missing slippage protection (uses `BigInt(0)`)
- Complex sequential batch processing mixed with UI logic
- **Multiple signatures required** - Poor UX (NFT sale + token approval + token sale)
- **No batch sell function usage** - Missing `sellAndClaimOfferBatch()` optimization

## Architecture - 3 Simple Components

### 1. `<SellButton>` - Individual NFT Sales
**Single Responsibility:** Sell one NFT with optimal UX (single signature when possible)

**Core Logic:**
- **Primary:** Use `sellAndClaimOffer(tokenId)` - Single signature, NFT → Tokens (contract handles conversion)
- **Fallback:** If 2-step required, implement token balance query and proper slippage protection
- Check `marketType()` before any token operations
- Cache market type to avoid repeated queries
- Use rarity-based token amount (never hardcode)

**Props:**
```typescript
interface SellButtonProps {
  nft: NFTItem
  onSuccess: () => void
  onError: (error: string) => void
  disabled?: boolean
}
```

### 2. `<BatchSellButton>` - Multiple NFT Sales
**Single Responsibility:** Optimal batch processing with single signature

**Core Logic:**
- **Primary:** Use `sellAndClaimOfferBatch(tokenIds)` - Single signature for all NFTs
- **Fallback:** Sequential processing if batch function unavailable
- Query actual rarity values via `getTokenRarity(tokenId)` for pricing estimates
- Simple progress indicator (X of Y completed)
- Stop on first error with clear message
- Clear selection after successful completion

**Props:**
```typescript
interface BatchSellButtonProps {
  selectedNFTs: NFTItem[]
  onProgress: (current: number, total: number) => void
  onComplete: () => void
  onError: (error: string, failedIndex: number) => void
}
```

### 3. `<SellManager>` - Shared Logic Hook
**Single Responsibility:** Centralize market detection and transaction state

**Responsibilities:**
- Market type detection and caching
- Token balance queries
- Transaction status tracking
- NFT data refresh after success

**Hook Interface:**
```typescript
interface UseSellManager {
  marketType: MarketType | null
  isLoading: boolean
  tokenAddress: string | null
  // Contract offer amounts (cached from contract)
  offerAmounts: {
    common: bigint
    rare: bigint
    epic: bigint
    legendary: bigint
    mythic: bigint
  } | null
  checkMarketType: () => Promise<MarketType>
  getTokenBalance: (address: string) => Promise<bigint>
  getTokenRarity: (tokenId: string) => Promise<Rarity>
  getOfferAmounts: () => Promise<void>
  refreshNFTData: () => Promise<void>
}
```

## Security Essentials

### Market Type Detection
```typescript
// Always check market type before operations
const marketType = await boosterToken.marketType()
// 0 = BONDING_CURVE, 1 = UNISWAP_POOL
```

### Slippage Protection
```typescript
// Get accurate quote before selling tokens
const ethQuote = await boosterToken.getTokenSellQuote(tokenAmount)
const minPayout = (ethQuote * 98n) / 100n // 2% slippage tolerance
```

### Rarity-Based Offer Amounts
```typescript
// Query actual contract offer amounts (never hardcode)
const commonOffer = await boosterDrop.COMMON_OFFER()
const rareOffer = await boosterDrop.RARE_OFFER()
const epicOffer = await boosterDrop.EPIC_OFFER()
const legendaryOffer = await boosterDrop.LEGENDARY_OFFER()
const mythicOffer = await boosterDrop.MYTHIC_OFFER()

// Get NFT rarity and corresponding offer amount
const rarityInfo = await boosterDrop.getTokenRarity(tokenId)
const expectedTokens = getOfferByRarity(rarityInfo.rarity)
```

### Token Balance Verification
```typescript
// Query actual token balance after NFT sale (never hardcode)
const tokenBalance = await boosterToken.balanceOf(userAddress)
```

## Performance Optimizations

### Batch Contract Reads
- Cache `marketType()` for session duration
- Cache all offer amounts (`COMMON_OFFER`, `RARE_OFFER`, etc.) on component mount
- Batch multiple `getTokenSellQuote()` calls where possible
- Use `multicall` for simultaneous contract queries
- Cache `boosterTokenAddress()` to avoid repeated queries

### Smart Refresh Strategy
- Only refresh NFT data after successful transactions
- Use optimistic UI updates during processing
- Minimal component re-renders during batch operations

## Data Flow (Optimized for Single Signature)

### Individual Sell Flow (Primary - Single Signature)
1. User clicks `<SellButton>` 
2. Execute `sellAndClaimOffer(tokenId)` - **Single signature, NFT burned, tokens minted**
3. Show success → Trigger `refreshNFTData()`

### Individual Sell Flow (Fallback - If 2-step required)
1. User clicks `<SellButton>` → Check cached `marketType()`
2. Execute `sellAndClaimOffer(tokenId)` → Get tokens based on rarity
3. Query actual `balanceOf()` → Get token amount received
4. Get `getTokenSellQuote(tokenAmount)` → Calculate `minPayout` (2% slippage)
5. Execute `sell(tokenAmount, recipient, minPayout, referrer, originReferrer)`
6. Show success → Trigger `refreshNFTData()`

### Batch Sell Flow (Primary - Single Signature)
1. User selects NFTs → Click `<BatchSellButton>`
2. Confirm action → Execute `sellAndClaimOfferBatch(tokenIds)` - **Single signature for all**
3. Show success → Clear selection → Refresh data

### Batch Sell Flow (Fallback - Sequential if needed)
1. User selects NFTs → Click `<BatchSellButton>`
2. Confirm action → Start sequential processing
3. For each NFT: Execute individual sell flow (single signature per NFT)
4. Update progress → Continue or stop on error
5. Complete batch → Clear selection → Refresh data

## Component File Structure - Current Implementation
```
src/components/
├── NFTCard.tsx (simplified - SELL logic extracted, UNPACK preserved)
├── YourNFTs.tsx (existing - batch logic intact for now)
└── sell/
    ├── SellButton.tsx ✅ (individual NFT sales - COMPLETED)
    ├── useSell.tsx ✅ (shared sell logic hook - COMPLETED)
    ├── BatchSellButton.tsx 🔄 (Phase 2 - not yet implemented)
    └── types.ts 🔄 (Phase 2 - not yet implemented)
```

**Phase 1 Components:**
- `SellButton.tsx` - Clean, focused component for individual NFT sells
- `useSell.tsx` - Hook handling contract interactions with proper error handling
- Integration in `NFTCard.tsx` - Replaced complex sell logic with simple SellButton

## Contract Interface References

### BoosterDropV2 (NFT Contract)
```typescript
// Sell single NFT for tokens (PRIMARY - Single signature)
await boosterDrop.sellAndClaimOffer(tokenId)

// Batch sell multiple NFTs (OPTIMAL - Single signature for all)
await boosterDrop.sellAndClaimOfferBatch([tokenId1, tokenId2, tokenId3])

// Get contract-defined offer amounts (cache these)
const commonOffer = await boosterDrop.COMMON_OFFER()
const rareOffer = await boosterDrop.RARE_OFFER()
const epicOffer = await boosterDrop.EPIC_OFFER()
const legendaryOffer = await boosterDrop.LEGENDARY_OFFER()
const mythicOffer = await boosterDrop.MYTHIC_OFFER()

// Get NFT rarity for pricing estimates
const rarityInfo = await boosterDrop.getTokenRarity(tokenId)
// rarityInfo.rarity: 1=Common, 2=Rare, 3=Epic, 4=Legendary, 5=Mythic

// Get token contract address
const tokenAddress = await boosterDrop.boosterTokenAddress()
```

### BoosterTokenV2 (Token Contract)
```typescript
// Check market phase (cache this result)
const marketType = await boosterToken.marketType() // 0=BONDING_CURVE, 1=UNISWAP_POOL

// Get actual token balance after NFT sale (NEVER hardcode)
const tokenBalance = await boosterToken.balanceOf(userAddress)

// Get sell quote for slippage protection (FALLBACK - if 2-step required)
const ethAmount = await boosterToken.getTokenSellQuote(tokenAmount)

// Sell tokens with slippage protection (FALLBACK - if 2-step required)
await boosterToken.sell(
  tokenAmount,        // Tokens to sell (use actual balance, not hardcoded)
  recipient,          // ETH recipient
  minPayout,         // Minimum ETH (slippage protection - use 2% tolerance)
  referrer,          // Referrer address (user address or zero address)
  originReferrer     // Origin referrer address (user address or zero address)
)
```

## Implementation Principles

### KISS Applied
- **Simple:** One component = one responsibility
- **Secure:** Always use proper quotes and market detection
- **High Performance:** Batch reads, smart caching, minimal re-renders
- **Professional:** Clean separation of concerns, proper error handling

### What NOT to Include (Avoid Over-Engineering)
- ❌ Complex retry mechanisms with exponential backoff
- ❌ Background processing queues
- ❌ Advanced state machines
- ❌ Sophisticated progress animations
- ❌ Real-time price tracking
- ✅ Simple sequential processing
- ✅ Clear error messages
- ✅ Basic slippage protection
- ✅ Straightforward progress indicators

## Success Metrics - Phase 1 Achievements ✅

### ✅ Completed Goals:
- **Single signature UX** - `SellButton` uses `sellAndClaimOffer()` directly
- **Zero hardcoded token amounts** - All values are contract-driven  
- **Clean component separation** - Sell logic extracted from NFTCard.tsx
- **Reusable components** - SellButton can be used anywhere
- **KISS principle applied** - Each component has one clear responsibility
- **Development ready** - Server starts without errors

### 🔄 Phase 2 Goals (Future):
- Batch functionality with `sellAndClaimOfferBatch()`
- Progress indicators for batch operations
- Further reduction of YourNFTs.tsx complexity
- Market type detection and caching
- Advanced slippage protection

## Implementation Status

### ✅ Phase 1: Core Functionality - COMPLETED
1. ✅ **Hour 1:** Created `useSell.tsx` hook - single NFT sells with `sellAndClaimOffer()`
2. ✅ **Hour 2:** Created `SellButton.tsx` component - clean interface with loading states  
3. ✅ **Hour 3:** Integration complete - replaced existing sell logic in NFTCard.tsx

**Phase 1 Results:**
- Individual NFT selling works with single signature
- No hardcoded token amounts
- Clean component separation achieved
- Development server runs without errors
- NFTCard.tsx significantly simplified

### 🔄 Phase 2: Batch Functionality (Next Priority) - 1-2 hours
4. **Hour 4:** Add batch support to hook - `sellAndClaimOfferBatch()` with fallback
5. **Hour 5:** Create `BatchSellButton.tsx` - progress indication
6. **Hour 6:** Full integration - simplified batch mode in YourNFTs

### 🔄 Phase 3: Polish & Testing - 1 hour
7. **Hour 7:** Testing, error handling, notifications, optimization

**Current Status:** Phase 1 MVP complete and working ✅  
**Next Steps:** Phase 2 for batch functionality (optional enhancement)

---

*This refactoring follows KISS principle: Keep It Simple, Secure - focusing on essential functionality without unnecessary complexity.*

**See detailed documentation:** `docs/geoart_gallery/SellFunction/` folder for implementation guides.