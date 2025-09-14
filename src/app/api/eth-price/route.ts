import { NextResponse } from 'next/server'

// Cache interface
interface EthPriceCache {
  price: number
  priceFormatted: string
  lastUpdated: string
  timestamp: number
}

// In-memory cache (5 minute expiry)
let priceCache: EthPriceCache | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

export async function GET() {
  try {
    // Check if we have valid cached data
    if (priceCache && Date.now() - priceCache.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        price: priceCache.price,
        priceFormatted: priceCache.priceFormatted,
        lastUpdated: priceCache.lastUpdated,
        cached: true
      })
    }

    // Fetch fresh data from Wield API
    const response = await fetch('https://build.wield.xyz/vibe/boosterbox/eth-price', {
      method: 'GET',
      headers: {
        'API-KEY': process.env.VIBEMARKET_API_KEY || 'DEMO_REPLACE_WITH_FREE_API_KEY'
      },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000) // 10 second timeout
    })

    if (!response.ok) {
      throw new Error('API error')
    }

    const data = await response.json()

    // Validate response structure
    if (!data.success || typeof data.price !== 'number') {
      throw new Error('Invalid response')
    }

    // Update cache
    priceCache = {
      price: data.price,
      priceFormatted: data.priceFormatted,
      lastUpdated: data.lastUpdated,
      timestamp: Date.now()
    }

    return NextResponse.json({
      success: true,
      price: data.price,
      priceFormatted: data.priceFormatted,
      lastUpdated: data.lastUpdated,
      cached: false
    })

  } catch (error) {
    console.error('ETH Price API Error:', error)

    // Return cached data if available, even if expired
    if (priceCache) {
      return NextResponse.json({
        success: true,
        price: priceCache.price,
        priceFormatted: priceCache.priceFormatted,
        lastUpdated: priceCache.lastUpdated,
        cached: true,
        stale: true
      })
    }

    // Fallback error response
    return NextResponse.json(
      {
        success: false,
        error: 'ETH price unavailable'
      },
      { status: 500 }
    )
  }
}