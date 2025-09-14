import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('📡 Proxy: Received request to update Vibe metadata');
    console.log('📋 Proxy: Request body:', body);

    // Get API key from environment
    const apiKey = process.env.VIBEMARKET_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key not configured' },
        { status: 500 }
      );
    }

    console.log('🔑 Proxy: Using API key:', apiKey.substring(0, 8) + '...');

    // Forward request to Vibe.Market API
    const vibeResponse = await fetch('https://build.wield.xyz/booster/metadata', {
      method: 'POST',
      headers: {
        'API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('📄 Proxy: Vibe API response status:', vibeResponse.status);
    console.log('📄 Proxy: Vibe API response headers:', Object.fromEntries(vibeResponse.headers.entries()));

    // Get response as text first to see what we're getting
    const responseText = await vibeResponse.text();
    console.log('📄 Proxy: Raw response text:', responseText.substring(0, 500) + '...');

    let responseData;
    try {
      // Try to parse as JSON
      responseData = JSON.parse(responseText);
      console.log('📄 Proxy: Parsed JSON response:', responseData);
    } catch (parseError) {
      console.log('⚠️ Proxy: Response is not JSON, treating as text');
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
    console.error('❌ Proxy: Error calling Vibe API:', error);
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