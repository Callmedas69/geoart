import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { base } from 'wagmi/chains'
import type { Config } from 'wagmi'

// Validation with fallback for development
const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID
if (!projectId) {
  console.warn('⚠️  NEXT_PUBLIC_WC_PROJECT_ID is missing. Please add it to .env.local')
  console.warn('   Get your project ID from: https://cloud.walletconnect.com/')
}

// Create config once and reuse - proper singleton pattern for Wagmi v2
const config = getDefaultConfig({
  appName: 'GEO ART NFT Collection',
  projectId: projectId || 'dev-placeholder-id',
  chains: [base],
  ssr: true,
  batch: {
    multicall: true,
  },
})

export { config }