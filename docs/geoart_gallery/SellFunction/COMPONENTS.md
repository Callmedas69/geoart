# Sell Components - Simple Interfaces

## SellButton Component

### Single Responsibility
Sell one NFT with optimal UX (single signature preferred)

### Props (Keep It Simple)
```typescript
interface SellButtonProps {
  nft: NFTItem
  onSuccess: () => void
  disabled?: boolean
}
```

### Core Logic (Simplified)
```typescript
const SellButton = ({ nft, onSuccess, disabled }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { sellNFT } = useSell()

  const handleSell = async () => {
    setIsLoading(true)
    try {
      await sellNFT(nft.tokenId)
      onSuccess()
    } catch (error) {
      // Simple error handling
      console.error('Sell failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleSell} disabled={disabled || isLoading}>
      {isLoading ? 'Selling...' : 'SELL'}
    </Button>
  )
}
```

---

## BatchSellButton Component

### Single Responsibility
Sell multiple NFTs with single signature when possible

### Props (Keep It Simple)
```typescript
interface BatchSellButtonProps {
  selectedNFTs: NFTItem[]
  onComplete: () => void
  disabled?: boolean
}
```

### Core Logic (Simplified)
```typescript
const BatchSellButton = ({ selectedNFTs, onComplete, disabled }) => {
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const { batchSellNFTs } = useSell()

  const handleBatchSell = async () => {
    const tokenIds = selectedNFTs.map(nft => nft.tokenId)
    setProgress({ current: 0, total: tokenIds.length })
    
    try {
      await batchSellNFTs(tokenIds, (current) => {
        setProgress(prev => ({ ...prev, current }))
      })
      onComplete()
    } catch (error) {
      console.error('Batch sell failed:', error)
    }
  }

  return (
    <Button onClick={handleBatchSell} disabled={disabled}>
      {progress.total > 0 
        ? `Selling ${progress.current}/${progress.total}...`
        : `SELL ALL (${selectedNFTs.length})`
      }
    </Button>
  )
}
```

---

## useSell Hook

### Single Responsibility
Handle contract interactions for selling NFTs

### Interface (Keep It Simple)
```typescript
interface UseSell {
  sellNFT: (tokenId: string) => Promise<void>
  batchSellNFTs: (tokenIds: string[], onProgress?: (current: number) => void) => Promise<void>
  isLoading: boolean
}
```

### Core Logic (Simplified)
```typescript
const useSell = () => {
  const { address } = useAccount()
  const { writeContract } = useWriteContract()
  const [isLoading, setIsLoading] = useState(false)

  const sellNFT = async (tokenId: string) => {
    await writeContract({
      address: CONTRACTS.GEO_ART,
      abi: boosterDropV2Abi,
      functionName: 'sellAndClaimOffer',
      args: [BigInt(tokenId)]
    })
  }

  const batchSellNFTs = async (tokenIds: string[], onProgress) => {
    const tokenIdsBigInt = tokenIds.map(id => BigInt(id))
    
    try {
      // Try batch function first (single signature)
      await writeContract({
        address: CONTRACTS.GEO_ART,
        abi: boosterDropV2Abi,
        functionName: 'sellAndClaimOfferBatch',
        args: [tokenIdsBigInt]
      })
    } catch (error) {
      // Fallback: sell one by one
      for (let i = 0; i < tokenIds.length; i++) {
        await sellNFT(tokenIds[i])
        onProgress?.(i + 1)
      }
    }
  }

  return { sellNFT, batchSellNFTs, isLoading }
}
```

---

## File Structure
```
components/
├── YourNFTs.tsx (simplified)
└── sell/
    ├── SellButton.tsx
    ├── BatchSellButton.tsx
    └── useSell.tsx
```

**KISS Applied:** Each component has one clear job, simple props, minimal state.