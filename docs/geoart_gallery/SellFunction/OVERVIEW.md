# Sell Function - KISS Implementation Overview

## Problem Statement
Current `YourNFTs.tsx` has 700+ lines handling multiple responsibilities. Need to extract sell functionality into focused, simple components following KISS principle.

## Core Issues to Fix
- ❌ Hardcoded token amounts (20,000) - Use contract rarity offers
- ❌ No market type detection - Check bonding curve vs Uniswap pool
- ❌ Missing slippage protection - Use 2% tolerance minimum
- ❌ Multiple signatures - Optimize for single signature UX

## KISS Solution: 3 Simple Components

### 1. SellButton.tsx
**One job:** Sell single NFT with best UX
- Use `sellAndClaimOffer(tokenId)` - single signature
- Show simple loading/success states
- Handle errors gracefully

### 2. BatchSellButton.tsx  
**One job:** Sell multiple NFTs optimally
- Use `sellAndClaimOfferBatch(tokenIds)` - single signature for all
- Show progress: "2 of 5 NFTs sold"
- Stop on first error

### 3. useSellHook.tsx
**One job:** Shared contract interactions
- Get token contract address
- Check market type (cache result)
- Refresh NFT data after success

## Success Criteria
✅ **Single signature** - Use batch functions when possible  
✅ **Correct pricing** - Query contract offer amounts  
✅ **Simple UX** - Clear loading states, error messages  
✅ **Performance** - Cache contract addresses and market type  
✅ **Security** - Always use slippage protection  

## What We DON'T Include (KISS)
❌ Complex retry mechanisms  
❌ Advanced caching strategies  
❌ Multiple data flow patterns  
❌ Sophisticated progress animations  
❌ Background processing queues  

---
*Keep It Simple, Secure - One component, one job.*