import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    
    console.log('🚀 Getting authentication message for address:', address);
    
    const response = await fetch(`https://build.wield.xyz/vibe/auth/message/${address}`, {
      method: 'GET',
      headers: {
        'api-key': 'vibechain-default-5477272',
        'x-bypass-image-proxy': 'true',
      },
    });

    const data = await response.json();
    
    console.log('🔍 Message response:', {
      status: response.status,
      success: data.success,
      hasMessage: !!data.message,
      hasNonce: !!data.nonce
    });

    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('❌ Message request error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to get authentication message',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}