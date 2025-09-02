/**
 * VibeMarket API Integration
 * Helper functions for fetching NFT metadata and collection data
 */

const VIBEMARKET_BASE_URL = 'https://build.wield.xyz/vibe/boosterbox'

// Simple in-memory cache to reduce API calls
const apiCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

function getCachedData(key: string) {
  const cached = apiCache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  return null
}

function setCachedData(key: string, data: any) {
  apiCache.set(key, { data, timestamp: Date.now() })
}

interface VibeMarketNFT {
  id: string
  name: string
  description: string
  image: string
  rarity?: number
  status?: string
  rarityName?: string
  tokenId?: string
  attributes: Array<{
    trait_type: string
    value: string | number
  }>
  metadata?: {
    foil?: string
    wear?: string
    rarityName?: string
    imageUrl?: string
    unopenedImageUrl?: string
    [key: string]: any
  }
}

interface ContractInfo {
  contractAddress: string
  name: string
  symbol: string
  description?: string
  image?: string
  totalSupply?: number
  maxSupply?: number
  mintPrice?: string
  creator?: string
  chainId?: number
  verified?: boolean
  createdAt?: string
  // VibeMarket specific fields
  tokenContract?: string
  marketCap?: string
  isGraduated?: boolean
  isActive?: boolean
  // Status text from contract
  verificationStatus?: string
  graduationStatus?: string
  status?: string
}

// VibeMarket API response interface (actual structure)
interface VibeMarketContractResponse {
  success: boolean
  contractInfo: {
    gameId: string
    tokenAddress: string
    tokenName: string
    tokenSymbol: string
    nftName: string
    nftSymbol: string
    description: string
    imageUrl: string
    isGraduated: boolean
    marketCap: string
    marketCapUsd: string
    pricePerPack: string
    pricePerPackUsd: string
    dropContractAddress: string
    ownerAddress: string
    isVerified: boolean
    isActive: boolean
    chainId: number
    bgColor?: string
    // Status text fields
    verificationStatus?: string
    graduationStatus?: string
    status?: string
    links?: {
      twitter?: string
      website?: string
    }
  }
}

interface VibeMarketResponse {
  success: boolean
  data: any
  message?: string
}

interface PaginationOptions {
  page?: number
  limit?: number
  offset?: number
}

interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

/**
 * Fetch NFT metadata from VibeMarket API
 */
export async function fetchNFTMetadata(contractAddress: string, tokenId: string): Promise<VibeMarketNFT | null> {
  const cacheKey = `nft-${contractAddress}-${tokenId}`
  
  // Check cache first
  const cachedData = getCachedData(cacheKey)
  if (cachedData) {
    return cachedData
  }
  
  try {
    const response = await fetch(`${VIBEMARKET_BASE_URL}/contractAddress/${contractAddress}/tokenId/${tokenId}`)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const data = await response.json()
    
    // Cache successful response
    setCachedData(cacheKey, data)
    return data
  } catch (error) {
    console.error('Failed to fetch NFT metadata:', error)
    return null
  }
}

/**
 * Fetch contract info from VibeMarket API via our Next.js API route
 */
export async function fetchContractInfo(contractAddress: string): Promise<ContractInfo | null> {
  const cacheKey = `contract-info-${contractAddress}`
  
  // Check cache first
  const cachedData = getCachedData(cacheKey)
  if (cachedData) {
    console.log('Using cached contract info')
    return cachedData
  }
  
  try {
    // Use our Next.js API route to avoid CORS issues
    const queryParams = new URLSearchParams({
      contractAddress,
      chainId: '8453',
    })
    
    const response = await fetch(`/api/contract-info?${queryParams}`, {
      cache: 'force-cache',
    })
    
    if (!response.ok) {
      if (response.status === 429) {
        console.warn('VibeMarket API rate limit reached for contract info.')
        return getFallbackContractInfo()
      }
      console.warn(`Contract info API returned ${response.status}.`)
      return getFallbackContractInfo()
    }
    
    const response_data: VibeMarketContractResponse = await response.json()
    
    // Parse the actual contract info from VibeMarket response
    if (!response_data.success || !response_data.contractInfo) {
      console.warn('Invalid VibeMarket response structure, using fallback')
      return getFallbackContractInfo()
    }
    
    const data = response_data.contractInfo
    const contractInfo: ContractInfo = {
      contractAddress: data.dropContractAddress,
      name: data.nftName,
      symbol: data.nftSymbol,
      description: data.description,
      image: data.imageUrl,
      totalSupply: undefined, // Not provided in BoosterBox format
      maxSupply: undefined, // Not provided in BoosterBox format
      mintPrice: data.pricePerPackUsd,
      creator: data.ownerAddress,
      chainId: data.chainId,
      verified: data.isVerified,
      createdAt: undefined,
      // Additional VibeMarket specific fields
      tokenContract: data.tokenAddress,
      marketCap: data.marketCapUsd,
      isGraduated: data.isGraduated,
      isActive: data.isActive,
      // Status text from contract (get actual text, not hardcoded)
      verificationStatus: data.verificationStatus || (data.isVerified ? "Verified" : "Unverified"),
      graduationStatus: data.graduationStatus || (data.isGraduated ? "Graduated" : "Pre-launch"),
      status: data.status
    }
    
    setCachedData(cacheKey, contractInfo)
    return contractInfo
    
  } catch (error) {
    console.error('Failed to fetch contract info:', error)
    return getFallbackContractInfo()
  }
}

/**
 * Fetch collection NFTs from VibeMarket API with pagination support via our Next.js API route
 */
export async function fetchCollectionData(
  contractAddress: string, 
  paginationOptions: PaginationOptions = {}
): Promise<PaginatedResponse<VibeMarketNFT>> {
  const { page = 1, limit = 20, offset } = paginationOptions
  const cacheKey = `collection-data-${contractAddress}-page-${page}-limit-${limit}`
  
  // Check cache first
  const cachedData = getCachedData(cacheKey)
  if (cachedData) {
    console.log('Using cached collection data')
    return cachedData
  }
  
  try {
    // Use our Next.js API route to avoid CORS issues
    const queryParams = new URLSearchParams({
      contractAddress,
      chainId: '8453',
      page: page.toString(),
      limit: limit.toString(),
    })
    
    if (offset !== undefined) {
      queryParams.set('offset', offset.toString())
    }
    
    const response = await fetch(`/api/collection-data?${queryParams}`, {
      cache: 'force-cache',
    })
    
    if (!response.ok) {
      if (response.status === 429) {
        console.warn('VibeMarket API rate limit reached. Using fallback data.')
        const fallbackData = getFallbackCollectionDataPaginated(page, limit)
        setCachedData(cacheKey, fallbackData)
        return fallbackData
      }
      console.warn(`Collection API returned ${response.status}. Using fallback data.`)
      const fallbackData = getFallbackCollectionDataPaginated(page, limit)
      setCachedData(cacheKey, fallbackData)
      return fallbackData
    }
    
    const collectionData = await response.json()
    console.log('Collection data received:', collectionData)
    
    // For now, return fallback data but log the collection data
    // TODO: Process actual API response when VibeMarket provides proper pagination
    const fallbackData = getFallbackCollectionDataPaginated(page, limit)
    setCachedData(cacheKey, fallbackData)
    return fallbackData
    
  } catch (error) {
    console.error('Failed to fetch collection data:', error)
    const fallbackData = getFallbackCollectionDataPaginated(page, limit)
    setCachedData(cacheKey, fallbackData)
    return fallbackData
  }
}

/**
 * Fetch recent EPIC+ pulls from VibeMarket API
 * Contract-driven approach with fallback data
 */
export async function fetchRecentEpicPulls(
  contractAddress: string,
  options: {
    rarityGreaterThan: number;
    limit: number;
  }
): Promise<VibeMarketNFT[]> {
  const cacheKey = `recent-epic-pulls-${contractAddress}-${options.rarityGreaterThan}-${options.limit}`
  
  // Check cache first
  const cachedData = getCachedData(cacheKey)
  if (cachedData) {
    return cachedData
  }
  
  try {
    // Use Next.js API route to avoid CORS issues
    const queryParams = new URLSearchParams({
      contractAddress,
      rarityGreaterThan: options.rarityGreaterThan.toString(),
      limit: options.limit.toString(),
    })
    
    const response = await fetch(`/api/recent-pulls?${queryParams}`, {
      cache: 'no-store', // Always fetch fresh data for FOMO effect
    })
    
    if (!response.ok) {
      console.warn(`Recent pulls API returned ${response.status}. Using fallback data.`)
      const fallbackData = getFallbackRecentPulls(options.rarityGreaterThan)
      setCachedData(cacheKey, fallbackData)
      return fallbackData
    }
    
    const data = await response.json()
    
    // Process actual API response
    if (data.success && data.boxes && Array.isArray(data.boxes)) {
      const processedNfts: VibeMarketNFT[] = data.boxes.map((box: any) => {
        // Handle rarity display - convert 0 to 1 for display purposes
        const displayRarity = box.rarity === 0 ? 1 : box.rarity
        const rarityName = box.rarityName === 'NOT_ASSIGNED' ? 'Common' : (box.rarityName || 'Common')
        
        return {
          id: box.tokenId?.toString() || box._id,
          name: box.metadata?.name || `GEO #${box.tokenId}`,
          description: box.metadata?.description || '',
          image: box.metadata?.imageUrl || box.metadata?.originalImageUrl || '/images/geoart/placeholder.png',
          rarity: displayRarity,
          attributes: [
            { trait_type: 'Rarity', value: rarityName },
            { trait_type: 'Status', value: box.status || 'minted' },
            { trait_type: 'Token ID', value: box.tokenId }
          ],
          metadata: {
            foil: box.metadata?.foil || '-',
            wear: box.metadata?.wear || '-',
            ...box.metadata
          }
        }
      })
      
      setCachedData(cacheKey, processedNfts)
      return processedNfts
    }
    
    // Fallback if API response is invalid
    const fallbackData = getFallbackRecentPulls(options.rarityGreaterThan)
    setCachedData(cacheKey, fallbackData)
    return fallbackData
    
  } catch (error) {
    console.error('Failed to fetch recent EPIC+ pulls:', error)
    const fallbackData = getFallbackRecentPulls(options.rarityGreaterThan)
    setCachedData(cacheKey, fallbackData)
    return fallbackData
  }
}

/**
 * Fetch user's owned NFTs from VibeMarket API with pagination support
 * FIXED: Now properly handles revealed vs unrevealed NFTs
 * - Preserves original rarity (0 for unrevealed, 1-5 for revealed)
 * - Adds status field for NFTCard component logic
 * - Proper image selection based on NFT status
 */
export async function fetchUserNFTs(
  walletAddress: string, 
  contractAddress: string,
  paginationOptions: PaginationOptions = {}
): Promise<VibeMarketNFT[]> {
  const { page = 1, limit = 20, offset } = paginationOptions
  try {
    // Use our Next.js API route to avoid CORS issues and handle API key server-side
    const queryParams = new URLSearchParams({
      walletAddress: walletAddress,
      contractAddress: contractAddress,
      chainId: '8453',
      page: page.toString(),
      limit: limit.toString(),
      includeMetadata: 'true',
      includeContractDetails: 'false',
    })
    
    if (offset !== undefined) {
      queryParams.set('offset', offset.toString())
    }
    
    const response = await fetch(`/api/user-nfts?${queryParams}`, {
      cache: 'no-store', // Fresh data for user's NFTs
    })
    
    if (!response.ok) {
      if (response.status === 429) {
        console.warn('VibeMarket API rate limit reached.')
        return []
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    // Handle VibeMarket API response structure
    if (!data.success) {
      console.warn('VibeMarket API returned unsuccessful response:', data.message)
      return []
    }
    
    // Process boxes array from VibeMarket response
    const boxes = data.boxes || []
    if (!Array.isArray(boxes)) {
      console.warn('VibeMarket API response does not contain boxes array')
      return []
    }
    
    // Transform VibeMarket box format to our NFT format
    const transformedNFTs: VibeMarketNFT[] = boxes.map((box: any) => {
      // PRESERVE original rarity (0 for unrevealed, 1-5 for revealed) - DO NOT convert
      const originalRarity = box.rarity
      
      // Determine correct image based on status (revealed vs unrevealed)
      const imageUrl = box.status === 'minted' 
        ? '/foil/GeoFoil.png'  // Unrevealed - show pack image
        : box.metadata?.imageUrl || box.metadata?.originalImageUrl || '/images/geoart/placeholder.png'  // Revealed - show actual NFT image
      
      return {
        id: box.tokenId?.toString() || box._id,
        name: box.metadata?.name || `GEO ART #${box.tokenId}`,
        description: box.metadata?.description || '',
        image: imageUrl,
        rarity: originalRarity,  // CRITICAL: Keep original 0 for unrevealed, 1-5 for revealed
        status: box.status,      // CRITICAL: Add status field for NFTCard logic
        rarityName: box.rarityName,  // Preserve API data
        tokenId: box.tokenId?.toString(),  // Add tokenId for Phase 2 transactions
        attributes: [
          { trait_type: 'Rarity', value: box.rarityName || 'Unknown' },
          { trait_type: 'Status', value: box.status || 'minted' },
          { trait_type: 'Token ID', value: box.tokenId },
          ...(box.metadata?.attributes || [])
        ],
        metadata: {
          foil: box.metadata?.foil || '-',
          wear: box.metadata?.wear || '-',
          rarityName: box.rarityName,
          imageUrl: box.metadata?.imageUrl,
          unopenedImageUrl: box.metadata?.unopenedImageUrl,
          ...box.metadata
        }
      }
    })
    
    return transformedNFTs
  } catch (error) {
    console.error('Failed to fetch user NFTs:', error)
    return []
  }
}

/**
 * Fallback contract info for when API is unavailable
 */
function getFallbackContractInfo(): ContractInfo {
  console.warn('Using FALLBACK contract info - API failed')
  
  // Import CONTRACTS here to avoid circular dependency
  const CONTRACTS_LOCAL = {
    GEO_ART: process.env.NEXT_PUBLIC_GEO_ART_DROP_ADDRESS as `0x${string}`,
  }
  
  return {
    contractAddress: CONTRACTS_LOCAL.GEO_ART || '0x1234567890123456789012345678901234567890',
    name: 'GEO ART Collection',
    symbol: 'GEOART',
    description: 'A unique collection of geometric art NFTs featuring rare, epic, and legendary designs with mathematical precision and artistic beauty.',
    image: '/images/geoart/Legendary.png',
    totalSupply: 16,
    maxSupply: 10000,
    mintPrice: '$0.96',
    creator: '0xdc41d6da6bb2d02b19316b2bfff0cbb42606484d',
    chainId: 8453,
    verified: false, // Should match real API data
    createdAt: '2024-01-01T00:00:00Z',
    // VibeMarket specific fields - match real API values
    tokenContract: '0x181b9ac77d9fe5b198f9048695022eb5b91347f1',
    marketCap: '$2,896.93',
    isGraduated: false, // Should match real API data
    isActive: true
  }
}

/**
 * Fallback collection data using real GEO ART images (paginated)
 */
function getFallbackCollectionDataPaginated(page: number = 1, limit: number = 20): PaginatedResponse<VibeMarketNFT> {
  const allNfts = getAllFallbackNFTs()
  
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedNfts = allNfts.slice(startIndex, endIndex)
  
  return {
    data: paginatedNfts,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(allNfts.length / limit),
      totalItems: allNfts.length,
      itemsPerPage: limit,
      hasNextPage: endIndex < allNfts.length,
      hasPreviousPage: page > 1
    }
  }
}

/**
 * Fallback collection data using real GEO ART images (legacy - for backward compatibility)
 */
function getFallbackCollectionData() {
  return {
    nfts: getAllFallbackNFTs()
  }
}

/**
 * Fallback recent EPIC+ pulls for FOMO marketing
 */
function getFallbackRecentPulls(rarityGreaterThan: number): VibeMarketNFT[] {
  const allNfts = getAllFallbackNFTs()
  
  // Filter for EPIC+ (rarity > rarityGreaterThan) and add foil variants
  const epicPlusNfts = allNfts
    .filter(nft => nft.rarity && nft.rarity > rarityGreaterThan)
    .map(nft => ({
      ...nft,
      // Simple fallback metadata
      metadata: {
        foil: "-",
        wear: "-"
      }
    }))
  
  // Shuffle for "recent" effect and take limited results
  return epicPlusNfts.sort(() => Math.random() - 0.5).slice(0, 12)
}

/**
 * Fetch ETH price from Wield API
 */
export async function fetchETHPrice(): Promise<number> {
  const cacheKey = 'eth-price'
  
  // Check cache first
  const cachedData = getCachedData(cacheKey)
  if (cachedData) {
    return cachedData
  }
  
  try {
    const response = await fetch('https://build.wield.xyz/vibe/boosterbox/eth-price', {
      headers: {
        'API-KEY': process.env.VIBEMARKET_API_KEY || 'DEMO_REPLACE_WITH_FREE_API_KEY'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.success && data.price) {
      setCachedData(cacheKey, data.price)
      return data.price
    }
    
    throw new Error('Invalid response format')
  } catch (error) {
    console.error('Failed to fetch ETH price:', error)
    return 0
  }
}

/**
 * Get all fallback NFT data
 */
function getAllFallbackNFTs(): VibeMarketNFT[] {
  const nfts = [
    // Common NFTs
    { id: '44', name: 'GEO ART #44', image: '/images/geoart/geometric_common_44.png', rarity: 1 },
    { id: '45', name: 'GEO ART #45', image: '/images/geoart/geometric_common_45.png', rarity: 1 },
    { id: '46', name: 'GEO ART #46', image: '/images/geoart/geometric_common_46.png', rarity: 1 },
    { id: '47', name: 'GEO ART #47', image: '/images/geoart/geometric_common_47.png', rarity: 1 },
    { id: '48', name: 'GEO ART #48', image: '/images/geoart/geometric_common_48.png', rarity: 1 },
    
    // Rare NFTs
    { id: '1', name: 'GEO ART #1', image: '/images/geoart/geometric_rare_1.png', rarity: 2 },
    { id: '2', name: 'GEO ART #2', image: '/images/geoart/geometric_rare_2.png', rarity: 2 },
    { id: '10', name: 'GEO ART #10', image: '/images/geoart/geometric_rare_10.png', rarity: 2 },
    { id: '15', name: 'GEO ART #15', image: '/images/geoart/geometric_rare_15.png', rarity: 2 },
    { id: '20', name: 'GEO ART #20', image: '/images/geoart/geometric_rare_20.png', rarity: 2 },
    
    // Epic NFTs
    { id: '101', name: 'GEO ART #101', image: '/images/geoart/geometric_epic_1.png', rarity: 3 },
    { id: '103', name: 'GEO ART #103', image: '/images/geoart/geometric_epic_3.png', rarity: 3 },
    { id: '105', name: 'GEO ART #105', image: '/images/geoart/geometric_epic_5.png', rarity: 3 },
    
    // Legendary NFTs
    { id: '1001', name: 'GEO ART #1001', image: '/images/geoart/Legendary.png', rarity: 4 },
    { id: '1002', name: 'GEO ART #1002', image: '/images/geoart/Legendary (2).png', rarity: 4 },
    { id: '1005', name: 'GEO ART #1005', image: '/images/geoart/Legendary (5).png', rarity: 4 },
  ]

  return nfts.map(nft => ({
    ...nft,
    description: nft.name,
    attributes: [
      { trait_type: 'Rarity', value: ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic'][nft.rarity - 1] },
      { trait_type: 'Collection', value: 'GEO ART' },
      { trait_type: 'Type', value: 'Geometric' }
    ]
  }))
}