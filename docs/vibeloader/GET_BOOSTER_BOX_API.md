# VibeMarket Booster Box API Reference

## Get Booster Box Info

**Endpoint:** `GET /`

**Base URL:** `https://build.wield.xyz/vibe/boosterbox`

### Headers
- **API-KEY** (string, required)
  - Default: `DEMO_REPLACE_WITH_FREE_API_KEY`
  - Free API key needed to authorize requests, grab one at docs.wield.xyz

### Query Parameters
- **includeMetadata** (boolean, optional)
  - Include metadata in response
- **includeContractDetails** (boolean, optional)
  - Include contract details in response
- **tokenId** (integer, required)
  - Token ID to query
- **contractAddress** (string, required)
  - Contract address
- **chainId** (integer, required)
  - The chain ID (8453 for Base)

### Response
- **200**: Booster box information

## Example Usage

### JavaScript Fetch
```javascript
const url = 'https://build.wield.xyz/vibe/boosterbox/?includeMetadata=true&includeContractDetails=true&tokenId=10&contractAddress=0xabd082947d26a4afcc9196261cb5400f9e4065fa&chainId=8453';
const options = {
  method: 'GET',
  headers: {'API-KEY': 'DEMO_REPLACE_WITH_FREE_API_KEY'},
  body: undefined
};

try {
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error(error);
}
```

## Example Response (Pre-Reveal State - Machinata Blitz Token #10)

### API Response
```json
{
  "success": true,
  "boosterBox": {
    "_id": {
      "buffer": {"0":104,"1":183,"2":18,"3":40,"4":89,"5":181,"6":159,"7":106,"8":215,"9":178,"10":206,"11":255}
    },
    "contractAddress": "0xabd082947d26a4afcc9196261cb5400f9e4065fa",
    "tokenId": 10,
    "__v": 0,
    "acquiredAtPackPrice": "00000000000000000145462856701580",
    "chainId": 8453,
    "createdAt": {},
    "lastSyncedBlockNumber": 35019425,
    "latestUpdateTimestamp": {},
    "mintBlockNumber": 35019425,
    "mintTimestamp": {},
    "mintTxHash": "0xa821bf2524ad5e5c29e8cc2ce0858cb1adffbba5db3ef6327087f7bc0bf53315",
    "owner": "0xaa661ce0f717a39d2f3df9c55e3795729c4e3353",
    "rarity": 0,
    "rarityName": "NOT_ASSIGNED",
    "status": "minted",
    "updatedAt": {},
    "contract": {
      "gameId": "mb-abd0",
      "tokenAddress": "0xefb540109b3b7851feac37bf48610922794406cc",
      "tokenName": "Machinata Blitz 1",
      "tokenSymbol": "MB",
      "nftName": "Machinata Blitz 1",
      "nftSymbol": "MB",
      "description": "Machinata Blitz Series 1 features 60 unique cards! Pulling an epic, legendary or mythic will grant you access to one of three skins in the turn-based tactics game, Machinata Blitz, live on farcaster and base app!",
      "imageUrl": "https://vibechain.com/api/proxy?url=https%3A%2F%2Fimagedelivery.net%2Fg4iQ0bIzMZrjFMgjAnSGfw%2F134be981-c718-48c4-660b-6a5b486c4400%2Fpublic",
      "isGraduated": false,
      "marketCap": "00000000000007556537547094829480",
      "marketCapUsd": "$32,991.84",
      "preorderProgress": 36,
      "bgColor": "#ffc800",
      "featuredImageUrl": "https://vibechain.com/api/proxy?url=https%3A%2F%2Fimagedelivery.net%2Fg4iQ0bIzMZrjFMgjAnSGfw%2F134be981-c718-48c4-660b-6a5b486c4400%2Fpublic",
      "slug": "machinata-blitz-1",
      "ownerAddress": "0xaa661ce0f717a39d2f3df9c55e3795729c4e3353",
      "pricePerPack": "00000000000000000968428536362811",
      "pricePerPackUsd": "$4.23",
      "dropContractAddress": "0xabd082947d26a4afcc9196261cb5400f9e4065fa",
      "disableFoil": false,
      "disableWear": false,
      "packImage": "https://vibechain.com/api/proxy?url=https%3A%2F%2Fimagedelivery.net%2Fg4iQ0bIzMZrjFMgjAnSGfw%2Fc9e8364e-98b9-456b-3f14-b75aa293a500%2Fpublic",
      "isActive": true,
      "links": {
        "twitter": "thechaingamer",
        "website": "https://x.com/thechaingamer"
      },
      "isNSFW": false,
      "isVerified": true,
      "isVerifiedArtist": true,
      "version": "v7"
    }
  }
}
```

### Pre-Reveal Metadata (ERC721 Token Metadata)
```json
{
  "name": "Machinata Blitz 1 #1",
  "description": "Buy Machinata Blitz 1 Booster Packs on vibe.market",
  "image": "https://vibechain.com/api/proxy?url=https%3A%2F%2Fimagedelivery.net%2Fg4iQ0bIzMZrjFMgjAnSGfw%2Fc9e8364e-98b9-456b-3f14-b75aa293a500%2Fpublic",
  "imageUrl": "https://vibechain.com/api/proxy?url=https%3A%2F%2Fimagedelivery.net%2Fg4iQ0bIzMZrjFMgjAnSGfw%2Fc9e8364e-98b9-456b-3f14-b75aa293a500%2Fpublic",
  "external_url": "https://vibechain.com/market/0xabd082947d26a4afcc9196261cb5400f9e4065fa",
  "attributes": [
    {"trait_type": "Rarity", "value": "Unopened", "display_type": "string"},
    {"trait_type": "Randomness", "value": 0, "display_type": "number"},
    {"trait_type": "Status", "value": "Minted"}
  ]
}
```

## Key Insights

### Pre-Reveal State Indicators
- **Status**: `"minted"` (not opened yet)
- **Rarity**: `0` (not assigned)
- **RarityName**: `"NOT_ASSIGNED"`
- **Metadata Rarity**: `"Unopened"`
- **Randomness**: `0` (no randomness assigned)

### Visual Elements
- **Image**: Uses `packImage` from contract info (pack cover image)
- **Same for all unopened packs**: Generic booster pack metadata

### Workflow Understanding
1. **Mint**: Creates booster with pre-reveal metadata
2. **Open**: User triggers reveal transaction
3. **Reveal**: VibeMarket assigns actual rarity and attributes
4. **Post-Reveal**: Metadata updates with real card data

*Note: Our deployment tool generates post-reveal metadata for individual cards, not this pre-reveal booster pack metadata.*