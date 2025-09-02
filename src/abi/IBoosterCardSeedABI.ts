import { Abi } from 'viem'

// Typed ABI for the IBoosterCardSeedUtils contract
export const boosterCardSeedUtilsAbi = [
  // Wear from seed
  {
    inputs: [
      { internalType: 'bytes32', name: 'seed', type: 'bytes32' }
    ],
    name: 'wearFromSeed',
    outputs: [
      { internalType: 'string', name: 'wear', type: 'string' }
    ],
    stateMutability: 'pure',
    type: 'function'
  },
  // Get foil mapping from seed
  {
    inputs: [
      { internalType: 'bytes32', name: 'seed', type: 'bytes32' }
    ],
    name: 'getFoilMappingFromSeed',
    outputs: [
      { internalType: 'string', name: 'foilType', type: 'string' }
    ],
    stateMutability: 'pure',
    type: 'function'
  },
  // Get card seed data
  {
    inputs: [
      { internalType: 'bytes32', name: 'seed', type: 'bytes32' }
    ],
    name: 'getCardSeedData',
    outputs: [
      { internalType: 'string', name: 'wear', type: 'string' },
      { internalType: 'string', name: 'foilType', type: 'string' }
    ],
    stateMutability: 'pure',
    type: 'function'
  }
] as const satisfies Abi