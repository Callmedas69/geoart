# Vibe.Market Platform Research for Developers

## Overview
Comprehensive analysis of Vibe.Market collection creation workflow based on HAR file investigation, platform documentation, and blockchain architecture research conducted for understanding post-metadata-confirmation deployment processes.

## Critical Findings

### 1. Collection Creation Architecture

**Frontend Interface Components:**
- **CreatePackProvider**: React context managing collection state including packName, metadataItems, featuredIndex, and deployment configuration
- **Pre-buy Modal**: Interface for creators to purchase initial packs for anti-bot protection (0-100 packs)
- **Requirements Validation**: Enforces minimum 4-5 metadata items, unique rarities (Common, Rare, Epic, Legendary, Mythic), and naming requirements

**API Integration Pattern:**
- **Authentication**: JWT token-based system using wallet signature verification
- **Metadata Pipeline**: Draft creation → Confirmation → Contract deployment trigger
- **State Management**: React hooks managing loading states, error handling, and transaction monitoring

### 2. Collection Creation Workflow Sequence

**Phase 1: Metadata Preparation**
1. Image upload and validation (max 1000 items, min 4-5 based on contract version)
2. Rarity assignment ensuring coverage of all tiers
3. Featured image selection (index-based or custom)
4. Collection configuration (name, symbol, description, links)

**Phase 2: Draft Creation & Confirmation**
1. **POST** to `/vibe/metadata/draft` with collection payload
2. API response includes `draftId` for tracking
3. **POST** to `/vibe/metadata/confirm` with `draftId`
4. Confirmation returns success status preparing for deployment

**Phase 3: Contract Deployment** *(Missing Link Identified)*
From JavaScript code analysis, deployment uses:
```javascript
// Contract interaction via wagmi/viem
const { writeContractAsync } = useWriteContract()
// Deployment monitoring with polling intervals
refetchInterval: polling ? [2s, 3s, 5s, 10s] : false
```

**Phase 4: Post-Deployment Integration**
1. Contract address capture and state updates
2. **GET** `/vibe/boosterbox/contractAddress/{address}/ready` polling
3. Collection readiness confirmation with progress tracking
4. GameID generation following pattern: `{slug}-{contractPrefix}`

### 3. Technical Implementation Details

**Smart Contract Architecture:**
- **Factory Pattern**: Auto-deployment of both IBoosterTokenV2 and IBoosterDropV2 contracts
- **Bonding Curve Economics**: Preorder phase with dynamic pricing before Uniswap graduation
- **Randomness Integration**: Pyth Network for on-chain pack opening mechanics

**Authentication & Security:**
- **2-Step Challenge Flow**: Message request → Signature → JWT token
- **LocalStorage Persistence**: `vibeAuthToken` key with automatic validation
- **API Key Integration**: `vibechain-default-5477272` for backend services

### 4. Platform Economics & Features

**Fee Structure:**
- Trading Fee: ~7.5% total
  - Creator: 40%
  - Referrers: 10%
  - Platform: 50%
- Small opening fee for randomness (~$0.01 via Pyth Network)

**Market Phases:**
- **Preorder (Bonding Curve)**: Ticket prices increase as more are bought, progress towards graduation threshold
- **Graduation**: Portion of tokens move to Uniswap V3, trading shifts to open market

**Monetization:**
- Creator earns percentage of all trades
- Collections reach graduation thresholds for additional features

### 5. Missing Components & Gaps

**Primary Gap**: HAR file doesn't contain actual deployment trigger API call, likely because:
1. Captured session was for browsing/UI interaction rather than active deployment
2. Deployment happens via direct smart contract interaction rather than API
3. Session didn't include final "Deploy" button click sequence

**Secondary Gaps:**
1. Pre-buy pack purchase integration details
2. Transaction monitoring and error handling specifics
3. GameID assignment and retrieval mechanism post-deployment

## Key Technical Insights

### GameID Retrieval Strategy
GameID becomes available through `/vibe/boosterbox/` API queries, but only **after the first pack is minted**. This explains "BoosterBox not found" errors when querying newly deployed contracts.

**Pattern**: `{collectionSlug}-{contractAddressPrefix}`
**Example**: `mb-abd0` for Machinata Blitz collection

### Hybrid Architecture Approach
Vibe.Market uses **API for metadata management** combined with **direct smart contract interaction** for deployment, representing modern DeFi/GameFi hybrid design patterns.

### Progressive Economic Model
The platform implements **bonding curve → Uniswap graduation** progression with **on-chain randomness generation**, representing advanced blockchain application architecture beyond simple NFT minting.

## Development Considerations

### Scalability Architecture
Separation of metadata confirmation from contract deployment enables **batch processing optimization** and **gas fee management** across multiple collections.

### State Management Complexity
Polling intervals [2s, 3s, 5s, 10s] suggest **exponential backoff patterns** optimized for Base blockchain block times.

### Integration Opportunities
Missing deployment trigger likely involves **factory contract patterns** that could be reverse-engineered by analyzing successful deployment transactions on Base blockchain.

## Next Steps for Implementation

### 1. Transaction Analysis
Analyze successful deployment transactions on BaseScan using contract addresses from logs to identify exact factory contract interaction pattern.

### 2. Factory Contract Investigation
Research factory contract at Base blockchain to understand deployment trigger mechanism.

### 3. Pack Minting Integration
Implement first pack minting functionality to enable gameID retrieval through booster box API.

### 4. State Monitoring
Implement polling system with exponential backoff for deployment status monitoring.

## Web Research Sources

- **Official Documentation**: docs.wield.xyz/docs/vibemarket
- **Platform URL**: vibechain.com/market
- **Architecture**: Built on Base blockchain (Layer-2 Ethereum)
- **Development Environment**: No permission required for deployment
- **Integration**: Smart contract interfaces available for developers

## Conclusions

The Vibe.Market platform represents sophisticated blockchain application architecture with:
- **Metadata layer** operating through REST APIs for efficiency
- **Economic layer** leveraging on-chain smart contracts for trustlessness
- **State synchronization** through polling-based monitoring systems
- **Liquidity bootstrapping** via pre-buy mechanism and bonding curve economics

The missing deployment trigger mechanism appears to be direct smart contract interaction via wagmi/viem rather than additional API endpoints, requiring further investigation of factory contract patterns on Base blockchain.