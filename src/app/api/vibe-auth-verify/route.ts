import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🔐 Auth Verify Proxy: Received signature verification request');
    console.log('📝 Auth Verify Proxy: Request body:', body);

    // Forward request to Vibe.Market auth verification endpoint
    const vibeResponse = await fetch('https://build.wield.xyz/vibe/auth/verify-signature', {
      method: 'POST',
      headers: {
        'api-key': 'vibechain-default-5477272',
        'Content-Type': 'application/json',
        'x-bypass-image-proxy': 'true',
      },
      body: JSON.stringify(body),
    });

    console.log('🔍 Auth Verify Proxy: Vibe API response status:', vibeResponse.status);
    console.log('🔍 Auth Verify Proxy: Vibe API response headers:', Object.fromEntries(vibeResponse.headers.entries()));

    // Get response as text first to see what we're getting
    const responseText = await vibeResponse.text();
    console.log('📄 Auth Verify Proxy: Raw response text:', responseText.substring(0, 500) + '...');

    let responseData;
    try {
      // Try to parse as JSON
      responseData = JSON.parse(responseText);
      console.log('📄 Auth Verify Proxy: Parsed JSON response:', responseData);
    } catch (parseError) {
      console.log('⚠️ Auth Verify Proxy: Response is not JSON, treating as text');
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
    console.error('❌ Auth Verify Proxy: Error calling Vibe auth verification API:', error);
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