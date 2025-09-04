# GSAP Minimal Implementation (KISS Approach)

## Simple Animation Strategy

**APPROACH: Use GSAP but keep it EXTREMELY simple - no complex animations.**

### GSAP KISS Principles:
- ✅ **Only basic parallax** - Simple Y movement
- ✅ **No stagger animations** - Too complex  
- ✅ **No complex timelines** - Single tweens only
- ✅ **No multiple properties** - Y movement only

### Minimal GSAP Implementation
```typescript
// src/components/Hero.tsx - EXTREMELY simple
import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // ONLY basic parallax - nothing else
      gsap.to('.hero-image', {
        y: -50, // Simple movement
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          scrub: 1 // Smooth binding
        }
      })
    }, ref)
    
    return () => ctx.revert() // Cleanup
  }, [])

  return (
    <div ref={ref} className="hero-section">
      <div className="hero-image">
        {/* NFT images */}
      </div>
    </div>
  )
}
```

### 3. Performance Optimizations

#### Bundle Size Optimization
```typescript
// Import only what you need
import { gsap } from 'gsap/dist/gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

// For high-performance repeated updates
const quickY = gsap.quickTo('.parallax-element', 'y', { 
  duration: 0.3,
  ease: 'power2.out'
})

// Immediate property changes (no animation)
gsap.set('.hero-images', { 
  transformOrigin: 'center center',
  force3D: true // Hardware acceleration
})
```

#### Mobile Performance
```typescript
// Reduced motion for mobile
const isMobile = window.innerWidth < 768

gsap.to('.parallax-element', {
  y: isMobile ? -20 : -100, // Less movement on mobile
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero-section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: isMobile ? 0.5 : 1
  }
})
```

### 4. Flat Design Compatible Effects

#### Simple Parallax (No 3D)
```typescript
// Perfect for flat minimalist design
gsap.to('.bg-layer', { y: -50, scrollTrigger: { scrub: true }})
gsap.to('.mid-layer', { y: -25, scrollTrigger: { scrub: true }})
gsap.to('.front-layer', { y: 0, scrollTrigger: { scrub: true }})
```

#### Fade & Scale (Flat)
```typescript
// Entrance animations for NFT cards
gsap.fromTo('.nft-card',
  { opacity: 0, scale: 0.95 },
  { 
    opacity: 1, 
    scale: 1,
    duration: 0.6,
    ease: 'power1.out',
    stagger: 0.1
  }
)
```

## Key Principles for GEO ART

### ✅ DO:
- Always use `gsap.context()` for React cleanup
- Use `useLayoutEffect` not `useEffect`
- Register plugins once at app level
- Use `scrub` for smooth scroll binding
- Implement stagger for multiple elements
- Optimize for mobile performance

### ❌ DON'T:
- Use 3D transforms (conflicts with flat design)
- Forget cleanup in React components
- Over-animate (keep it minimal)
- Use complex easing (power2.out is perfect)
- Animate too many properties simultaneously

## Implementation Timeline
- **Phase 2**: Hero GSAP scroll effects (day 2-3)
- **Total GSAP work**: ~4-6 hours within Phase 2
- **Testing**: Mobile performance validation

Perfect for your flat, minimalist, high-performance NFT showcase! 🚀