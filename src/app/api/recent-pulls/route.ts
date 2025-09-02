import { NextRequest, NextResponse } from 'next/server'

const VIBEMARKET_BASE_URL = 'https://build.wield.xyz/vibe/boosterbox'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const contractAddress = searchParams.get('contractAddress')
  const chainId = searchParams.get('chainId') || '8453'
  const limit = searchParams.get('limit') || '20'
  const rarityGreaterThan = searchParams.get('rarityGreaterThan')
  const includeMetadata = searchParams.get('includeMetadata') || 'true'

  if (!contractAddress) {
    return NextResponse.json(
      { error: 'Contract address is required' },
      { status: 400 }
    )
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // Add API key for server-side requests
    if (process.env.VIBEMARKET_API_KEY) {
      headers['API-KEY'] = process.env.VIBEMARKET_API_KEY
    } else {
      headers['API-KEY'] = 'DEMO_REPLACE_WITH_FREE_API_KEY'
    }

    const queryParams = new URLSearchParams({
      contractAddress,
      chainId,
      limit,
      includeMetadata,
    })

    // Add rarityGreaterThan if provided
    if (rarityGreaterThan) {
      queryParams.append('rarityGreaterThan', rarityGreaterThan)
    }

    const response = await fetch(
      `${VIBEMARKET_BASE_URL}/recent?${queryParams}`,
      {
        headers,
        cache: 'no-store', // Recent data should not be cached
      }
    )

    if (!response.ok) {
      console.warn(`VibeMarket recent pulls API returned ${response.status}`)
      return NextResponse.json(
        { error: `API request failed with status ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Recent pulls API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent pulls data' },
      { status: 500 }
    )
  }
}