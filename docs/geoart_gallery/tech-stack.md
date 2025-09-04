# Tech Stack Documentation

## Final Agreed Stack (KISS Principle)

### Frontend Framework
- **Next.js 15+** with TypeScript
- **App Router** (single page application)
- **Static export** capability for deployment flexibility

### Web3 Integration
- **Wagmi v2** - Complete Web3 React hooks (replaces ethers.js)
- **RainbowKit** - Wallet connection UI
- **Base Network** - Chain ID 8453 only

### Styling & UI Components
- **Tailwind CSS** - Utility-first, minimal setup
- **shadcn/ui** - High-quality, customizable components
- **Google Fonts** - League Spartan (headlines) + Sanchez (body text)
- **Flat White & Obsidian** - No gradients, shadows, or 3D effects
- **Radix UI** - Accessible primitives (via shadcn)

### Data & API
- **VibeMarket API** - NFT metadata and collection data
- **Native fetch** - No additional HTTP client needed
- **React built-in state** - No external state management

### Animations & Effects
- **GSAP (minimal)** - Only basic scroll effects, no complex animations
- **CSS Animations** - For simple fade/slide effects
- **KISS approach** - Simple parallax only, no stagger/complex timelines

### Development Tools
- **TypeScript** - Type safety
- **ESLint** - Code quality
- **Prettier** - Code formatting

## Why These Choices

### Wagmi over Ethers.js
- ✅ Built-in React hooks
- ✅ Better TypeScript support
- ✅ Handles wallet connection state
- ✅ Built-in transaction management
- ✅ Less boilerplate code

### No Additional State Management
- ✅ React built-in state sufficient for simple app
- ✅ Wagmi handles Web3 state
- ✅ Fewer dependencies to maintain

### shadcn/ui + Tailwind CSS
- ✅ Pre-built accessible components
- ✅ Consistent design system
- ✅ Easy customization with CSS variables
- ✅ Perfect for minimalist white/obsidian theme
- ✅ Copy/paste components (no runtime dependency)
- ✅ Built on Radix UI primitives

## Dependencies
```json
{
  "next": "^15.0.0",
  "react": "^18.0.0",
  "typescript": "^5.0.0",
  "wagmi": "^2.0.0",
  "@rainbow-me/rainbowkit": "^2.0.0",
  "tailwindcss": "^3.0.0",
  "gsap": "^3.12.0",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0",
  "@radix-ui/react-*": "various"
}
```

**Note**: shadcn/ui components are copied into your codebase, not installed as dependencies. Only the underlying Radix UI primitives and utility packages are added as dependencies.