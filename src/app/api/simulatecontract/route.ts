import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { boosterDropV2Abi } from '@/abi/IBoosterDropV2ABI';

const publicClient = createPublicClient({
  chain: base,
  transport: http()
});

export async function POST(req: NextRequest) {
  let parsedData: { contractAddress?: string; packAmount?: number } = {};
  
  try {
    console.log('🧪 Contract Simulation: Starting pack price calculation');
    
    parsedData = await req.json();
    const { contractAddress, packAmount } = parsedData;
    
    if (!contractAddress || !packAmount) {
      return NextResponse.json(
        { error: 'Missing contractAddress or packAmount' },
        { status: 400 }
      );
    }

    console.log('📋 Simulation params:', { contractAddress, packAmount });

    // Simulate getMintPrice call
    const mintPrice = await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi: boosterDropV2Abi,
      functionName: 'getMintPrice',
      args: [BigInt(packAmount)]
    });

    console.log('✅ getMintPrice result:', {
      packAmount,
      mintPrice: mintPrice.toString(),
      mintPriceHex: `0x${mintPrice.toString(16)}`
    });

    return NextResponse.json({
      success: true,
      packAmount,
      mintPrice: mintPrice.toString(),
      mintPriceHex: `0x${mintPrice.toString(16)}`,
      contractAddress,
      calculation: {
        packPurchaseAmount: packAmount,
        value: mintPrice.toString()
      }
    });

  } catch (error) {
    console.error('❌ Contract Simulation Error:', error);
    
    // Fallback calculation based on known values - use parsedData
    const fallbackPackAmount = parsedData.packAmount || 1;
    const fallbackPrice = BigInt(74753924395864) * BigInt(fallbackPackAmount);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Simulation failed',
      fallback: {
        packAmount: fallbackPackAmount,
        mintPrice: fallbackPrice.toString(),
        mintPriceHex: `0x${fallbackPrice.toString(16)}`,
        note: 'Using fallback calculation based on known price data'
      }
    }, { status: 500 });
  }
}