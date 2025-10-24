import { NextRequest, NextResponse } from "next/server";
import { logger } from '@/utils/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    logger.info("Generate Slug: Received request", body);

    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Missing authorization header" },
        { status: 401 }
      );
    }

    const jwtToken = authHeader.substring(7);
    logger.sensitive("Generate Slug: Using JWT token:", jwtToken);

    const vibeChainApiKey = process.env.VIBECHAIN_DEFAULT_API_KEY || 'vibechain-default-5477272';
    const vibeResponse = await fetch("https://build.wield.xyz/vibe/boosterbox/generate-slug", {
      method: "POST",
      headers: {
        "api-key": vibeChainApiKey,
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`,
        "x-bypass-image-proxy": "true",
      },
      body: JSON.stringify(body),
    });

    const responseText = await vibeResponse.text();
    logger.dev("Generate Slug API response:", responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      responseData = { rawResponse: responseText };
    }

    return NextResponse.json({
      success: vibeResponse.ok,
      status: vibeResponse.status,
      data: responseData,
      slug: responseData.slug || responseData.packName || "generated-slug"
    });

  } catch (error) {
    logger.error("Generate Slug error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
