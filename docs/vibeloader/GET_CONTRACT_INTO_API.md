# VibeMarket Contract Info API Reference

## Get Contract Info

**Endpoint:** `GET /contractAddress/{contractAddressOrSlug}`

**Base URL:** `https://build.wield.xyz/vibe/boosterbox`

### Headers
- **API-KEY** (string, required)
  - Default: `DEMO_REPLACE_WITH_FREE_API_KEY`
  - Free API key needed to authorize requests, grab one at docs.wield.xyz

### Path Parameters
- **contractAddressOrSlug** (string, required)
  - Contract address or slug

### Query Parameters
- **chainId** (integer, optional)
  - The chain ID

### Response
- **200**: Contract information

## Example Usage

### JavaScript Fetch
```javascript
const url = 'https://build.wield.xyz/vibe/boosterbox/contractAddress/{contractAddressOrSlug}';
const options = {
  method: 'GET', 
  headers: {'API-KEY': '<api-key>'}, 
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

### Live Example with VIBASE Collection
```javascript
const url = 'https://build.wield.xyz/vibe/boosterbox/contractAddress/0xd7a31e9b9e8a674bc52ca75561ad9b37f522714c?chainId=8453';
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

## Example Response (Latest Collection - Machinata Blitz 1)

```json
{
  "success": true,
  "contractInfo": {
    "gameId": "mb-abd0",
    "tokenAddress": "0xefb540109b3b7851feac37bf48610922794406cc",
    "tokenName": "Machinata Blitz 1",
    "tokenSymbol": "MB",
    "nftName": "Machinata Blitz 1",
    "nftSymbol": "MB",
    "description": "Machinata Blitz Series 1 features 60 unique cards! Pulling an epic, legendary or mythic will grant you access to one of three skins in the turn-based tactics game, Machinata Blitz, live on farcaster and base app!",
    "imageUrl": "https://vibechain.com/api/proxy?url=https%3A%2F%2Fimagedelivery.net%2Fg4iQ0bIzMZrjFMgjAnSGfw%2F134be981-c718-48c4-660b-6a5b486c4400%2Fpublic",
    "isGraduated": false,
    "marketCap": "00000000000007698752403649654520",
    "marketCapUsd": "$33,558.86",
    "preorderProgress": 37,
    "bgColor": "#ffc800",
    "featuredImageUrl": "https://vibechain.com/api/proxy?url=https%3A%2F%2Fimagedelivery.net%2Fg4iQ0bIzMZrjFMgjAnSGfw%2F134be981-c718-48c4-660b-6a5b486c4400%2Fpublic",
    "slug": "machinata-blitz-1",
    "ownerAddress": "0xaa661ce0f717a39d2f3df9c55e3795729c4e3353",
    "pricePerPack": "00000000000000000984034151923760",
    "pricePerPackUsd": "$4.29",
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
    "version": "v7",
    "chainId": 8453,
    "createdAt": "2025-09-02T15:49:59.114Z",
    "updatedAt": "2025-09-04T06:19:28.220Z"
  }
}
```