import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('📡 Confirm Proxy: Received request to confirm metadata draft');
    console.log('📋 Confirm Proxy: Request body:', body);

    // Get API key from environment
    const apiKey = process.env.VIBEMARKET_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key not configured' },
        { status: 500 }
      );
    }

    console.log('🔑 Confirm Proxy: Using API key:', apiKey.substring(0, 8) + '...');

    // Prepare authentication headers (using real Vibe.Market flow)
    const headers: Record<string, string> = {
      'api-key': 'vibechain-default-5477272', // The correct API key for Vibe.Market
      'Content-Type': 'application/json',
      'x-bypass-image-proxy': 'true',
    };

    // Check for JWT Bearer token (from signature verification)
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      headers['Authorization'] = authHeader;
      console.log('🔐 Confirm Proxy: JWT Bearer token found in request headers');
      const token = authHeader.replace('Bearer ', '');
      console.log('🔑 Confirm Proxy: Using JWT token:', token.substring(0, 50) + '...');
    } else {
      console.log('⚠️ Confirm Proxy: No Authorization header found - metadata API may fail');
    }

    // Forward request to Vibe.Market confirm API
    const vibeResponse = await fetch('https://build.wield.xyz/vibe/boosterbox/metadata/confirm', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    console.log('📄 Confirm Proxy: Vibe API response status:', vibeResponse.status);
    console.log('📄 Confirm Proxy: Vibe API response headers:', Object.fromEntries(vibeResponse.headers.entries()));

    // Get response as text first to see what we're getting
    const responseText = await vibeResponse.text();
    console.log('📄 Confirm Proxy: Raw response text:', responseText.substring(0, 500) + '...');

    let responseData;
    try {
      // Try to parse as JSON
      responseData = JSON.parse(responseText);
      console.log('📄 Confirm Proxy: Parsed JSON response:', responseData);
    } catch (parseError) {
      console.log('⚠️ Confirm Proxy: Response is not JSON, treating as text');
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
    console.error('❌ Confirm Proxy: Error calling Vibe confirm API:', error);
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
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}