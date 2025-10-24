import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/utils/logger';

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

    logger.info(`Checking collection ready status for contract: ${contractAddress}`);

    const vibeChainApiKey = process.env.VIBECHAIN_DEFAULT_API_KEY || 'vibechain-default-5477272';
    const headers: Record<string, string> = {
      'api-key': vibeChainApiKey,
      'Content-Type': 'application/json',
      'x-bypass-image-proxy': 'true',
    };

    // Call the ready endpoint for collection (using boosterbox endpoint as documented)
    const vibeResponse = await fetch(
      `https://build.wield.xyz/vibe/boosterbox/contractAddress/${contractAddress}/ready?chainId=${chainId}`,
      {
        method: 'GET',
        headers,
      }
    );

    const data = await vibeResponse.json();
    logger.dev('Collection ready status response:', data);

    if (!vibeResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || 'Failed to check collection ready status',
          data
        },
        { status: vibeResponse.status }
      );
    }

    return NextResponse.json({ success: true, data });

  } catch (error) {
    logger.error('Collection ready status check error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
