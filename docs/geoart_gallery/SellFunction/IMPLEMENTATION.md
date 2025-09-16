# Implementation Steps - KISS Approach

## Step 1: Create Simple Hook (useSell.tsx)

### Priority 1: Basic Functionality
```typescript
export const useSell = () => {
  const { writeContract } = useWriteContract()
  const [isLoading, setIsLoading] = useState(false)

  const sellNFT = async (tokenId: string) => {
    setIsLoading(true)
    try {
      await writeContract({
        address: CONTRACTS.GEO_ART,
        abi: boosterDropV2Abi,
        functionName: 'sellAndClaimOffer',
        args: [BigInt(tokenId)]
      })
    } finally {
      setIsLoading(false)
    }
  }

  return { sellNFT, isLoading }
}
```

### Priority 2: Add Batch Support
```typescript
const batchSellNFTs = async (tokenIds: string[]) => {
  const tokenIdsBigInt = tokenIds.map(id => BigInt(id))
  
  // Try batch first
  try {
    await writeContract({
      address: CONTRACTS.GEO_ART,
      abi: boosterDropV2Abi,
      functionName: 'sellAndClaimOfferBatch',
      args: [tokenIdsBigInt]
    })
  } catch (error) {
    // Fallback: one by one
    for (const tokenId of tokenIds) {
      await sellNFT(tokenId)
    }
  }
}
```

## Step 2: Create SellButton Component

### Basic Implementation
```typescript
export const SellButton = ({ nft, onSuccess, disabled }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { sellNFT } = useSell()
  
  const handleSell = async () => {
    setIsLoading(true)
    try {
      await sellNFT(nft.tokenId)
      onSuccess()
    } catch (error) {
      console.error('Sell failed:', error)
      // Show error toast/message
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleSell} 
      disabled={disabled || isLoading}
      variant="destructive"
      size="sm"
    >
      {isLoading ? 'Selling...' : 'SELL'}
    </Button>
  )
}
```

## Step 3: Create BatchSellButton Component

### Basic Implementation
```typescript
export const BatchSellButton = ({ selectedNFTs, onComplete, disabled }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { batchSellNFTs } = useSell()

  const handleBatchSell = async () => {
    setIsLoading(true)
    try {
      const tokenIds = selectedNFTs.map(nft => nft.tokenId)
      await batchSellNFTs(tokenIds)
      onComplete()
    } catch (error) {
      console.error('Batch sell failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleBatchSell} 
      disabled={disabled || isLoading || selectedNFTs.length === 0}
      variant="destructive"
    >
      {isLoading 
        ? 'Selling...' 
        : `SELL ALL (${selectedNFTs.length})`
      }
    </Button>
  )
}
```

## Step 4: Integrate into YourNFTs.tsx

### Replace Existing Sell Logic
```typescript
// Remove current batch sell state and logic
// Replace with simple components

export function YourNFTs() {
  const [selectedNFTs, setSelectedNFTs] = useState<Set<string>>(new Set())
  const [batchMode, setBatchMode] = useState(false)
  
  // ... existing NFT loading logic ...

  return (
    <section className="py-16 bg-white">
      {/* ... existing header ... */}
      
      {/* Simplified batch controls */}
      {nfts.length > 0 && (
        <div className="flex gap-4 mb-6">
          <Button
            variant={batchMode ? "default" : "outline"}
            onClick={() => setBatchMode(!batchMode)}
          >
            {batchMode ? "Exit Batch" : "Batch Mode"}
          </Button>
          
          {batchMode && (
            <BatchSellButton 
              selectedNFTs={Array.from(selectedNFTs).map(id => 
                nfts.find(nft => nft.id === id)!
              ).filter(Boolean)}
              onComplete={() => {
                setSelectedNFTs(new Set())
                setBatchMode(false)
                refreshNFTData()
              }}
            />
          )}
        </div>
      )}

      {/* NFT Grid with SellButton */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {nfts.map((nft) => (
          <NFTCard 
            key={nft.id} 
            nft={nft}
            showActions={!batchMode}
            batchMode={batchMode}
            isSelected={selectedNFTs.has(nft.id)}
            onToggleSelection={() => toggleSelection(nft.id)}
            sellButton={
              !batchMode && (
                <SellButton 
                  nft={nft}
                  onSuccess={refreshNFTData}
                />
              )
            }
          />
        ))}
      </div>
    </section>
  )
}
```

## Step 5: Testing Checklist

### Individual Sell
- [ ] Single NFT sells successfully
- [ ] Loading state shows correctly  
- [ ] Success triggers refresh
- [ ] Error handling works
- [ ] Button disabled during transaction

### Batch Sell
- [ ] Multiple NFTs sell in one transaction (if supported)
- [ ] Falls back to sequential sells if needed
- [ ] Progress indication works
- [ ] Selection clears after success
- [ ] Stops on error with clear message

### Integration
- [ ] YourNFTs.tsx reduced in complexity
- [ ] No hardcoded token amounts
- [ ] Clean separation of concerns
- [ ] Reusable components

---

**Implementation Priority:** Start simple, add features incrementally, test thoroughly