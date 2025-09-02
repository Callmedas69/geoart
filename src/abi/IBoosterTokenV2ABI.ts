import { Abi } from 'viem'

// Market type enum
export enum MarketType {
  BONDING_CURVE = 0,
  UNISWAP_POOL = 1
}

// Typed ABI for the IBoosterTokenV2 contract
export const boosterTokenV2Abi = [
  // Initialize function
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'string', name: 'symbol', type: 'string' },
      { internalType: 'address', name: 'dropAddress', type: 'address' },
      { internalType: 'address', name: 'factoryAddress', type: 'address' },
      { internalType: 'address', name: 'uniswapV3Factory', type: 'address' },
      { internalType: 'address', name: 'uniswapV3PositionManager', type: 'address' },
      { internalType: 'address', name: 'uniswapV3SwapRouter', type: 'address' },
      { internalType: 'address', name: 'wethAddress', type: 'address' },
      { internalType: 'address', name: 'bondingCurveAddress', type: 'address' },
      { internalType: 'address', name: 'protocolFeeRecipient', type: 'address' }
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  // Market type
  {
    inputs: [],
    name: 'marketType',
    outputs: [
      { internalType: 'enum MarketType', name: '', type: 'uint8' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  // Buy function (basic)
  {
    inputs: [
      { internalType: 'uint256', name: 'tokenAmount', type: 'uint256' },
      { internalType: 'address', name: 'recipient', type: 'address' }
    ],
    name: 'buy',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  // Buy function (with referrers)
  {
    inputs: [
      { internalType: 'uint256', name: 'tokenAmount', type: 'uint256' },
      { internalType: 'address', name: 'recipient', type: 'address' },
      { internalType: 'address', name: 'referrer', type: 'address' },
      { internalType: 'address', name: 'originReferrer', type: 'address' }
    ],
    name: 'buy',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  // Sell function (with referrers)
  {
    inputs: [
      { internalType: 'uint256', name: 'tokensToSell', type: 'uint256' },
      { internalType: 'address', name: 'recipient', type: 'address' },
      { internalType: 'uint256', name: 'minPayoutSize', type: 'uint256' },
      { internalType: 'address', name: 'referrer', type: 'address' },
      { internalType: 'address', name: 'originReferrer', type: 'address' }
    ],
    name: 'sell',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  // Sell function (basic)
  {
    inputs: [
      { internalType: 'uint256', name: 'tokensToSell', type: 'uint256' },
      { internalType: 'address', name: 'recipient', type: 'address' },
      { internalType: 'uint256', name: 'minPayoutSize', type: 'uint256' }
    ],
    name: 'sell',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  // Sell tokens
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'sellTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  // Mint offer
  {
    inputs: [
      { internalType: 'address', name: 'recipient', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'mintOffer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  // Quote functions
  {
    inputs: [
      { internalType: 'uint256', name: 'ethAmount', type: 'uint256' }
    ],
    name: 'getEthBuyQuote',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'tokenAmount', type: 'uint256' }
    ],
    name: 'getTokenBuyQuote',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'tokenAmount', type: 'uint256' }
    ],
    name: 'getTokenSellQuote',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  // Contract addresses
  {
    inputs: [],
    name: 'bondingCurve',
    outputs: [
      { internalType: 'address', name: '', type: 'address' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'poolAddress',
    outputs: [
      { internalType: 'address', name: '', type: 'address' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'recipient', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'OfferMinted',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'pool', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'ethAmount', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'tokenAmount', type: 'uint256' }
    ],
    name: 'LiquiditySetup',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'positionId', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'amount0', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'amount1', type: 'uint256' }
    ],
    name: 'PositionFeesCollected',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'buyer', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'ethPaid', type: 'uint256' }
    ],
    name: 'TokensPurchased',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'seller', type: 'address' },
      { indexed: true, internalType: 'address', name: 'recipient', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'ethReceived', type: 'uint256' }
    ],
    name: 'TokensSold',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: 'positionManager', type: 'address' },
      { indexed: false, internalType: 'address', name: 'swapRouter', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'positionId', type: 'uint256' }
    ],
    name: 'UniswapPositionConfigured',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'TokensSold',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'nftAddress', type: 'address' },
      { indexed: true, internalType: 'address', name: 'tokenAddress', type: 'address' },
      { indexed: true, internalType: 'address', name: 'pool', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'ethAmount', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'tokenAmount', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'positionId', type: 'uint256' }
    ],
    name: 'MarketGraduated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'ownerFee', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'protocolFee', type: 'uint256' },
      { indexed: false, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: false, internalType: 'address', name: 'protocolFeeRecipient', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'referrerFee', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'originReferrerFee', type: 'uint256' },
      { indexed: false, internalType: 'address', name: 'referrer', type: 'address' },
      { indexed: false, internalType: 'address', name: 'originReferrer', type: 'address' }
    ],
    name: 'BoosterTokenFeesDispersed',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'balanceOfFrom', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'balanceOfTo', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'totalSupply', type: 'uint256' }
    ],
    name: 'BoosterTokenTransfer',
    type: 'event'
  }
] as const satisfies Abi