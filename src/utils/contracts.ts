/**
 * Contract Configuration (Hybrid Approach)
 * - Contract addresses from environment variables
 * - Static constants and utilities centralized here
 */

// Contract addresses from environment
export const CONTRACTS = {
  GEO_ART: process.env.NEXT_PUBLIC_GEO_ART_DROP_ADDRESS as `0x${string}`,
} as const

// Network configuration
export const NETWORK = {
  CHAIN_ID: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '8453'),
  BASE: 8453,
} as const

// Rarity constants (from IBoosterDropV2 interface)
export const RARITY_LEVELS = {
  COMMON: 1,
  RARE: 2,
  EPIC: 3,
  LEGENDARY: 4,
  MYTHIC: 5,
} as const

export const RARITY_NAMES = {
  1: 'Common',
  2: 'Rare',
  3: 'Epic',
  4: 'Legendary',
  5: 'Mythic',
} as const

// Helper functions
export const getRarityName = (rarity: number): string => {
  return RARITY_NAMES[rarity as keyof typeof RARITY_NAMES] || 'Unknown'
}

export const getRarityColor = (rarity: number): string => {
  switch (rarity) {
    case 1: return 'text-slate-600'    // Common - gray
    case 2: return 'text-blue-600'     // Rare - blue
    case 3: return 'text-purple-600'   // Epic - purple
    case 4: return 'text-yellow-600'   // Legendary - gold
    case 5: return 'text-red-600'      // Mythic - red
    default: return 'text-slate-400'   // Unknown
  }
}

export const getRarityBgColor = (rarity: number): string => {
  switch (rarity) {
    case 1: return 'bg-slate-50 border-slate-200'
    case 2: return 'bg-blue-50 border-blue-200'
    case 3: return 'bg-purple-50 border-purple-200'
    case 4: return 'bg-yellow-50 border-yellow-200'
    case 5: return 'bg-red-50 border-red-200'
    default: return 'bg-slate-50 border-slate-200'
  }
}

// Validation
if (!CONTRACTS.GEO_ART) {
  throw new Error('NEXT_PUBLIC_GEO_ART_DROP_ADDRESS is required')
}

// Type exports
export type RarityLevel = typeof RARITY_LEVELS[keyof typeof RARITY_LEVELS]
export type ContractAddress = typeof CONTRACTS[keyof typeof CONTRACTS]