import { useState } from 'react'
import { usePublicClient, useWalletClient } from 'wagmi'
import { VibeDeploymentService, CollectionConfig, RarityData, DeploymentResult, DeploymentProgress } from '@/services/vibeDeployment'

interface UseVibeDeploymentProps {
  onProgress?: (progress: DeploymentProgress) => void
}

// Validation helper functions
function validateDeploymentInput(config: CollectionConfig, images: File[], csvData: RarityData[]): void {
  // Config validation
  if (!config.tokenName?.trim()) throw new Error('Token name is required')
  if (!config.tokenSymbol?.trim()) throw new Error('Token symbol is required')
  if (!config.nftName?.trim()) throw new Error('NFT name is required')
  if (!config.nftSymbol?.trim()) throw new Error('NFT symbol is required')
  
  // Data validation
  if (!images.length) throw new Error('At least one image is required')
  if (!csvData.length) throw new Error('CSV rarity data is required')
  if (images.length !== csvData.length) throw new Error('Number of images must match CSV entries')
  
  // File size limits
  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  const totalSize = images.reduce((sum, img) => sum + img.size, 0)
  const MAX_TOTAL_SIZE = 100 * 1024 * 1024 // 100MB total
  
  if (totalSize > MAX_TOTAL_SIZE) {
    throw new Error('Total file size exceeds 100MB limit')
  }
  
  images.forEach((image, index) => {
    if (image.size > MAX_FILE_SIZE) {
      throw new Error(`Image ${index + 1} exceeds 10MB limit`)
    }
    if (!image.type.startsWith('image/')) {
      throw new Error(`File ${index + 1} is not a valid image`)
    }
  })
  
  // CSV data validation
  csvData.forEach((data, index) => {
    if (!data.filename?.trim()) throw new Error(`Filename missing for entry ${index + 1}`)
    if (!Number.isInteger(data.rarity) || data.rarity < 1 || data.rarity > 5) {
      throw new Error(`Invalid rarity value ${data.rarity} for entry ${index + 1}. Must be 1-5`)
    }
  })
}

function sanitizeErrorMessage(message: string): string {
  // Remove potentially sensitive information from error messages
  return message
    .replace(/0x[a-fA-F0-9]{40}/g, '[ADDRESS]') // Hide addresses
    .replace(/\/[^\/\s]+\.(ts|js|tsx|jsx)/g, '[FILE]') // Hide file paths
    .replace(/at line \d+/g, '[LINE]') // Hide line numbers
    .replace(/Transaction hash: 0x[a-fA-F0-9]{64}/g, 'Transaction failed') // Hide tx hashes
}

export function useVibeDeployment({ onProgress }: UseVibeDeploymentProps = {}) {
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const deployCollection = async (
    config: CollectionConfig,
    images: File[],
    csvData: RarityData[]
  ): Promise<DeploymentResult | null> => {
    // Reset state
    setError(null)
    setDeploymentResult(null)

    // Validate wallet connection
    if (!publicClient || !walletClient) {
      setError('Please connect your wallet to continue')
      return null
    }

    // Input validation
    try {
      validateDeploymentInput(config, images, csvData)
    } catch (validationError) {
      const errorMessage = validationError instanceof Error ? validationError.message : 'Invalid input'
      setError(errorMessage)
      return null
    }

    setIsDeploying(true)

    try {
      // Create deployment service
      const deploymentService = new VibeDeploymentService(
        publicClient,
        walletClient
      )

      // Execute deployment with progress tracking
      const result = await deploymentService.deployVibeCollection(
        config,
        images,
        csvData,
        (progress) => {
          onProgress?.(progress)
        }
      )

      setDeploymentResult(result)
      return result

    } catch (err) {
      // Sanitize error message for UI display
      const errorMessage = sanitizeErrorMessage(err instanceof Error ? err.message : 'Unknown error occurred')
      setError(errorMessage)
      return null
    } finally {
      setIsDeploying(false)
    }
  }

  const resetDeployment = () => {
    setIsDeploying(false)
    setDeploymentResult(null)
    setError(null)
  }

  const validateInput = (config: CollectionConfig, images: File[], csvData: RarityData[]): string | null => {
    try {
      validateDeploymentInput(config, images, csvData)
      return null
    } catch (validationError) {
      return validationError instanceof Error ? validationError.message : 'Invalid input'
    }
  }

  return {
    isDeploying,
    deploymentResult,
    error,
    deployCollection,
    resetDeployment,
    validateInput,
    isWalletConnected: !!(publicClient && walletClient)
  }
}