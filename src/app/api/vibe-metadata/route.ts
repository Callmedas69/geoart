import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/utils/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    logger.info('📡 Proxy: Received request to update Vibe metadata');
    logger.dev('📋 Proxy: Request body:', body);

    // Get API key from environment
    const apiKey = process.env.VIBEMARKET_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key not configured' },
        { status: 500 }
      );
    }

    logger.sensitive('🔑 Proxy: Using API key:', apiKey);

    // Forward request to Vibe.Market API
    const vibeResponse = await fetch('https://build.wield.xyz/booster/metadata', {
      method: 'POST',
      headers: {
        'API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    logger.info('📄 Proxy: Vibe API response status:', vibeResponse.status);
    logger.dev('📄 Proxy: Vibe API response headers:', Object.fromEntries(vibeResponse.headers.entries()));

    // Get response as text first to see what we're getting
    const responseText = await vibeResponse.text();
    logger.dev('📄 Proxy: Raw response text:', responseText.substring(0, 500) + '...');

    let responseData;
    try {
      // Try to parse as JSON
      responseData = JSON.parse(responseText);
      logger.dev('📄 Proxy: Parsed JSON response:', responseData);
    } catch (parseError) {
      logger.warn('⚠️ Proxy: Response is not JSON, treating as text');
      responseData = {
        rawResponse: responseText.substring(0, 1000),
        contentType: vibeResponse.headers.get('content-type'),
        isHTML: responseText.includes('<!DOCTYPE') || responseText.includes('<html>')
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
    logger.error('❌ Proxy: Error calling Vibe API:', error);
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