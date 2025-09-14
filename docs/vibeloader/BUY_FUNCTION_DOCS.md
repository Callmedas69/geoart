# BuyFunction Documentation

## Overview
BuyFunction provides creators the ability to purchase their own packs immediately after collection deployment, before sharing publicly. This gives creators first-buy opportunity while maintaining simple, secure implementation.

## Purpose
- **Creator Priority**: Allow creators to buy first before public sharing
- **No Additional Phases**: Uses standard public sale, just timing control
- **Simple Flow**: Deploy → Creator Buys Packs → Share Collection

## Architecture (KISS Principle)

### Folder Structure
```
src/
├── hooks/BuyFunction/
│   ├── useBuyToken.ts     // Single hook: buy transaction + price quote
│   └── index.ts
├── components/BuyFunction/
│   ├── BuyModal.tsx       // Complete modal with all buy UI
│   └── index.ts
└── types/BuyFunction/     // Only if essential types needed
    ├── buy.ts
    └── index.ts
```

### Design Principles Applied
- ✅ **KISS**: Maximum 3 files, no over-engineering
- ✅ **Secure**: Uses existing verified ABIs
- ✅ **Performance**: Single hook, single modal component
- ✅ **Professional**: Clean separation, reusable components
- ✅ **Not Overcomplicated**: No micro-components or unnecessary abstractions

## Implementation Details

### 1. useBuyToken Hook
**File**: `src/hooks/BuyFunction/useBuyToken.ts`
- Handles mint transactions using `IBoosterDropV2ABI.ts` with referrer system
- Manages price quotes via `getMintPrice()`
- Uses environment variables for referrer addresses (NEXT_PUBLIC_VIBEMARKET_REFERRER_ADDRESS)
- Console error suppression for clean user experience
- Single hook for all mint-related logic

### 2. BuyModal Component
**File**: `src/components/BuyFunction/BuyModal.tsx`
- Complete modal with integrated pack minting functionality
- Includes ETH + USD price display, pack amount input, and mint button
- Connected wallet integration for creator address
- Minimal error messages for user-friendly experience
- No separate sub-components (KISS principle)

### 3. Types (If Needed)
**File**: `src/types/BuyFunction/buy.ts`
- Only essential types not covered by existing ABIs
- Minimal interface definitions

## Integration Flow

### Deployment Integration
1. **Collection Deploys** → Success state reached
2. **BuyModal Appears** → Creator can immediately purchase
3. **Creator Buys** → Tokens acquired
4. **Creator Shares** → Collection announced publicly

### Technical Flow
```typescript
// After successful deployment
const { showBuyModal } = useBuyToken()
showBuyModal({
  tokenAddress: deployedTokenAddress,
  creatorAddress: wallet.address,
  referrer: process.env.NEXT_PUBLIC_VIBEMARKET_REFERRER_ADDRESS,        // From env: 0xdc41...
  originReferrer: process.env.NEXT_PUBLIC_VIBEMARKET_ORIGIN_REFERRER_ADDRESS // From env: 0x0000...
})
```

**Environment Variables:**
- `NEXT_PUBLIC_VIBEMARKET_REFERRER_ADDRESS=0xdc41d6DA6Bb2D02b19316B2bfFF0CBb42606484d`
- `NEXT_PUBLIC_VIBEMARKET_ORIGIN_REFERRER_ADDRESS=0x0000000000000000000000000000000000000000`

## ABI References

### Mint Functions Available
From `IBoosterDropV2ABI.ts`:
- `mint(uint256 amount, address recipient, address referrer, address originReferrer)` - **Primary function for pack minting**

**Referrer Parameters Explained:**
- **referrer**: Direct referrer who brought the user (platform address: `0xdc41...484d`)
- **originReferrer**: Original/root referrer in the chain (zero address: `0x0000...0000`)
- **Implementation**: Uses environment variables for configuration

### Price Functions Available
- `getMintPrice(uint256 amount)` - Get ETH cost for pack minting

## Benefits

### For Creators
- **First Access**: Mint desired packs before public announcement
- **Control Timing**: Decide when to share collection
- **Simple Process**: No complex phases or restrictions
- **Dual Pricing**: See both ETH and USD costs for informed decisions

### For Development
- **No Contract Changes**: Uses existing drop contract functions
- **Minimal Code**: KISS principle applied throughout
- **Reusable**: BuyModal can be used elsewhere in app
- **Maintainable**: Clear structure, focused responsibility
- **ETH Price API**: Server-side caching with fallbacks
- **Error Suppression**: Clean user experience without technical errors

## Security Considerations
- Uses existing verified smart contract ABIs (`IBoosterDropV2ABI`)
- No additional permissions or access control needed
- Standard mint functions with proven security
- Creator self-purchase is transparent on blockchain
- Environment variables prevent hardcoded addresses
- Input validation for pack amounts and addresses
- Server-side API key protection for ETH price data
- Console error suppression prevents information leakage

## Performance Optimizations
- Single hook reduces re-renders
- Integrated modal reduces component tree depth
- Minimal file structure reduces bundle size
- Direct ABI usage without wrapper layers
- ETH price caching (5-minute intervals) reduces API calls
- Debounced price calculations for smooth UX

## Implementation Timeline

### Priority Scale & Phased Approach

**Phase 1: Foundation** ⭐⭐⭐ (HIGH PRIORITY - CRITICAL)
- Create folder structure
- Set up basic index files
- **Time**: 5 minutes
- **Risk**: Low

**Phase 2: Core Logic** ⭐⭐⭐ (HIGH PRIORITY - CRITICAL)
- Implement `useBuyToken` hook
- ABI integration for buy functions with referrer system
- Price quote logic (getTokenBuyQuote)
- Environment variable integration
- Error handling and validation
- **Time**: 30 minutes
- **Risk**: Medium (ABI integration)

**Phase 3: UI Component** ⭐⭐ (MEDIUM PRIORITY)
- Build `BuyModal` component
- Form validation, error handling
- **Time**: 45 minutes
- **Risk**: Low

**Phase 4: Standalone Testing** ⭐⭐⭐ (HIGH PRIORITY)
- Test buy functionality independently
- Verify ABI calls work
- **Time**: 20 minutes
- **Risk**: High (Contract interaction)

**Phase 5: Integration** ⭐⭐ (MEDIUM PRIORITY)
- Connect to deployment flow
- Success state trigger
- **Time**: 15 minutes
- **Risk**: Low

**Phase 6: Validation** ⭐ (LOW PRIORITY)
- End-to-end testing
- Edge case handling
- **Time**: 20 minutes
- **Risk**: Low

### Summary
- **Total Estimated Time**: ~2.5 hours
- **Critical Path**: Phases 1-2-4 (Core functionality)
- **Implementation Order**: Foundation → Core Logic → Testing → UI → Integration → Validation

---

## Additional Features Implemented

### ETH Price API Integration
**Files**: `/api/eth-price/route.ts`, `useEthPrice.ts`
- Server-side ETH price fetching with API key protection
- 5-minute caching for performance
- Automatic fallbacks for network issues
- Clean user-friendly error messages

### User Experience Enhancements
- **Dual Pricing**: Shows both ETH and USD amounts (`"0.0500 ETH (~$233.13)"`)
- **Connected Wallet**: Uses actual wallet address as creator
- **Minimal Errors**: Clean messages like `"User rejected the request"`
- **Default Values**: Starts with 0 packs, clear call-to-action
- **Console Suppression**: Hides technical errors from users

---

**Status**: Implementation Complete ✅
**Current Phase**: Phase 4 - Standalone Testing Complete
**Next**: Phase 5 - Ready for Deployment Integration
**Reference**: [Wield Docs](https://docs.wield.xyz/docs/vibemarket/developers#common-use-cases)