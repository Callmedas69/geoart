import { PublicClient, WalletClient, parseEther, decodeEventLog, isAddress } from 'viem'
import { vibeMarketProxyAbi, VIBEMARKET_PROXY_ADDRESS } from '@/abi/vibeMarketProxyABI'
import { boosterDropV2Abi, InitializeParams } from '@/abi/IBoosterDropV2ABI'
import { FilebaseService, generateVibeMetadata, FilebaseConfig, MetadataJson } from './filebase'

interface CollectionConfig {
  tokenName: string
  tokenSymbol: string
  nftName: string
  nftSymbol: string
  description?: string
  twitterUsername?: string
  website?: string
  bgColor: string
  packImage?: File
  useFoil: boolean
  useWear: boolean
  isNSFW: boolean
}

interface RarityData {
  filename: string
  rarity: number
}

interface DeploymentResult {
  success: boolean
  dropAddress: string
  tokenAddress: string
  poolAddress?: string
  marketURL: string
  transactionHash: string
}

interface DeploymentProgress {
  step: string
  progress: number
  details?: string
}

type ProgressCallback = (progress: DeploymentProgress) => void

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
}

class VibeDeploymentService {
  private publicClient: PublicClient
  private walletClient: WalletClient

  constructor(
    publicClient: PublicClient,
    walletClient: WalletClient
  ) {
    this.publicClient = publicClient
    this.walletClient = walletClient
  }

  async deployVibeCollection(
    config: CollectionConfig,
    images: File[],
    csvData: RarityData[],
    onProgress: ProgressCallback
  ): Promise<DeploymentResult> {
    // Input validation
    this.validateInput(config, images, csvData)

    try {
      // Step 1: Upload metadata via API route
      onProgress({ step: 'Uploading to IPFS...', progress: 10 })
      const { baseURI, imageBaseUrl } = await this.uploadMetadataWithRetry(images, csvData, config, onProgress)
      
      // Step 2: Deploy contracts via proxy  
      onProgress({ step: 'Deploying contracts...', progress: 40 })
      const { tokenContract, dropContract, transactionHash } = await this.createDrop(config)
      
      // Step 3: Initialize drop contract
      onProgress({ step: 'Initializing contracts...', progress: 60 })
      await this.initializeDropContractWithRetry(dropContract, {
        ...config,
        tokenAddress: tokenContract,
        baseURI
      })
      
      // Step 4: Verify deployment
      onProgress({ step: 'Verifying deployment...', progress: 80 })
      const poolAddress = await this.getPoolAddress(tokenContract)
      
      // Final verification
      const isValid = await this.verifyContractsExist(dropContract, tokenContract)
      if (!isValid) {
        throw new Error('Contract deployment verification failed')
      }
      
      onProgress({ step: 'Deployment complete!', progress: 100 })
      
      return {
        success: true,
        dropAddress: dropContract,
        tokenAddress: tokenContract,
        poolAddress,
        marketURL: `https://vibechain.com/market/${dropContract}`,
        transactionHash
      }
      
    } catch (error) {
      throw new Error(`Deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private validateInput(config: CollectionConfig, images: File[], csvData: RarityData[]): void {
    if (!config.tokenName?.trim()) throw new Error('Token name is required')
    if (!config.tokenSymbol?.trim()) throw new Error('Token symbol is required')
    if (!config.nftName?.trim()) throw new Error('NFT name is required')
    if (!config.nftSymbol?.trim()) throw new Error('NFT symbol is required')
    
    if (!images.length) throw new Error('At least one image is required')
    if (!csvData.length) throw new Error('CSV rarity data is required')
    if (images.length !== csvData.length) throw new Error('Number of images must match CSV entries')
    
    // Validate images
    images.forEach((image, index) => {
      if (image.size > 10 * 1024 * 1024) { // 10MB limit
        throw new Error(`Image ${index + 1} exceeds 10MB limit`)
      }
      if (!image.type.startsWith('image/')) {
        throw new Error(`File ${index + 1} is not a valid image`)
      }
    })
    
    // Validate rarity data
    csvData.forEach((data, index) => {
      if (!data.filename?.trim()) throw new Error(`Filename missing for entry ${index + 1}`)
      if (!Number.isInteger(data.rarity) || data.rarity < 1 || data.rarity > 5) {
        throw new Error(`Invalid rarity value ${data.rarity} for entry ${index + 1}. Must be 1-5`)
      }
    })
  }

  private async uploadMetadataWithRetry(
    images: File[],
    csvData: RarityData[],
    config: CollectionConfig,
    onProgress: ProgressCallback
  ): Promise<{ baseURI: string; imageBaseUrl: string }> {
    return this.retryOperation(async () => {
      const formData = new FormData()
      
      // Add images to form data
      images.forEach((image, index) => {
        formData.append(`image-${index}`, image)
      })
      
      // Add CSV data and config as JSON strings
      formData.append('csvData', JSON.stringify(csvData))
      formData.append('config', JSON.stringify(config))
      
      onProgress({ step: 'Uploading metadata to IPFS...', progress: 30 })
      
      const response = await fetch('/api/upload-metadata', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }))
        throw new Error(errorData.error || `Upload failed with status: ${response.status}`)
      }
      
      const result = await response.json()
      if (!result.baseURI || !result.imageBaseUrl) {
        throw new Error('Invalid upload response - missing required URLs')
      }
      
      return {
        baseURI: result.baseURI,
        imageBaseUrl: result.imageBaseUrl
      }
    }, 'metadata upload')
  }

  private async createDrop(config: CollectionConfig): Promise<{
    tokenContract: string
    dropContract: string
    transactionHash: string
  }> {
      const account = await this.walletClient.getAddresses()
      if (!account[0]) throw new Error('No wallet connected')

      // Validate proxy contract exists
      const proxyCode = await this.publicClient.getBytecode({ address: VIBEMARKET_PROXY_ADDRESS })
      if (!proxyCode) throw new Error('VibeMarket proxy contract not found')

      // Estimate gas with safety margin
      const gasEstimate = await this.publicClient.estimateContractGas({
        address: VIBEMARKET_PROXY_ADDRESS,
        abi: vibeMarketProxyAbi,
        functionName: 'createDrop',
        args: [config.tokenName, config.tokenSymbol, config.nftName, config.nftSymbol],
        account: account[0]
      })

      // Add 20% safety margin to gas
      const gasWithMargin = gasEstimate + (gasEstimate * BigInt(20) / BigInt(100))

      // Execute createDrop transaction
      const hash = await this.walletClient.writeContract({
        address: VIBEMARKET_PROXY_ADDRESS,
        abi: vibeMarketProxyAbi,
        functionName: 'createDrop',
        args: [config.tokenName, config.tokenSymbol, config.nftName, config.nftSymbol],
        gas: gasWithMargin,
        account: account[0],
        chain: this.walletClient.chain
      })

      // Wait for transaction receipt with timeout
      const receipt = await Promise.race([
        this.publicClient.waitForTransactionReceipt({ hash }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Transaction timeout')), 60000)
        )
      ]) as any

      if (receipt.status !== 'success') {
        throw new Error(`createDrop transaction failed: ${receipt.status}`)
      }

      // Parse logs for DropCreated event
      const dropCreatedEvent = this.parseDropCreatedEvent(receipt.logs)
      if (!dropCreatedEvent) {
        throw new Error('Could not find DropCreated event in transaction logs')
      }

      return {
        tokenContract: dropCreatedEvent.tokenContract,
        dropContract: dropCreatedEvent.dropContract,
        transactionHash: hash
      }
  }

  private parseDropCreatedEvent(logs: any[]): { tokenContract: string; dropContract: string } | null {
    // Find the DropCreated event in the logs
    for (const log of logs) {
      try {
        // Attempt to decode each log with the proxy ABI
        const decoded = decodeEventLog({
          abi: vibeMarketProxyAbi,
          data: log.data,
          topics: log.topics,
        })
        
        if (decoded.eventName === 'DropCreated') {
          const { tokenContract, dropContract } = decoded.args as any
          
          // Validate addresses
          if (!isAddress(tokenContract) || !isAddress(dropContract)) {
            continue
          }
          
          return {
            tokenContract: tokenContract as string,
            dropContract: dropContract as string
          }
        }
      } catch {
        // Continue to next log if decoding fails
        continue
      }
    }
    
    return null
  }


  private async initializeDropContractWithRetry(
    dropContract: string,
    config: CollectionConfig & { tokenAddress: string; baseURI: string }
  ): Promise<void> {
    return this.retryOperation(async () => {
      const account = await this.walletClient.getAddresses()
      if (!account[0]) throw new Error('No wallet connected')

      // Validate addresses
      if (!isAddress(dropContract) || !isAddress(config.tokenAddress)) {
        throw new Error('Invalid contract addresses')
      }

      // Validate contract exists
      const dropCode = await this.publicClient.getBytecode({ address: dropContract as `0x${string}` })
      if (!dropCode) throw new Error('Drop contract not found')

      // Validate pricing parameters
      const offers = {
        common: parseEther('0.1'),
        rare: parseEther('0.2'),
        epic: parseEther('0.5'),
        legendary: parseEther('1'),
        mythic: parseEther('2')
      }

      const initParams: InitializeParams = {
        owner: account[0],
        nftName: config.nftName,
        nftSymbol: config.nftSymbol,
        tokenAddress: config.tokenAddress as `0x${string}`,
        baseURI: config.baseURI,
        tokensPerMint: parseEther('1'),
        commonOffer: offers.common,
        rareOffer: offers.rare,
        epicOffer: offers.epic,
        legendaryOffer: offers.legendary,
        mythicOffer: offers.mythic,
        entropyAddress: '0x0000000000000000000000000000000000000000' as `0x${string}`
      }

      // Convert InitializeParams to tuple format expected by the ABI
      const initParamsTuple = [
        initParams.owner,
        initParams.nftName,
        initParams.nftSymbol,
        initParams.tokenAddress,
        initParams.baseURI,
        initParams.tokensPerMint,
        initParams.commonOffer,
        initParams.rareOffer,
        initParams.epicOffer,
        initParams.legendaryOffer,
        initParams.mythicOffer,
        initParams.entropyAddress
      ] as const

      // Estimate gas with safety margin
      const gasEstimate = await this.publicClient.estimateContractGas({
        address: dropContract as `0x${string}`,
        abi: boosterDropV2Abi,
        functionName: 'initialize',
        args: [initParamsTuple] as any,
        account: account[0]
      })

      const gasWithMargin = gasEstimate + (gasEstimate * BigInt(20) / BigInt(100))

      const hash = await this.walletClient.writeContract({
        address: dropContract as `0x${string}`,
        abi: boosterDropV2Abi,
        functionName: 'initialize',
        args: [initParamsTuple] as any,
        gas: gasWithMargin,
        account: account[0],
        chain: this.walletClient.chain
      })

      const receipt = await Promise.race([
        this.publicClient.waitForTransactionReceipt({ hash }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Initialize transaction timeout')), 60000)
        )
      ]) as any

      if (receipt.status !== 'success') {
        throw new Error(`Initialize transaction failed: ${receipt.status}`)
      }
    }, 'contract initialization')
  }

  private async getPoolAddress(tokenContract: string): Promise<string | undefined> {
    try {
      if (!isAddress(tokenContract)) return undefined
      
      const poolAddress = await this.publicClient.readContract({
        address: tokenContract as `0x${string}`,
        abi: [{
          inputs: [],
          name: 'poolAddress',
          outputs: [{ internalType: 'address', name: '', type: 'address' }],
          stateMutability: 'view',
          type: 'function'
        }],
        functionName: 'poolAddress'
      })
      
      return isAddress(poolAddress as string) ? poolAddress as string : undefined
    } catch {
      return undefined
    }
  }

  async verifyContractsExist(
    dropContract: string,
    tokenContract: string
  ): Promise<boolean> {
    try {
      if (!isAddress(dropContract) || !isAddress(tokenContract)) {
        return false
      }
      
      const [dropCode, tokenCode] = await Promise.all([
        this.publicClient.getBytecode({ address: dropContract as `0x${string}` }),
        this.publicClient.getBytecode({ address: tokenContract as `0x${string}` })
      ])
      
      return !!(dropCode && tokenCode && dropCode.length > 2 && tokenCode.length > 2)
    } catch {
      return false
    }
  }

  private async retryOperation<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    let lastError: Error | null = null
    
    for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error')
        
        if (attempt === RETRY_CONFIG.maxRetries) {
          break
        }
        
        // Calculate delay with exponential backoff
        const delay = Math.min(
          RETRY_CONFIG.baseDelay * Math.pow(2, attempt),
          RETRY_CONFIG.maxDelay
        )
        
        console.warn(`${operationName} attempt ${attempt + 1} failed, retrying in ${delay}ms:`, lastError.message)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    
    throw new Error(`${operationName} failed after ${RETRY_CONFIG.maxRetries + 1} attempts: ${lastError?.message}`)
  }
}

export { VibeDeploymentService }
export type { CollectionConfig, RarityData, DeploymentResult, DeploymentProgress, ProgressCallback }