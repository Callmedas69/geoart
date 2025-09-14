import { Abi } from 'viem'

// VibeMarket Proxy Contract ABI for createDropWithConfig function only
export const vibeMarketProxyAbi = [
  {
    inputs: [
      { internalType: 'string', name: 'tokenName', type: 'string' },
      { internalType: 'string', name: 'tokenSymbol', type: 'string' },
      { internalType: 'string', name: 'nftName', type: 'string' },
      { internalType: 'string', name: 'nftSymbol', type: 'string' },
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'uint256', name: 'packAmount', type: 'uint256' },
      { 
        internalType: 'tuple', 
        name: 'config', 
        type: 'tuple',
        components: [
          { internalType: 'string', name: 'baseURI', type: 'string' },
          { internalType: 'uint256', name: 'tokensPerMint', type: 'uint256' },
          { internalType: 'uint256', name: 'commonOffer', type: 'uint256' },
          { internalType: 'uint256', name: 'rareOffer', type: 'uint256' },
          { internalType: 'uint256', name: 'epicOffer', type: 'uint256' },
          { internalType: 'uint256', name: 'legendaryOffer', type: 'uint256' },
          { internalType: 'uint256', name: 'mythicOffer', type: 'uint256' }
        ]
      }
    ],
    name: 'createDropWithConfig',
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

// VibeMarket Proxy Contract Address on Base (from environment variable)
export const VIBEMARKET_PROXY_ADDRESS = process.env.NEXT_PUBLIC_VIBEMARKET_PROXY_CONTRACT as `0x${string}` || '0x89078aba782d14277325484960d576f6f38b4ea8' as const