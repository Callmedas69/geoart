import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/utils/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    logger.info('🔐 Auth Verify Proxy: Received signature verification request');
    logger.dev('📝 Auth Verify Proxy: Request body:', body);

    // Forward request to Vibe.Market auth verification endpoint
    const vibeChainApiKey = process.env.VIBECHAIN_DEFAULT_API_KEY || 'vibechain-default-5477272';
    const vibeResponse = await fetch('https://build.wield.xyz/vibe/auth/verify-signature', {
      method: 'POST',
      headers: {
        'api-key': vibeChainApiKey,
        'Content-Type': 'application/json',
        'x-bypass-image-proxy': 'true',
      },
      body: JSON.stringify(body),
    });

    logger.info('🔍 Auth Verify Proxy: Vibe API response status:', vibeResponse.status);
    logger.dev('🔍 Auth Verify Proxy: Vibe API response headers:', Object.fromEntries(vibeResponse.headers.entries()));

    // Get response as text first to see what we're getting
    const responseText = await vibeResponse.text();
    logger.dev('📄 Auth Verify Proxy: Raw response text:', responseText.substring(0, 500) + '...');

    let responseData;
    try {
      // Try to parse as JSON
      responseData = JSON.parse(responseText);
      logger.dev('📄 Auth Verify Proxy: Parsed JSON response:', responseData);
    } catch (parseError) {
      logger.warn('⚠️ Auth Verify Proxy: Response is not JSON, treating as text');
      responseData = {
        rawResponse: responseText.substring(0, 1000),
        contentType: vibeResponse.headers.get('content-type'),
        isHTML: responseText.includes('<!DOCTYPE') || responseText.includes('<html>'),
        statusText: vibeResponse.statusText
      };
    }

    // Return the response from Vibe.Market
    return NextResponse.json(
      {
        success: vibeResponse.ok,
        status: vibeResponse.status,
        data: responseData,
      },
      { status: vibeResponse.status }
    );

  } catch (error) {
    logger.error('❌ Auth Verify Proxy: Error calling Vibe auth verification API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL || 'https://geoart.studio',
    'https://painter.geoart.studio',
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null,
  ].filter(Boolean) as string[];

  const origin = request.headers.get('origin') || '';
  const allowOrigin = allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins[0];

  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': allowOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
