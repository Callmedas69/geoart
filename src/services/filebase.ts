import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'

interface FilebaseConfig {
  accessKeyId: string
  secretAccessKey: string
  bucketName: string
  region: string
  endpoint: string
}

interface MetadataJson {
  name: string
  description: string
  image: string
  imageUrl: string
  external_url: string
  attributes: Array<{
    trait_type: string
    value: string | number
    display_type?: string
  }>
  animation_url?: string
  status: string
}

interface UploadResult {
  baseURI: string
  ipfsHashes: string[]
  imageBaseUrl: string
}

class FilebaseService {
  private s3Client: S3Client
  private bucketName: string

  constructor(config: FilebaseConfig) {
    this.s3Client = new S3Client({
      endpoint: config.endpoint,
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      forcePathStyle: true,
    })
    this.bucketName = config.bucketName
  }

  async uploadToFilebase(
    images: File[],
    metadata: MetadataJson[],
    collectionName: string
  ): Promise<UploadResult> {
    if (!images.length || !metadata.length) {
      throw new Error('Images and metadata are required')
    }
    
    if (!collectionName?.trim()) {
      throw new Error('Collection name is required')
    }
    
    if (images.length !== metadata.length) {
      throw new Error('Number of images must match number of metadata entries')
    }

    try {
      console.log('🔍 FilebaseService: Starting upload process')
      console.log(`📊 Upload Summary: ${images.length} images, ${metadata.length} metadata files`)
      console.log(`📁 Collection: ${collectionName}`)
      
      // Upload images first
      const imageUploads = images.map(async (image, index) => {
        console.log(`🖼️ Processing Image ${index + 1}:`, {
          name: image.name,
          size: image.size,
          type: image.type,
          lastModified: image.lastModified
        })
        
        if (image.size > 10 * 1024 * 1024) { // 10MB limit
          throw new Error(`Image ${index + 1} is too large (max 10MB)`)
        }
        
        const fileExtension = image.type.split('/')[1] || 'png'
        const key = `${collectionName}/images/${index + 1}.${fileExtension}`
        console.log(`📤 Uploading to key: ${key}`)
        const upload = new Upload({
          client: this.s3Client,
          params: {
            Bucket: this.bucketName,
            Key: key,
            Body: image,
            ContentType: image.type,
          },
        })
        const result = await upload.done()
        console.log(`✅ Image ${index + 1} uploaded:`, {
          key,
          location: (result as any)?.Location,
          etag: (result as any)?.ETag
        })
        return result
      })

      // Upload metadata
      const metadataUploads = metadata.map(async (meta, index) => {
        const key = `${collectionName}/metadata/${index + 1}.json`
        console.log(`📝 Uploading metadata ${index + 1} to key: ${key}`)
        console.log(`📄 Metadata content preview:`, {
          name: meta.name,
          image: meta.image,
          attributes: meta.attributes.length
        })
        
        const upload = new Upload({
          client: this.s3Client,
          params: {
            Bucket: this.bucketName,
            Key: key,
            Body: JSON.stringify(meta, null, 2),
            ContentType: 'application/json',
          },
        })
        const result = await upload.done()
        console.log(`✅ Metadata ${index + 1} uploaded:`, {
          key,
          location: (result as any)?.Location,
          etag: (result as any)?.ETag
        })
        return result
      })

      const [imageResults, metadataResults] = await Promise.all([
        Promise.all(imageUploads),
        Promise.all(metadataUploads),
      ])

      // Validate upload results
      if (!imageResults.length || !metadataResults.length) {
        throw new Error('Upload failed - no results returned')
      }

      // Extract bucket name from first result
      const firstResult = metadataResults[0] as any
      if (!firstResult?.Location) {
        throw new Error('Upload failed - no location in result')
      }

      const bucketName = this.extractBucketName(firstResult.Location)
      
      // Extract simple filenames for tracking
      const ipfsHashes = metadataResults.map((result: any, index) => {
        if (!result?.Location) {
          throw new Error(`Metadata upload ${index + 1} failed - no location`)
        }
        return `${index + 1}.json`
      })

      // For Filebase, use the direct IPFS gateway with bucket structure
      // Format: https://ipfs.filebase.io/ipfs/BUCKET_NAME/COLLECTION_NAME/path
      // Based on Filebase documentation and your guidance
      const baseURI = `https://ipfs.filebase.io/ipfs/${bucketName}/${collectionName}/metadata/`
      const imageBaseUrl = `https://ipfs.filebase.io/ipfs/${bucketName}/${collectionName}/images/`

      return {
        baseURI,
        ipfsHashes,
        imageBaseUrl,
      }
    } catch (error) {
      throw new Error(`Filebase upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private extractBucketName(s3Url: string): string {
    // Extract bucket name from Filebase S3 URL
    // Format: https://s3.filebase.com/bucket-name/path/file.json
    try {
      const url = new URL(s3Url)
      
      if (url.hostname === 's3.filebase.com') {
        const pathParts = url.pathname.split('/').filter(Boolean)
        if (pathParts.length > 0) {
          return pathParts[0] // First part is bucket name
        }
      }
      
      throw new Error(`Invalid S3 URL format: ${s3Url}`)
    } catch (error) {
      throw new Error(`Failed to extract bucket name from URL: ${s3Url}`)
    }
  }

}

// Helper function to generate VibeMarket metadata format
export function generateVibeMetadata(
  images: File[],
  csvData: Array<{ filename: string; rarity: number }>,
  config: {
    nftName: string
    description?: string
    bgColor: string
    useFoil: boolean
    useWear: boolean
  },
  imageBaseUrl?: string,
  collectionName?: string
): MetadataJson[] {
  if (!images.length || !csvData.length) {
    throw new Error('Images and CSV data are required')
  }
  
  if (images.length !== csvData.length) {
    throw new Error('Number of images must match CSV entries')
  }

  const rarityNames = {
    1: 'Common',
    2: 'Rare',
    3: 'Epic',
    4: 'Legendary',
    5: 'Mythic'
  }

  return csvData.map((data, index) => {
    const tokenId = index + 1
    const rarityName = rarityNames[data.rarity as keyof typeof rarityNames]
    
    if (!rarityName) {
      throw new Error(`Invalid rarity value: ${data.rarity} for token ${tokenId}`)
    }
    
    // Generate deterministic wear value based on token ID and rarity
    const seed = tokenId + data.rarity * 1000
    const deterministicRandom = (seed * 9301 + 49297) % 233280 / 233280
    const wear = Math.max(0, Math.min(1, deterministicRandom))
    
    const condition = wear < 0.05 ? 'Pristine' 
                    : wear < 0.2 ? 'Mint'
                    : wear < 0.45 ? 'Lightly Played'
                    : wear < 0.75 ? 'Moderately Played'
                    : 'Heavily Played'

    const attributes = [
      {
        trait_type: 'Rarity',
        value: rarityName
      },
      {
        trait_type: 'Rarity Value',
        value: data.rarity,
        display_type: 'number'
      }
    ]

    // Add condition if wear is enabled
    if (config.useWear) {
      attributes.push({
        trait_type: 'Condition',
        value: condition
      })
      attributes.push({
        trait_type: 'Wear',
        value: parseFloat(wear.toFixed(4)),
        display_type: 'number'
      })
    }

    // Add foil attribute if enabled (deterministic based on token ID)
    if (config.useFoil) {
      const foilSeed = tokenId * 7 + data.rarity * 13
      const foilRandom = (foilSeed * 9301 + 49297) % 233280 / 233280
      attributes.push({
        trait_type: 'Foil',
        value: foilRandom > 0.8 ? 'Yes' : 'No'
      })
    }

    const fileExtension = images[index]?.type.split('/')[1] || 'png'
    const imageUrl = imageBaseUrl 
      ? `${imageBaseUrl}${tokenId}.${fileExtension}`
      : collectionName 
        ? `https://ipfs.filebase.io/ipfs/vibeloader/${collectionName}/images/${tokenId}.${fileExtension}`
        : `https://ipfs.filebase.io/ipfs/vibeloader/images/${tokenId}.${fileExtension}`

    return {
      name: `${config.nftName} #${tokenId}`,
      description: config.description || `Buy ${config.nftName} Booster Packs on vibe.market`,
      image: imageUrl,
      imageUrl: imageUrl,
      external_url: 'https://vibechain.com/market',
      attributes,
      status: 'minted' // Pre-reveal status
    }
  })
}

export { FilebaseService }
export type { FilebaseConfig, MetadataJson, UploadResult }