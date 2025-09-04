# Design System - GEO ART

## Color Palette

### Primary Colors
- **Background**: `#FFFFFF` (Pure White)
- **Foreground**: `#0F172A` (Obsidian - Tailwind slate-900)
- **Primary**: `#0F172A` (Obsidian for buttons and emphasis)
- **Primary Foreground**: `#FAFAFA` (Nearly white text on dark buttons)

### Supporting Colors
- **Secondary**: `#F8FAFC` (Very light gray - Tailwind slate-50)
- **Muted**: `#F1F5F9` (Light gray - Tailwind slate-100)
- **Border**: `#E2E8F0` (Border gray - Tailwind slate-200)
- **Ring**: `#0F172A` (Obsidian for focus rings)

## Typography

### Font Families (Google Fonts)
- **Primary/Headlines**: League Spartan
  - Modern, geometric sans-serif
  - Perfect for headlines, buttons, and emphasis
  - Clean, professional appearance
- **Secondary/Body**: Sanchez
  - Slab serif with character
  - Excellent readability for body text
  - Adds warmth to the minimalist design

### Font Implementation
```css
/* Import from Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@300;400;500;600;700&family=Sanchez:ital,wght@0,400;1,400&display=swap');

/* CSS Variables */
:root {
  --font-heading: 'League Spartan', sans-serif;
  --font-body: 'Sanchez', serif;
}
```

### Text Colors
- **Primary Text**: Obsidian (`#0F172A`)
- **Secondary Text**: Slate-600 (`#475569`)
- **Muted Text**: Slate-500 (`#64748B`)

### Typography Scale (KISS)
- **Headline**: League Spartan, 32px, SemiBold (600) - Logo, main titles
- **Button**: League Spartan, 16px, Medium (500) - All buttons
- **Body**: Sanchez, 16px, Regular (400) - All text content

## Component Styling Guidelines

### Flat Design Guidelines
- **NO gradients** - Solid colors only
- **NO shadows** - Pure flat elements
- **NO 3D effects** - Completely flat
- **Clean edges** - Sharp corners or consistent border-radius
- **High contrast** - White/obsidian only

### Buttons (Flat)
- **Primary**: Solid obsidian background, white text, no shadow
- **Secondary**: White background, solid obsidian border, obsidian text
- **Ghost**: Transparent background, obsidian text

### Cards (Flat)
- **Background**: Pure white
- **Border**: Solid light gray (`#E2E8F0`) - 1px only
- **NO shadows** - Completely flat
- **Content**: Obsidian text

### Layout (Flat Minimalist)
- **8px grid system** - Consistent spacing
- **Solid borders only** - No decorative elements  
- **NO visual effects** - No hover shadows, gradients, or animations
- **Pure geometric shapes** - Rectangles, clean lines

## Implementation in shadcn/ui & Next.js

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        'heading': ['League Spartan', 'sans-serif'],
        'body': ['Sanchez', 'serif'],
      }
    }
  }
}
```

### Component Usage
- **Buttons**: `font-heading` (League Spartan)
- **Headlines**: `font-heading` (League Spartan) 
- **Body Text**: `font-body` (Sanchez)
- **Cards**: Mixed - headlines use League Spartan, descriptions use Sanchez

The complete flat design system provides:
- **Pure flat aesthetic** - No gradients, shadows, or 3D effects
- **Clean, high-contrast** - White/obsidian accessibility
- **Modern minimalist** - Geometric shapes, solid colors only
- **Professional web3 interface** - Perfect for NFT marketplace