import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/utils/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    logger.info('🚀 Getting authentication message for address:', address);

    const vibeChainApiKey = process.env.VIBECHAIN_DEFAULT_API_KEY || 'vibechain-default-5477272';
    const response = await fetch(`https://build.wield.xyz/vibe/auth/message/${address}`, {
      method: 'GET',
      headers: {
        'api-key': vibeChainApiKey,
        'x-bypass-image-proxy': 'true',
      },
    });

    const data = await response.json();

    logger.info('🔍 Message response:', {
      status: response.status,
      success: data.success,
      hasMessage: !!data.message,
      hasNonce: !!data.nonce
    });

    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    logger.error('❌ Message request error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get authentication message',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
