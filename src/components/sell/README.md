# Sell Components

Clean, focused components for NFT selling functionality following KISS principle.

## Phase 1 Components (✅ Completed)

### `useSell.tsx`
**Purpose:** Hook for handling NFT sell transactions  
**Key Features:**
- Uses `sellAndClaimOffer()` for single signature UX
- Proper error handling and loading states
- No hardcoded values - all contract-driven
- Clean, reusable interface

```typescript
const { sellNFT, isLoading, isSuccess, error } = useSell()
```

### `SellButton.tsx`
**Purpose:** Simple button component for individual NFT sells  
**Key Features:**  
- Single responsibility: sell one NFT
- Integrates with existing UI components
- Loading states and error handling
- Calls `onSuccess` callback for parent updates

```typescript
<SellButton 
  nft={nft}
  onSuccess={() => refreshNFTData()}
/>
```

## Integration

### NFTCard.tsx Changes
- ✅ Replaced complex sell logic with `<SellButton>`
- ✅ Kept UNPACK functionality intact
- ✅ Reduced component complexity significantly
- ✅ Maintained existing UI/UX patterns

## Phase 2 Components (🔄 Future)

### `BatchSellButton.tsx` (not implemented)
- Batch processing with `sellAndClaimOfferBatch()`
- Progress indication
- Single signature for multiple NFTs

### `types.ts` (not implemented)
- Shared TypeScript interfaces
- Contract interaction types

## Usage Example

```tsx
import { SellButton } from "@/components/sell/SellButton"

// In your component
<SellButton 
  nft={nftItem}
  onSuccess={() => {
    console.log('NFT sold successfully!')
    refreshNFTData() // Refresh the NFT list
  }}
  disabled={!nft.tokenId}
/>
```

## Architecture Benefits

- **Single Signature UX:** Uses `sellAndClaimOffer()` directly
- **No Hardcoded Values:** All token amounts from contract
- **Reusable:** Components can be used anywhere
- **Maintainable:** Clear separation of concerns
- **KISS Compliant:** Simple, focused responsibilities

---

*Phase 1 MVP complete. Phase 2 will add batch functionality when needed.*