import { Abi } from 'viem'

// TypeScript interface for the contract functions
export interface IBoosterCardSeedUtils {
  // Seed utility functions
  getCardSeedData: (seed: `0x${string}`) => Promise<{
    wear: string
    foilType: string
  }>
  getFoilMappingFromSeed: (seed: `0x${string}`) => Promise<string>
  wearFromSeed: (seed: `0x${string}`) => Promise<string>
  
  // Collection deployment functions
  deployBoosterDropCollection: (params: DeploymentParams) => Promise<`0x${string}`>
  initializeCollection: (params: InitializeParams) => Promise<void>
  setRarityMapping: (rarities: RarityData[]) => Promise<void>
}

// Deployment parameters interface
export interface DeploymentParams {
  owner: `0x${string}`
  nftName: string
  nftSymbol: string
  baseURI: string
  referralAddress?: `0x${string}`
}

// Initialize parameters interface  
export interface InitializeParams {
  owner: `0x${string}`
  tokenAddress: `0x${string}`
  tokensPerMint: bigint
  commonOffer: bigint
  rareOffer: bigint
  epicOffer: bigint
  legendaryOffer: bigint
  mythicOffer: bigint
  entropyAddress: `0x${string}`
}

// Rarity data interface
export interface RarityData {
  tokenId: bigint
  rarity: number // 1-5 scale
  randomValue: bigint
}

// Typed ABI for the VibeMarket factory contract
export const vibeMarketAbi = [
  // createDrop function (simple 4-parameter version)
  {
    inputs: [
      {
        internalType: 'string',
        name: 'tokenName',
        type: 'string'
      },
      {
        internalType: 'string',
        name: 'tokenSymbol',
        type: 'string'
      },
      {
        internalType: 'string',
        name: 'nftName',
        type: 'string'
      },
      {
        internalType: 'string',
        name: 'nftSymbol',
        type: 'string'
      }
    ],
    name: 'createDrop',
    outputs: [
      {
        internalType: 'address',
        name: 'tokenContract',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'dropContract',
        type: 'address'
      }
    ],
    stateMutability: 'payable',
    type: 'function'
  },
  // DropCreated event to decode transaction logs
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'creator',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'dropContract',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'tokenContract',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'nftName',
        type: 'string'
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'nftSymbol',
        type: 'string'
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'tokenName',
        type: 'string'
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'tokenSymbol',
        type: 'string'
      }
    ],
    name: 'DropCreated',
    type: 'event'
  },
  // Seed utility functions
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'seed',
        type: 'bytes32'
      }
    ],
    name: 'getCardSeedData',
    outputs: [
      {
        internalType: 'string',
        name: 'wear',
        type: 'string'
      },
      {
        internalType: 'string',
        name: 'foilType',
        type: 'string'
      }
    ],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'seed',
        type: 'bytes32'
      }
    ],
    name: 'getFoilMappingFromSeed',
    outputs: [
      {
        internalType: 'string',
        name: 'foilType',
        type: 'string'
      }
    ],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'seed',
        type: 'bytes32'
      }
    ],
    name: 'wearFromSeed',
    outputs: [
      {
        internalType: 'string',
        name: 'wear',
        type: 'string'
      }
    ],
    stateMutability: 'pure',
    type: 'function'
  }
] as const satisfies Abi