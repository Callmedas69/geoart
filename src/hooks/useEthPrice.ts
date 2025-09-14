import { useState, useEffect, useCallback } from 'react'

interface EthPriceData {
  price: number
  priceFormatted: string
  lastUpdated: string
  cached?: boolean
  stale?: boolean
}

interface EthPriceResponse {
  success: boolean
  price?: number
  priceFormatted?: string
  lastUpdated?: string
  cached?: boolean
  stale?: boolean
  error?: string
  message?: string
}

export function useEthPrice() {
  const [data, setData] = useState<EthPriceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEthPrice = useCallback(async () => {
    try {
      setError(null)

      const response = await fetch('/api/eth-price', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout for client-side requests
        signal: AbortSignal.timeout(15000) // 15 second timeout
      })

      const result: EthPriceResponse = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Price unavailable')
      }

      if (result.price && result.priceFormatted && result.lastUpdated) {
        setData({
          price: result.price,
          priceFormatted: result.priceFormatted,
          lastUpdated: result.lastUpdated,
          cached: result.cached,
          stale: result.stale
        })
      } else {
        throw new Error('Invalid data')
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchEthPrice()
  }, [fetchEthPrice])

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchEthPrice()
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [fetchEthPrice])

  // Calculate USD value for given ETH amount
  const calculateUsdValue = useCallback((ethAmount: number): string => {
    if (!data?.price || isNaN(ethAmount)) {
      return '$0.00'
    }

    const usdValue = ethAmount * data.price
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(usdValue)
  }, [data?.price])

  // Format ETH amount with USD equivalent
  const formatEthWithUsd = useCallback((ethAmount: number): string => {
    const ethFormatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 6
    }).format(ethAmount)

    const usdValue = calculateUsdValue(ethAmount)
    return `${ethFormatted} ETH (~${usdValue})`
  }, [calculateUsdValue])

  return {
    // Data
    ethPrice: data?.price || 0,
    ethPriceFormatted: data?.priceFormatted || '$0.00',
    lastUpdated: data?.lastUpdated || '',

    // State
    isLoading,
    error,
    isStale: data?.stale || false,
    isCached: data?.cached || false,

    // Utility functions
    calculateUsdValue,
    formatEthWithUsd,

    // Actions
    refetch: fetchEthPrice
  }
}