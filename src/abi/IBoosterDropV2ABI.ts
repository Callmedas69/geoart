import { Abi } from 'viem'

// Structs
export interface InitializeParams {
  owner: `0x${string}`
  nftName: string
  nftSymbol: string
  tokenAddress: `0x${string}`
  baseURI: string
  tokensPerMint: bigint
  commonOffer: bigint
  rareOffer: bigint
  epicOffer: bigint
  legendaryOffer: bigint
  mythicOffer: bigint
  entropyAddress: `0x${string}`
}

export interface SequenceRequest {
  batchId: bigint
  recipient: `0x${string}`
}

export interface Rarity {
  rarity: number
  randomValue: bigint
  tokenSpecificRandomness: `0x${string}`
}

export enum MarketType {
  BONDING_CURVE = 0,
  UNISWAP_POOL = 1
}

// Typed ABI for the IBoosterDropV2 contract
export const boosterDropV2Abi = [
  // Initialize function
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'owner', type: 'address' },
          { internalType: 'string', name: 'nftName', type: 'string' },
          { internalType: 'string', name: 'nftSymbol', type: 'string' },
          { internalType: 'address', name: 'tokenAddress', type: 'address' },
          { internalType: 'string', name: 'baseURI', type: 'string' },
          { internalType: 'uint256', name: 'tokensPerMint', type: 'uint256' },
          { internalType: 'uint256', name: 'commonOffer', type: 'uint256' },
          { internalType: 'uint256', name: 'rareOffer', type: 'uint256' },
          { internalType: 'uint256', name: 'epicOffer', type: 'uint256' },
          { internalType: 'uint256', name: 'legendaryOffer', type: 'uint256' },
          { internalType: 'uint256', name: 'mythicOffer', type: 'uint256' },
          { internalType: 'address', name: 'entropyAddress', type: 'address' }
        ],
        internalType: 'struct InitializeParams',
        name: 'params',
        type: 'tuple'
      }
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  // Mint function (basic)
  {
    inputs: [
      { internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  // Mint function (with referrers)
  {
    inputs: [
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'address', name: 'recipient', type: 'address' },
      { internalType: 'address', name: 'referrer', type: 'address' },
      { internalType: 'address', name: 'originReferrer', type: 'address' }
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  // Mint with token
  {
    inputs: [
      { internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'mintWithToken',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  // Sell and claim offer
  {
    inputs: [
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' }
    ],
    name: 'sellAndClaimOffer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  // Get mint price
  {
    inputs: [
      { internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'getMintPrice',
    outputs: [
      { internalType: 'uint256', name: 'tokenAmount', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  // Tokens per mint
  {
    inputs: [],
    name: 'tokensPerMint',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  // Offer amounts
  {
    inputs: [],
    name: 'COMMON_OFFER',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'RARE_OFFER',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'EPIC_OFFER',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'LEGENDARY_OFFER',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'MYTHIC_OFFER',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  // Contract addresses
  {
    inputs: [],
    name: 'boosterTokenAddress',
    outputs: [
      { internalType: 'address', name: '', type: 'address' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'entropyAddress',
    outputs: [
      { internalType: 'address', name: '', type: 'address' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'entropyProvider',
    outputs: [
      { internalType: 'address', name: '', type: 'address' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  // Entropy fee
  {
    inputs: [],
    name: 'getEntropyFee',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  // Get token rarity
  {
    inputs: [
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' }
    ],
    name: 'getTokenRarity',
    outputs: [
      {
        components: [
          { internalType: 'uint8', name: 'rarity', type: 'uint8' },
          { internalType: 'uint256', name: 'randomValue', type: 'uint256' },
          { internalType: 'bytes32', name: 'tokenSpecificRandomness', type: 'bytes32' }
        ],
        internalType: 'struct Rarity',
        name: 'rarityInfo',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  // Balance of user
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' }
    ],
    name: 'balanceOf',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  // Open packs (unpack functionality)
  {
    inputs: [
      { internalType: 'uint256[]', name: 'tokenIds', type: 'uint256[]' }
    ],
    name: 'open',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'requester', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'batchId', type: 'uint256' },
      { indexed: false, internalType: 'uint64', name: 'sequenceNumber', type: 'uint64' }
    ],
    name: 'RandomnessRequested',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint64', name: 'sequsenceNumber', type: 'uint64' },
      { indexed: false, internalType: 'bytes32', name: 'randomNumber', type: 'bytes32' }
    ],
    name: 'RandomnessFulfilled',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'minter', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'startTokenId', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'endTokenId', type: 'uint256' }
    ],
    name: 'BoosterDropsMinted',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'tokenId', type: 'uint256' }
    ],
    name: 'BoosterDropTransfer',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'burner', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { indexed: false, internalType: 'uint8', name: 'rarity', type: 'uint8' },
      { indexed: false, internalType: 'uint256', name: 'offerAmount', type: 'uint256' }
    ],
    name: 'BoosterDropSold',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'burner', type: 'address' },
      { indexed: false, internalType: 'uint256[]', name: 'tokenIds', type: 'uint256[]' },
      { indexed: false, internalType: 'uint8[]', name: 'rarities', type: 'uint8[]' },
      { indexed: false, internalType: 'uint256', name: 'finalOfferAmount', type: 'uint256' }
    ],
    name: 'BoosterDropSoldBatch',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: false, internalType: 'uint256[]', name: 'tokenIds', type: 'uint256[]' },
      { indexed: false, internalType: 'uint256', name: 'batchId', type: 'uint256' }
    ],
    name: 'BoosterDropOpened',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'batchId', type: 'uint256' },
      { indexed: false, internalType: 'bytes32', name: 'randomNumber', type: 'bytes32' }
    ],
    name: 'RarityAssigned',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: 'newEntropyAddress', type: 'address' }
    ],
    name: 'EntropyAddressUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: 'newProvider', type: 'address' }
    ],
    name: 'EntropyProviderUpdated',
    type: 'event'
  }
] as const satisfies Abi