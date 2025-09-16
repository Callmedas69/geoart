# Image Handling Strategy

## Hybrid Approach (Recommended)

### Static UI Assets → Local Storage (`public/`)
```
public/
├── logo.svg              // GEO ART logo
├── pack.png              // Pack design
├── placeholder.svg       // NFT fallback
└── loading.svg           // Loading state
```

### NFT Images → On-Chain/IPFS (Dynamic)
- **Source**: VibeMarket API → Metadata URI → IPFS/Arweave
- **Caching**: Next.js Image optimization
- **Fallbacks**: Local placeholder images

## Implementation Strategy

### 1. Static Asset Usage
```typescript
// components/Header/Logo.tsx
import Image from 'next/image'
import logo from '@/public/assets/logo/geoart-logo.svg'

export function Logo() {
  return (
    <Image src={logo} alt="GEO ART" width={120} height={40} priority />
  )
}
```

### 2. NFT Image Component
```typescript
// components/NFTImage.tsx
import { useState } from 'react'
import Image from 'next/image'

export function NFTImage({ tokenId, metadata, className }) {
  const [imageError, setImageError] = useState(false)
  
  return (
    <Image
      src={imageError ? '/assets/ui/placeholder.svg' : metadata.image}
      alt={metadata.name}
      className={className}
      onError={() => setImageError(true)}
      width={300}
      height={300}
    />
  )
}
```

### 3. Data Flow
```
1. Fetch NFT metadata from VibeMarket API
2. Extract image URL from metadata.image
3. Next.js Image component handles:
   - Automatic optimization
   - Lazy loading
   - Responsive sizing
4. Fallback to local placeholder on error
```

## Performance Benefits

### Local Assets (UI)
- ✅ **Instant loading** - No network requests
- ✅ **Version controlled** - Consistent with deployments
- ✅ **Optimized** - Next.js automatic optimization
- ✅ **Reliable** - No external dependencies

### On-Chain Images (NFTs)
- ✅ **Authentic** - Verified ownership and metadata
- ✅ **Decentralized** - IPFS/Arweave permanence
- ✅ **Dynamic** - Real-time collection updates
- ✅ **Cacheable** - Next.js caches optimized versions

## Error Handling Strategy

1. **Primary**: Fetch from metadata URI
2. **Secondary**: Retry with different gateway
3. **Fallback**: Show placeholder with "Image not available"
4. **UX**: Never break the interface

## Security Considerations

- ✅ **Input validation** on image URLs
- ✅ **CSP headers** for allowed image sources
- ✅ **Rate limiting** on image requests
- ✅ **Sanitization** of metadata content

This hybrid approach provides the best of both worlds: fast UI with authentic NFT data.