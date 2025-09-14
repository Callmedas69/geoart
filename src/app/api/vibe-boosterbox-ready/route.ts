import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contractAddress = searchParams.get('contractAddress');
    const chainId = searchParams.get('chainId') || '8453';

    if (!contractAddress) {
      return NextResponse.json(
        { success: false, message: 'Contract address is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 Checking booster box ready status for contract: ${contractAddress}`);

    const headers: Record<string, string> = {
      'api-key': 'vibechain-default-5477272',
      'Content-Type': 'application/json',
      'x-bypass-image-proxy': 'true',
    };

    // Call the ready endpoint
    const vibeResponse = await fetch(
      `https://build.wield.xyz/vibe/boosterbox/contractAddress/${contractAddress}/ready?chainId=${chainId}`,
      {
        method: 'GET',
        headers,
      }
    );

    const data = await vibeResponse.json();
    console.log('📊 Ready status response:', data);

    if (!vibeResponse.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || 'Failed to check ready status',
          data 
        },
        { status: vibeResponse.status }
      );
    }

    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error('❌ Ready status check error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}