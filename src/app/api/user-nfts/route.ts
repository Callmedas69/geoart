import { NextRequest, NextResponse } from 'next/server'

const VIBEMARKET_BASE_URL = 'https://build.wield.xyz/vibe/boosterbox'

// FIXED: Now fetches ALL user NFTs (revealed + unrevealed)
// Previous bug: Was hardcoded to only fetch status='minted' (unrevealed only)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const walletAddress = searchParams.get('walletAddress')
  const contractAddress = searchParams.get('contractAddress')
  const chainId = searchParams.get('chainId') || '8453'
  const page = searchParams.get('page') || '1'
  const limit = searchParams.get('limit') || '20'
  const includeMetadata = searchParams.get('includeMetadata') || 'true'
  const includeContractDetails = searchParams.get('includeContractDetails') || 'false'

  if (!walletAddress || !contractAddress) {
    return NextResponse.json(
      { success: false, message: 'walletAddress and contractAddress are required' },
      { status: 400 }
    )
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'API-KEY': process.env.VIBEMARKET_API_KEY || 'DEMO_REPLACE_WITH_FREE_API_KEY',
    }

    const queryParams = new URLSearchParams({
      contractAddress,
      chainId,
      page,
      limit,
      includeMetadata,
      includeContractDetails,
      // REMOVED: status filter - now fetches ALL NFTs (revealed + unrevealed)
    })

    const apiUrl = `${VIBEMARKET_BASE_URL}/owner/${walletAddress}?${queryParams}`
    console.log('Fetching user NFTs from:', apiUrl)

    const response = await fetch(apiUrl, { headers })

    if (!response.ok) {
      console.error(`VibeMarket API error: ${response.status} ${response.statusText}`)
      return NextResponse.json(
        { success: false, message: `API error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('VibeMarket API response:', JSON.stringify(data, null, 2))

    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to fetch user NFTs:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}