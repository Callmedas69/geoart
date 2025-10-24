import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/utils/logger';

export async function POST(req: NextRequest) {
  logger.info('🖼️ Vibe Image Upload: Processing direct image upload to Vibe.Market');

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const jwtToken = authHeader.substring(7);
    logger.sensitive('🔐 Vibe Image Upload: JWT Bearer token found:', jwtToken);

    // Parse the form data
    const formData = await req.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    logger.info('📋 Vibe Image Upload: Processing file:', {
      name: image.name,
      size: image.size,
      type: image.type
    });

    // Prepare the form data for Vibe.Market API - ONLY send image file
    const vibeFormData = new FormData();
    vibeFormData.append('files', image);

    // Use the actual Vibe.Market image upload endpoint from research
    const VIBE_UPLOAD_URL = 'https://build.wield.xyz/image/upload';

    logger.dev('🔑 Vibe Image Upload: Using real Vibe.Market endpoint:', VIBE_UPLOAD_URL);

    // Call Vibe.Market's actual upload endpoint
    const vibeChainApiKey = process.env.VIBECHAIN_DEFAULT_API_KEY || 'vibechain-default-5477272';
    const vibeResponse = await fetch(VIBE_UPLOAD_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'api-key': vibeChainApiKey,
        // Don't set Content-Type - let the browser set it with boundary for multipart/form-data
      },
      body: vibeFormData
    });

    logger.info('📄 Vibe Image Upload: Vibe API response status:', vibeResponse.status);
    logger.dev('📄 Vibe Image Upload: Vibe API response headers:', Object.fromEntries(vibeResponse.headers.entries()));

    if (!vibeResponse.ok) {
      const errorText = await vibeResponse.text();
      logger.error('❌ Vibe Image Upload: API call failed with status:', vibeResponse.status);
      logger.dev('❌ Vibe Image Upload: Error response body:', errorText);
      logger.dev('❌ Vibe Image Upload: Request details - URL:', VIBE_UPLOAD_URL);
      logger.sensitive('❌ Vibe Image Upload: Request details - JWT token:', jwtToken);
      throw new Error(`Vibe.Market API returned ${vibeResponse.status}: ${errorText}`);
    }

    const vibeData = await vibeResponse.json();
    logger.dev('📄 Vibe Image Upload: Vibe API response:', JSON.stringify(vibeData, null, 2));
    logger.dev('📄 Vibe Image Upload: Response keys:', Object.keys(vibeData));
    logger.dev('📄 Vibe Image Upload: Response type:', typeof vibeData);

    // Extract the image URL from Vibe.Market's response - try multiple possible structures
    let imageUrl = null;
    let imageId = null;

    // Log the structure we're examining
    logger.dev('🔍 Examining response structure for image URL...');

    // Try different response structures with detailed logging
    if (vibeData.image?.result?.variants?.[0]) {
      // Structure: { image: { result: { variants: [...], id: "..." } } }
      logger.dev('✅ Found image.result.variants structure');
      imageUrl = vibeData.image.result.variants[0];
      imageId = vibeData.image.result.id;
    } else if (vibeData.result?.variants?.[0]) {
      // Structure: { result: { variants: [...], id: "..." } }
      logger.dev('✅ Found result.variants structure');
      imageUrl = vibeData.result.variants[0];
      imageId = vibeData.result.id;
    } else if (vibeData.variants?.[0]) {
      // Structure: { variants: [...], id: "..." }
      logger.dev('✅ Found top-level variants structure');
      imageUrl = vibeData.variants[0];
      imageId = vibeData.id;
    } else if (vibeData.url || vibeData.imageUrl) {
      // Structure: { url: "..." } or { imageUrl: "..." }
      logger.dev('✅ Found direct URL structure');
      imageUrl = vibeData.url || vibeData.imageUrl;
      imageId = vibeData.id || 'unknown';
    } else if (vibeData.success && vibeData.result?.url) {
      // Structure: { success: true, result: { url: "...", id: "..." } }
      logger.dev('✅ Found success.result.url structure');
      imageUrl = vibeData.result.url;
      imageId = vibeData.result.id || 'unknown';
    } else if (vibeData.data?.url) {
      // Structure: { data: { url: "...", id: "..." } }
      logger.dev('✅ Found data.url structure');
      imageUrl = vibeData.data.url;
      imageId = vibeData.data.id || 'unknown';
    } else {
      // Check for other possible structures
      logger.dev('🔍 Checking for other possible structures...');
      logger.dev('🔍 vibeData.image exists:', !!vibeData.image);
      if (vibeData.image) {
        logger.dev('🔍 vibeData.image keys:', Object.keys(vibeData.image));
        logger.dev('🔍 vibeData.image content:', JSON.stringify(vibeData.image, null, 2));
      }
      logger.dev('🔍 vibeData.result exists:', !!vibeData.result);
      if (vibeData.result) {
        logger.dev('🔍 vibeData.result keys:', Object.keys(vibeData.result));
        logger.dev('🔍 vibeData.result content:', JSON.stringify(vibeData.result, null, 2));
      }
      logger.dev('🔍 vibeData.data exists:', !!vibeData.data);
      if (vibeData.data) {
        logger.dev('🔍 vibeData.data keys:', Object.keys(vibeData.data));
        logger.dev('🔍 vibeData.data content:', JSON.stringify(vibeData.data, null, 2));
      }

      // Also check for any field that might contain a URL-like string
      const flattenedData = JSON.stringify(vibeData);
      const possibleUrls = flattenedData.match(/https?:\/\/[^\s"]+/g);
      if (possibleUrls && possibleUrls.length > 0) {
        logger.dev('🔍 Found possible URLs in response:', possibleUrls);
        // Try to find imagedelivery.net URLs which are common for Cloudflare
        const imagedeliveryUrl = possibleUrls.find(url => url.includes('imagedelivery.net'));
        if (imagedeliveryUrl) {
          logger.dev('✅ Found imagedelivery.net URL, using as image URL');
          imageUrl = imagedeliveryUrl.replace(/[",}]$/, ''); // Clean up any trailing characters
          imageId = 'extracted_' + Date.now();
        }
      }
    }

    if (!imageUrl) {
      logger.error('❌ Vibe Image Upload: No image URL found in response structure');
      logger.dev('❌ Full response for debugging:', JSON.stringify(vibeData, null, 2));
      throw new Error(`No image URL found in Vibe.Market response. Response keys: ${Object.keys(vibeData).join(', ')}. Full response logged above.`);
    }

    logger.success('✅ Vibe Image Upload: Successfully got image URL:', imageUrl);

    // Return standardized response
    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
      imageId: imageId,
      message: 'Image uploaded successfully to Vibe.Market',
      originalResponse: vibeData
    });

  } catch (error) {
    logger.error('❌ Vibe Image Upload: Error:', error);
    logger.dev('❌ Vibe Image Upload: Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    // Return error information for debugging
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Image upload failed - check server logs for details'
    }, { status: 500 });
  }
}
