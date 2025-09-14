/**
 * Vibe Market Configuration Constants
 * Centralized configuration for deployment parameters
 */

export const VIBE_CONFIG = {
  // Token amounts in Wei (as BigInt) - Based on WORKING_SIMULATION.md
  TOKENS_PER_MINT: BigInt("100000000000000000000000"), // 100K tokens
  
  // Rarity offer amounts in Wei (as BigInt) - From successful vibe.market transaction
  RARITY_OFFERS: {
    COMMON: BigInt("10000000000000000000000"),     // 10K tokens
    RARE: BigInt("115000000000000000000000"),      // 115K tokens
    EPIC: BigInt("400000000000000000000000"),      // 400K tokens
    LEGENDARY: BigInt("4000000000000000000000000"), // 4M tokens
    MYTHIC: BigInt("20000000000000000000000000"),   // 20M tokens
  },
  
  // Contract Configuration
  CONTRACT: {
    GAS_LIMIT: BigInt(3000000), // 3M gas limit
    BASE_URI_TEMPLATE: 'https://build.wield.xyz/vibe/boosterbox/metadata/{slug}/',
  },
  
  // Validation Rules
  VALIDATION: {
    MIN_DRAFT_ID_LENGTH: 10,
    MIN_METADATA_ITEMS: 1,
  }
} as const;

/**
 * Generate contract configuration with slug
 * Updated to match working ABI signature (removed mintFeeETH and initialLiquidityETH)
 */
export function generateContractConfig(slug: string) {
  return {
    baseURI: VIBE_CONFIG.CONTRACT.BASE_URI_TEMPLATE.replace('{slug}', slug),
    tokensPerMint: VIBE_CONFIG.TOKENS_PER_MINT,
    commonOffer: VIBE_CONFIG.RARITY_OFFERS.COMMON,
    rareOffer: VIBE_CONFIG.RARITY_OFFERS.RARE,
    epicOffer: VIBE_CONFIG.RARITY_OFFERS.EPIC,
    legendaryOffer: VIBE_CONFIG.RARITY_OFFERS.LEGENDARY,
    mythicOffer: VIBE_CONFIG.RARITY_OFFERS.MYTHIC,
  };
}

/**
 * Contract configuration type
 */
export type ContractConfig = ReturnType<typeof generateContractConfig>;