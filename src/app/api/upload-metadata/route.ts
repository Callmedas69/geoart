import { NextRequest, NextResponse } from 'next/server'
import { FilebaseService, generateVibeMetadata, MetadataJson } from '@/services/filebase'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 API: Starting metadata upload request')
    const formData = await request.formData()
    
    // Extract files and configuration
    const images: File[] = []
    const csvDataStr = formData.get('csvData') as string
    const configStr = formData.get('config') as string
    
    if (!csvDataStr || !configStr) {
      return NextResponse.json({ error: 'Missing CSV data or configuration' }, { status: 400 })
    }
    
    // Parse CSV data and config
    const csvData = JSON.parse(csvDataStr)
    const config = JSON.parse(configStr)
    
    // Extract collection name from config
    const collectionName = config.nftName?.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() || 'collection'
    
    // Extract image files
    let index = 0
    while (formData.get(`image-${index}`)) {
      const file = formData.get(`image-${index}`) as File
      console.log(`📂 API: Found image-${index}:`, {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      })
      images.push(file)
      index++
    }

    console.log(`📊 API: Extracted ${images.length} images and ${csvData.length} CSV entries`)
    console.log(`🏷️ API: Collection name will be: ${collectionName}`)

    if (images.length === 0 || csvData.length === 0) {
      return NextResponse.json({ error: 'No images or CSV data provided' }, { status: 400 })
    }

    // Validate environment variables
    const requiredEnvVars = [
      'FILEBASE_ACCESS_KEY_ID',
      'FILEBASE_SECRET_ACCESS_KEY', 
      'FILEBASE_BUCKET_NAME',
      'FILEBASE_REGION',
      'FILEBASE_ENDPOINT'
    ]
    
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        console.error(`Missing environment variable: ${envVar}`)
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
      }
    }

    // Configure Filebase from server environment variables
    const filebaseConfig = {
      accessKeyId: process.env.FILEBASE_ACCESS_KEY_ID!,
      secretAccessKey: process.env.FILEBASE_SECRET_ACCESS_KEY!,
      bucketName: process.env.FILEBASE_BUCKET_NAME!,
      region: process.env.FILEBASE_REGION!,
      endpoint: process.env.FILEBASE_ENDPOINT!
    }

    // Create Filebase service
    const filebaseService = new FilebaseService(filebaseConfig)
    console.log('🔧 API: FilebaseService created')
    
    // First upload to get the IPFS hash structure
    console.log('📦 API: Generating temporary metadata')
    const tempMetadata = generateVibeMetadata(images, csvData, config, undefined, collectionName)
    console.log('☁️ API: Starting first upload to get IPFS structure')
    const tempResult = await filebaseService.uploadToFilebase(images, tempMetadata, collectionName)
    
    // Generate final metadata with correct image URLs
    console.log('🔄 API: Generating final metadata with correct URLs')
    console.log('🖼️ API: Image base URL:', tempResult.imageBaseUrl)
    const finalMetadata = generateVibeMetadata(images, csvData, config, tempResult.imageBaseUrl, collectionName)
    
    // Upload final metadata with correct URLs
    console.log('☁️ API: Starting final upload with correct URLs')
    const result = await filebaseService.uploadToFilebase(images, finalMetadata, collectionName)
    console.log('✅ API: Upload process completed successfully')
    
    return NextResponse.json({
      success: true,
      baseURI: result.baseURI,
      imageBaseUrl: result.imageBaseUrl,
      ipfsHashes: result.ipfsHashes
    })
    
  } catch (error) {
    console.error('Metadata upload error:', error)
    return NextResponse.json(
      { error: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}