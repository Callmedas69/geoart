import { NextRequest, NextResponse } from 'next/server'

const VIBEMARKET_BASE_URL = 'https://build.wield.xyz/vibe/boosterbox'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const contractAddress = searchParams.get('contractAddress')
  const slug = searchParams.get('slug')
  const chainId = searchParams.get('chainId') || '8453'

  // Accept either contractAddress or slug
  const contractAddressOrSlug = contractAddress || slug

  if (!contractAddressOrSlug) {
    return NextResponse.json(
      { error: 'Either contract address or slug is required' },
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
      chainId,
    })

    const response = await fetch(
      `${VIBEMARKET_BASE_URL}/contractAddress/${contractAddressOrSlug}?${queryParams}`,
      {
        headers,
        cache: 'force-cache',
      }
    )

    if (!response.ok) {
      console.warn(`VibeMarket API returned ${response.status}`)
      return NextResponse.json(
        { error: `API request failed with status ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Contract info API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contract info' },
      { status: 500 }
    )
  }
}
