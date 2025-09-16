# Contract Interface - Security Essentials

## Contract Functions (From ABI)

### BoosterDropV2 (NFT Contract)
```typescript
// Single NFT sell - PRIMARY (1 signature)
await boosterDrop.sellAndClaimOffer(tokenId: bigint)

// Batch NFT sell - OPTIMAL (1 signature for all)
await boosterDrop.sellAndClaimOfferBatch(tokenIds: bigint[])

// Get offer amounts (cache these values)
await boosterDrop.COMMON_OFFER() // → bigint
await boosterDrop.RARE_OFFER() // → bigint  
await boosterDrop.EPIC_OFFER() // → bigint
await boosterDrop.LEGENDARY_OFFER() // → bigint
await boosterDrop.MYTHIC_OFFER() // → bigint

// Get NFT rarity (for estimates only)
await boosterDrop.getTokenRarity(tokenId: bigint) 
// → { rarity: 1-5, randomValue: bigint, tokenSpecificRandomness: bytes32 }

// Get token contract address
await boosterDrop.boosterTokenAddress() // → address
```

### BoosterTokenV2 (Token Contract) 
```typescript
// Market type (cache this)
await boosterToken.marketType() // → 0=BONDING_CURVE, 1=UNISWAP_POOL

// Token balance (if 2-step required)
await boosterToken.balanceOf(userAddress: address) // → bigint

// Slippage protection (if 2-step required)  
await boosterToken.getTokenSellQuote(tokenAmount: bigint) // → bigint (ETH)

// Sell tokens (FALLBACK - if 2-step required)
await boosterToken.sell(
  tokenAmount: bigint,
  recipient: address,
  minPayout: bigint, // Use 2% slippage tolerance
  referrer: address,
  originReferrer: address
)
```

## Security Requirements

### 1. Never Hardcode Token Amounts
❌ **Wrong:** `const tokens = BigInt("20000000000000000000000")`  
✅ **Right:** Query actual contract offer amounts

### 2. Always Use Slippage Protection (If 2-step)
```typescript
// Get quote and apply 2% tolerance
const ethQuote = await boosterToken.getTokenSellQuote(tokenAmount)
const minPayout = (ethQuote * 98n) / 100n
```

### 3. Check Market Type
```typescript
// Cache this result - don't query repeatedly
const marketType = await boosterToken.marketType()
// Affects pricing and liquidity
```

### 4. Use Batch Functions When Available
```typescript
// Try batch first (better UX)
try {
  await boosterDrop.sellAndClaimOfferBatch(tokenIds)
} catch (error) {
  // Fallback to individual sells
  for (const tokenId of tokenIds) {
    await boosterDrop.sellAndClaimOffer(tokenId)
  }
}
```

## Error Handling
```typescript
// Simple error categories
const handleSellError = (error: Error) => {
  if (error.message.includes('insufficient funds')) {
    return 'Not enough ETH for gas'
  }
  if (error.message.includes('slippage')) {
    return 'Price changed - please retry'
  }
  if (error.message.includes('user rejected')) {
    return 'Transaction cancelled'
  }
  return 'Sell failed - please try again'
}
```

## Gas Optimization
- Use batch functions to reduce transaction count
- Cache contract addresses and constants
- Don't query market type repeatedly
- Estimate gas before transaction

---
**Security Priority:** Correct pricing, slippage protection, proper error handling