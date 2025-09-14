"use client"

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Button } from '@/components/ui/button'
import { BuyModal } from '@/components/BuyFunction'

// Test page for standalone BuyModal testing
export default function TestBuyModal() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { address: connectedAddress } = useAccount()

  // Test data - using real drop address from .env.local and connected wallet as creator
  const testTokenAddress = "0x3d8682a156f7a2594a5bec7e77bd31a0a821ee99" as `0x${string}` // Real drop contract
  const testCreatorAddress = (connectedAddress || "0x0000000000000000000000000000000000000000") as `0x${string}`

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold uppercase tracking-wide">
            Pack Minting Test Page
          </h1>
          <p className="text-sm text-gray-600">
            Standalone testing for BuyFunction component (Pack Minting)
          </p>
        </div>

        {/* Test Information */}
        <div className="p-4 border-1 border-green-300 bg-green-50 text-left">
          <h3 className="font-bold uppercase text-sm mb-2">✅ Real Drop Contract:</h3>
          <div className="space-y-1 text-xs font-mono">
            <p><strong>Drop Address:</strong></p>
            <p className="break-all">{testTokenAddress}</p>
            <p><strong>Creator Address (Connected Wallet):</strong></p>
            <p className="break-all">
              {connectedAddress ? connectedAddress : 'Not Connected (using zero address)'}
            </p>
          </div>
        </div>

        {/* Environment Variables Display */}
        <div className="p-4 border-1 border-blue-300 bg-blue-50 text-left">
          <h3 className="font-bold uppercase text-sm mb-2">Environment Variables:</h3>
          <div className="space-y-1 text-xs font-mono">
            <p><strong>Referrer:</strong></p>
            <p className="break-all">{process.env.NEXT_PUBLIC_VIBEMARKET_REFERRER_ADDRESS || 'Not set'}</p>
            <p><strong>Origin Referrer:</strong></p>
            <p className="break-all">{process.env.NEXT_PUBLIC_VIBEMARKET_ORIGIN_REFERRER_ADDRESS || 'Not set'}</p>
          </div>
        </div>

        {/* Test Button */}
        <Button
          onClick={() => setIsModalOpen(true)}
          disabled={!connectedAddress}
          className="w-full h-12 font-bold uppercase text-lg"
        >
          {connectedAddress ? 'Open Pack Minting Modal' : 'Connect Wallet First'}
        </Button>

        {/* Instructions */}
        <div className="p-4 border-1 border-yellow-300 bg-yellow-50 text-left">
          <h3 className="font-bold uppercase text-sm mb-2">Test Instructions:</h3>
          <ul className="text-xs space-y-1">
            <li>• Connect your wallet first</li>
            <li>• Click "Open Pack Minting Modal" to test the component</li>
            <li>• Enter number of packs (e.g., "1", "5", "10")</li>
            <li>• Check if mint price calculation works</li>
            <li>• Test form validation and error handling</li>
            <li>• Verify GEO theme styling</li>
            <li>• Test modal close/cancel functionality</li>
            <li>• Packs will be minted to your connected wallet address</li>
          </ul>
        </div>

        {/* Info */}
        <div className="p-4 border-1 border-blue-300 bg-blue-50">
          <h3 className="font-bold uppercase text-sm text-blue-600 mb-2">ℹ️ Live Testing:</h3>
          <p className="text-xs text-blue-600">
            Using real drop contract address.
            Price calculations will work with actual on-chain data.
            Connect wallet to test real minting functionality.
          </p>
        </div>
      </div>

      {/* Buy Modal Component */}
      <BuyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tokenAddress={testTokenAddress}
        creatorAddress={testCreatorAddress}
      />
    </div>
  )
}