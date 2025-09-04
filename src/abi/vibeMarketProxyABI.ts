import { Abi } from 'viem'

// VibeMarket Proxy Contract ABI for createDrop function and events
export const vibeMarketProxyAbi = [
  {
    inputs: [
      { internalType: 'string', name: 'tokenName', type: 'string' },
      { internalType: 'string', name: 'tokenSymbol', type: 'string' },
      { internalType: 'string', name: 'nftName', type: 'string' },
      { internalType: 'string', name: 'nftSymbol', type: 'string' }
    ],
    name: 'createDrop',
    outputs: [
      { internalType: 'address', name: 'tokenContract', type: 'address' },
      { internalType: 'address', name: 'dropContract', type: 'address' }
    ],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'creator', type: 'address' },
      { indexed: true, internalType: 'address', name: 'dropContract', type: 'address' },
      { indexed: true, internalType: 'address', name: 'tokenContract', type: 'address' },
      { indexed: false, internalType: 'string', name: 'nftName', type: 'string' },
      { indexed: false, internalType: 'string', name: 'nftSymbol', type: 'string' },
      { indexed: false, internalType: 'string', name: 'tokenName', type: 'string' },
      { indexed: false, internalType: 'string', name: 'tokenSymbol', type: 'string' }
    ],
    name: 'DropCreated',
    type: 'event'
  }
] as const satisfies Abi

// VibeMarket Proxy Contract Address on Base
export const VIBEMARKET_PROXY_ADDRESS = '0xa2b463aec4f721fa7c2af400ddde2fe8dff270a1' as const