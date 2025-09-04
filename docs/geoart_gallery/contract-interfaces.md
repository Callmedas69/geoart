# VibeMarket Contract Interfaces

## Core Contracts for GEO ART Implementation

### IBoosterDropV2 (Primary Interface)
**Purpose**: NFT pack minting, opening, and selling

#### Key Methods:
```solidity
// Buy packs
function mint() external payable

// Sell NFTs back to contract
function sellAndClaimOffer() external

// Get NFT rarity level
function getTokenRarity(uint256 tokenId) external view returns (uint8)
```

#### Rarity Levels:
- **Common** (0)
- **Rare** (1) 
- **Epic** (2)
- **Legendary** (3)
- **Mythic** (4)

### IBoosterTokenV2 (Trading Interface)  
**Purpose**: Token trading and price calculations

#### Key Methods:
```solidity
// Buy tokens
function buy() external payable

// Sell tokens  
function sell(uint256 amount) external

// Get purchase price quote
function getEthBuyQuote(uint256 amount) external view returns (uint256)
```

#### Market Types:
- **Bonding Curve**: Algorithmic pricing
- **Uniswap Pool**: AMM liquidity

### IBoosterCardSeedUtils (Attributes Interface)
**Purpose**: Generate card attributes and effects

#### Key Methods:
```solidity
// Get card wear/condition
function wearFromSeed(uint256 seed) external view returns (uint8)

// Get foil type
function getFoilMappingFromSeed(uint256 seed) external view returns (uint8)
```

## Implementation Strategy

### For GEO ART Frontend:

#### 1. Buy Functionality
```typescript
// Use Wagmi to call mint()
const { writeContract } = useWriteContract()

const buyPack = async () => {
  writeContract({
    address: GEO_ART_CONTRACT,
    abi: IBoosterDropV2_ABI,
    functionName: 'mint',
    value: packPrice
  })
}
```

#### 2. Pack Opening
```typescript
// Pack opening happens automatically on mint
// Display rarity after transaction confirms
const { data: rarity } = useReadContract({
  address: GEO_ART_CONTRACT,
  abi: IBoosterDropV2_ABI,
  functionName: 'getTokenRarity',
  args: [newTokenId]
})
```

#### 3. Sell Functionality
```typescript
const sellNFT = async () => {
  writeContract({
    address: GEO_ART_CONTRACT,
    abi: IBoosterDropV2_ABI,
    functionName: 'sellAndClaimOffer'
  })
}
```

## GEO ART Contract Details
- **Contract Address**: `0xa2f5371bdebd577e1a059c3ddca02b0172f1f3ee` (Base network)
- **Interface**: IBoosterDropV2
- **Network**: Base (Chain ID: 8453)

## Complete Interface Available ✅

### Key Methods for Implementation:

#### 1. Get Pack Price (Dynamic)
```solidity
function getMintPrice(uint256 amount) external view returns (uint256)
```

#### 2. Buy Packs
```solidity  
function mint(uint256 amount) external payable
// OR with referrals
function mint(uint256 amount, address recipient, address referrer, address originReferrer) external payable
```

#### 3. Sell NFTs
```solidity
function sellAndClaimOffer(uint256 tokenId) external
```

#### 4. Get Rarity (Enhanced)
```solidity
struct Rarity {
    uint8 rarity;           // 1-5 (Common to Mythic)
    uint256 randomValue;
    bytes32 tokenSpecificRandomness;
}

function getTokenRarity(uint256 tokenId) external view returns (Rarity memory)
```

#### 5. Sell Offers by Rarity
```solidity
function COMMON_OFFER() external view returns (uint256)
function RARE_OFFER() external view returns (uint256)
function EPIC_OFFER() external view returns (uint256)
function LEGENDARY_OFFER() external view returns (uint256)  
function MYTHIC_OFFER() external view returns (uint256)
```

## Implementation Ready ✅
- **No pack price needed** - Use `getMintPrice(1)` for dynamic pricing
- **Complete ABI available** - All methods documented
- **API Key optional** - Core functions work without it

**Note**: All interfaces are designed for entertainment/collection purposes only.