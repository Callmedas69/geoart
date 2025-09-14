import { useState, useCallback, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { boosterDropV2Abi } from '@/abi/IBoosterDropV2ABI'
import { BuyTokenParams } from '@/types/BuyFunction'

export function useBuyToken() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined)

  // Write contract hook for buy transaction
  const { writeContract, isPending: isWritePending, error: writeError, data: writeData } = useWriteContract()

  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed, data: receipt } = useWaitForTransactionReceipt({
    hash: writeData,
  })

  // Update txHash when write transaction returns hash
  useEffect(() => {
    if (writeData) {
      console.log("📝 Transaction submitted with hash:", writeData)
      setTxHash(writeData)
    }
  }, [writeData])

  // Log transaction status changes
  useEffect(() => {
    if (isConfirming) {
      console.log("⏳ Transaction confirming...")
    }
    if (isConfirmed) {
      console.log("✅ Transaction confirmed!")
    }
  }, [isConfirming, isConfirmed])

  // Get mint price using readContract (not hook)
  const getMintPrice = useCallback(async (dropAddress: `0x${string}`, amount: bigint) => {
    try {
      const { readContract } = await import('wagmi/actions')
      const { config } = await import('@/lib/wagmi')

      const data = await readContract(config, {
        address: dropAddress,
        abi: boosterDropV2Abi,
        functionName: 'getMintPrice',
        args: [amount],
      })
      return data as bigint
    } catch (err) {
      throw new Error('Price calculation failed')
    }
  }, [])

  // Main mint function (renamed from buyTokens for clarity)
  const mintPacks = useCallback(async (params: BuyTokenParams) => {
    try {
      setIsLoading(true)
      setError(null)

      // Get referrer addresses from environment variables
      const referrer = params.referrer || (process.env.NEXT_PUBLIC_VIBEMARKET_REFERRER_ADDRESS as `0x${string}`)
      const originReferrer = params.originReferrer || (process.env.NEXT_PUBLIC_VIBEMARKET_ORIGIN_REFERRER_ADDRESS as `0x${string}`)

      // Get ETH cost for the pack amount
      const ethCost = await getMintPrice(params.tokenAddress, params.tokenAmount)

      // Temporarily suppress console errors during transaction
      const originalError = console.error
      console.error = () => {}

      try {
        // Execute mint transaction with referrers
        await writeContract({
          address: params.tokenAddress,
          abi: boosterDropV2Abi,
          functionName: 'mint',
          args: [params.tokenAmount, params.recipient, referrer, originReferrer],
          value: ethCost,
        })
      } finally {
        // Restore console.error
        console.error = originalError
      }
    } catch (err: any) {
      // Restore console.error if it was suppressed
      if (typeof console.error !== 'function') {
        console.error = console.log
      }

      let errorMessage = 'Transaction failed'

      // Parse error message from various sources
      const fullError = err?.message || err?.reason || err?.data?.message || String(err)
      const msg = fullError.toLowerCase()

      // Extract only the first meaningful part before technical details
      if (msg.includes('user rejected') || msg.includes('user denied') || msg.includes('rejected')) {
        errorMessage = 'User rejected the request'
      } else if (msg.includes('insufficient funds') || msg.includes('not enough') || msg.includes('balance')) {
        errorMessage = 'Not enough balance'
      } else if (msg.includes('gas')) {
        errorMessage = 'Gas estimation failed'
      } else if (msg.includes('reverted') || msg.includes('execution reverted')) {
        errorMessage = 'Transaction reverted'
      } else {
        // Extract first sentence only
        const firstSentence = fullError.split('.')[0]
        if (firstSentence && firstSentence.length < 50) {
          errorMessage = firstSentence
        } else {
          errorMessage = 'Transaction failed'
        }
      }

      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [writeContract, getMintPrice])

  // Format price for display
  const formatPrice = useCallback((wei: bigint) => {
    return formatEther(wei)
  }, [])

  // Parse user input to wei
  const parsePrice = useCallback((eth: string) => {
    try {
      return parseEther(eth)
    } catch {
      throw new Error('Invalid ETH amount')
    }
  }, [])

  return {
    // State
    isLoading: isLoading || isWritePending || isConfirming,
    error: error || writeError?.message || null,
    isConfirmed,
    txHash,

    // Functions
    mintPacks,
    getMintPrice,
    formatPrice,
    parsePrice,

    // Reset function
    reset: () => {
      setError(null)
      setTxHash(undefined)
      setIsLoading(false)
    }
  }
}