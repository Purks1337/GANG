# Gemini Project Analysis: gang-ground

## 1. Project Overview

**Project:** `gang-ground` is the MVP of a niche clothing e-commerce store.
**Goal:** To quickly launch a visually-driven online shop based precisely on a Figma design, including a light/dark theme, and core e-commerce functionality.
**Architecture:** Modern Headless (Decoupled) architecture.

---

## 2. Tech Stack & Architecture

### Frontend (This Repository)
- **Framework:** Next.js 15.5.0 (for SSR, SEO, and performance)
- **Library:** React 19.1.0
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
  - **Configuration:** JIT mode, `class`-based dark mode.
  - **Theme:** Custom colors are defined via CSS variables (e.g., `var(--background)`), indicating a dynamic theme structure.
- **State Management:** React Context API is used for managing the shopping cart (`CartContext.tsx`) and theme (`ThemeContext.tsx`).
- **Hosting:** Vercel

### Backend (External)
- **CMS:** WordPress
- **E-commerce:** WooCommerce plugin
- **API:** WPGraphQL for data exchange with the frontend.
- **Hosting:** Standard PHP hosting.

### Integrations
- **Payment Gateway:** ЮKassa or Tinkoff (via WooCommerce plugin).
- **Shipping:** CDEK (via WooCommerce plugin).

---

## 3. Key Features & Business Logic

- **Sitemap:**
  - `/`: Main page
  - `/catalog`: Product catalog
  - `/products/:slug`: Product detail page
  - `/cart`: Shopping cart
  - `/checkout`: Checkout page (to be implemented)
  - Info pages: `/about`, `/collaborations`, `/contacts`
- **Product Catalog:** A simple, single-category grid of products.
- **Product Detail Page (PDP):** Includes an image gallery, description, price, and a mandatory size selector.
- **Shopping Cart:** Users can add/remove items, change quantities, and see the total price. Cart state is persisted in `localStorage`.
- **Theme Switching:** A Day/Night theme toggle is a key feature.
- **Data Model:** The main entities are `Product`, `ProductVariation` (a product with a specific size, price, and stock), `Order`, and `OrderItem`.

---

## 4. Development & Tooling

- **Package Manager:** npm
- **Scripts:**
  - `npm run dev`: Starts the development server.
  - `npm run build`: Creates a production build.
  - `npm run start`: Starts the production server.
  - `npm run lint`: Runs ESLint for code analysis.
- **Path Aliases:** The alias `@/*` is configured to point to the `src/*` directory.
- **Linting:** ESLint is configured for this project.

---

## 5. Design & Styling

- **Source of Truth:** A Figma design file dictates all visual aspects.
- **Colors:**
  - **Dark Theme:** Background `#141414`, Text `#ffffff`.
  - **Light Theme:** Background `#ffffff`, Text `#000000`.
  - **Accent Color:** `#3ACB00` (brand green).
- **Key Dimensions (from Figma):**
  - **Product Card:** 379x540px
  - **Catalog Grid:** 3 columns on desktop with 20px horizontal and 64px vertical gaps. Max container width is 1178px.

---

## 6. Testing

- **Strategy:** Manual testing based on the `ТЕСТИРОВАНИЕ.md` document.
- **Key Test Cases:**
  - **Catalog:** Verify grid layout, theme switching, and hover effects.
  - **Navigation:** Ensure routing between pages works correctly.
  - **PDP:** Test image gallery, size selection logic (some sizes are disabled), and "add to cart" functionality.
  - **Cart:** Check quantity updates, total price calculation, and item removal.
  - **Responsiveness:** Test on mobile, tablet, and desktop breakpoints.
  - **Data Persistence:** Verify that the cart state is saved across page reloads.

---

## 7. Communication

- **Primary Language:** All communication should be in **Russian**.
