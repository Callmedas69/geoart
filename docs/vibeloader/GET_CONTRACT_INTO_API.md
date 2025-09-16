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
    "gameId": "mmnw-d8e1",
    "tokenAddress": "0x653ebfeb21038cd5170995c27dbd19ffaa0d8897",
    "tokenName": "Make Meme Not War",
    "tokenSymbol": "MMNW",
    "nftName": "Make Meme Not War",
    "nftSymbol": "MMNW",
    "description": "Make Meme Not War is a whimsical, feel-good NFT card collection designed to spread joy, laughter, and positivity across the digital world.\n Inspired by the classic phrase \"Make Love Not War,\" this collection flips the script to celebrate memes as a universal language of humor and unity. The core mission? To encourage more smiles than bombs—promoting peace through playful and good Vibes\nEnojoy \r\n\r\n",
    "imageUrl": "https://vibechain.com/api/proxy?url=https%3A%2F%2Fimagedelivery.net%2Fg4iQ0bIzMZrjFMgjAnSGfw%2Fa002a168-a06b-411e-e911-e6cc87e6db00%2Fpublic",
    "isGraduated": false,
    "marketCap": "00000000000001045543293339125900",
    "marketCapUsd": "$4,743.63",
    "preorderProgress": 17,
    "bgColor": "#000000",
    "featuredImageUrl": "https://vibechain.com/api/proxy?url=https%3A%2F%2Fimagedelivery.net%2Fg4iQ0bIzMZrjFMgjAnSGfw%2Fa002a168-a06b-411e-e911-e6cc87e6db00%2Fpublic",
    "slug": "make-meme-not-war",
    "ownerAddress": "0x95ac550ea3ac5764019e6be0fb1096c0598165b6",
    "pricePerPack": "00000000000000000161222241115305",
    "pricePerPackUsd": "$0.73",
    "dropContractAddress": "0xd8e13ccb92935cec70d6924af61c63795403db56",
    "disableFoil": false,
    "disableWear": false,
    "packImage": "https://vibechain.com/api/proxy?url=https%3A%2F%2Fimagedelivery.net%2Fg4iQ0bIzMZrjFMgjAnSGfw%2F2d5d5cf6-90e5-48fb-9fa8-f3d62d74b500%2Fpublic",
    "isActive": true,
    "links": {
      "twitter": "Yasy",
      "website": ""
    },
    "isNSFW": false,
    "isVerified": false,
    "isVerifiedArtist": false,
    "version": "v8",
    "chainId": 8453,
    "createdAt": "2025-09-12T15:17:42.782Z",
    "updatedAt": "2025-09-12T15:25:36.385Z"
  }
}
```