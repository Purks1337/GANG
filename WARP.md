# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Gang Ground is a Next.js 15 React application for an e-commerce/catalog platform featuring a modern design with glassmorphism UI elements. The app supports both light and dark themes with a Russian language interface.

## Development Commands

### Core Development
```bash
# Start development server (runs on localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

### Testing & Quality
```bash
# Type checking
npx tsc --noEmit

# ESLint with auto-fix
npx eslint . --fix

# Check for unused dependencies
npx depcheck
```

## Architecture Overview

### App Router Structure
The project uses Next.js 15 App Router with the following page structure:
- `/` - Home page with centered logo and theme switcher
- `/catalog` - Product catalog with grid layout
- `/history` - History page (placeholder)
- `/collaborations` - Collaborations page (placeholder)  
- `/contacts` - Contacts page (placeholder)

### Component Architecture

**Layout Components:**
- `Header` - Theme switcher and cart, positioned at top with mobile/desktop responsive design
- `Navigation` - Bottom navigation with glassmorphism styling, mobile overlay menu
- `MainPage` - Landing page with background image and centered logo

**Feature Components:**  
- `Catalog` - Product grid container with hardcoded product data
- `ProductCard` - Individual product display with image, name, and price

### Theme System

The app uses a sophisticated CSS custom property-based theme system:

**Theme Variables (`globals.css`):**
- `--overlay-opacity`: Controls background overlay (0 for light, 0.5 for dark)
- `--logo-glow-opacity`: Controls logo glow effect (1 for light, 0 for dark)  
- `--glass-tint`: Glass panel background color (#000000)
- Brand color: `#3ACB00` (green accent)

**Theme Utilities (`utils/theme.ts`):**
- `applyTheme()` - Applies theme by adding/removing CSS classes
- `getStoredTheme()` - Retrieves user's theme preference from localStorage
- `setStoredTheme()` - Persists theme to both localStorage and cookie for SSR

### Styling Architecture

**Technology Stack:**
- Tailwind CSS v4 (with inline config)
- CSS custom properties for theme variables
- Glassmorphism effects with backdrop-blur
- Montserrat font from Google Fonts

**Key Design Patterns:**
- Glass panels with `bg-glass-tint/40 backdrop-blur-md border border-white/10`
- Brand green (`#3ACB00`) for accents and active states
- Fixed positioning for header/navigation with safe area support
- Responsive breakpoints: mobile-first, sm (tablet), md/lg/xl (desktop)

### State Management

Uses React's built-in state management:
- `useState` for component-level state (menu toggles, theme state)
- `useEffect` for theme initialization and accessibility focus management
- No external state management library

### Navigation & Routing

- Next.js App Router for file-based routing
- `usePathname` hook for active navigation state
- Mobile-first navigation with overlay menu and focus trap
- Accessibility features: ESC to close, tab navigation, ARIA attributes

## Key Development Notes

### Mobile-First Responsive Design
The UI is built mobile-first with careful attention to:
- Safe area insets for notched devices
- Touch-friendly button sizes (minimum 44px touch targets)
- Glassmorphism effects that work across themes

### Accessibility Implementation
Components include comprehensive a11y features:
- Focus traps in modal overlays
- ARIA labels and roles
- Keyboard navigation (Tab, Shift+Tab, Escape)
- Screen reader friendly markup

### Performance Considerations
- Next.js Image component with proper `sizes` and `priority` props
- Client-side theme script to prevent flash of unstyled content
- CSS transitions for smooth theme switching

### Code Organization
- Components use index.tsx barrel exports
- Absolute imports with `@/*` alias pointing to `src/*`
- TypeScript strict mode enabled
- ESLint configured for Next.js and TypeScript

## File Structure Notes

```
src/
├── app/                 # Next.js App Router pages
│   ├── layout.tsx      # Root layout with theme script
│   ├── page.tsx        # Home page
│   ├── globals.css     # Global styles and theme variables
│   └── [page]/         # Individual route pages
├── components/         # React components (barrel exports)
│   ├── Header/         # Theme switcher and cart
│   ├── Navigation/     # Bottom nav with mobile overlay
│   ├── MainPage/       # Landing page component
│   ├── Catalog/        # Product catalog container
│   └── ProductCard/    # Individual product component
├── utils/              # Utility functions
│   └── theme.ts        # Theme management utilities
└── assets/             # Static assets (SVGs, images)
```

The project follows Next.js conventions with TypeScript, uses component-based architecture, and implements a custom theme system with glassmorphism design elements.
