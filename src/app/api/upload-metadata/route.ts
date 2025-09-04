import { NextRequest, NextResponse } from 'next/server'
import { FilebaseService, generateVibeMetadata, MetadataJson } from '@/services/filebase'

export async function POST(request: NextRequest) {
  try {
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
    
    // Extract image files
    let index = 0
    while (formData.get(`image-${index}`)) {
      images.push(formData.get(`image-${index}`) as File)
      index++
    }

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
    
    // First upload to get the IPFS hash structure
    const tempMetadata = generateVibeMetadata(images, csvData, config)
    const tempResult = await filebaseService.uploadToFilebase(images, tempMetadata)
    
    // Generate final metadata with correct image URLs
    const finalMetadata = generateVibeMetadata(images, csvData, config, tempResult.imageBaseUrl)
    
    // Upload final metadata with correct URLs
    const result = await filebaseService.uploadToFilebase(images, finalMetadata)
    
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