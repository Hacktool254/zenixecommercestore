# Dev Rules & Build Phases — Zenix Electronics

**Status Key:**

- `[ ]` Not started
- `[/]` In progress
- `[x]` Completed

---

## PHASE 1 — Project Foundation & Setup

### 1.1 Initialize Next.js Project

- [x] Create Next.js 15 app with TypeScript and App Router: `npx create-next-app@latest . --typescript --tailwind --app --eslint --src-dir=false --import-alias="@/*"`
- [x] Verify project runs: `npm run dev`
- [x] Configure `next.config.ts` — add Cloudinary domain to `images.remotePatterns`
- [x] Set up `tsconfig.json` strict mode

### 1.2 Install All Dependencies

- [x] Install production packages: `npm install convex @convex-dev/auth zustand @tanstack/react-query react-hook-form @hookform/resolvers zod lucide-react sonner clsx tailwind-merge class-variance-authority next-cloudinary cloudinary`
- [x] Install Radix UI packages: `npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-slider @radix-ui/react-tabs @radix-ui/react-switch @radix-ui/react-avatar`
- [x] Install dev packages: `npm install -D prettier prettier-plugin-tailwindcss husky lint-staged`

### 1.3 Tailwind CSS v4 Setup

- [x] Configure `globals.css` with CSS variables for the full Zenix color system (all tokens from design.md)
- [x] Add Space Grotesk + Inter fonts via `next/font/google`
- [x] Configure Tailwind theme extension with Zenix color tokens

### 1.4 shadcn/ui Setup

- [x] Initialize shadcn: `npx shadcn@latest init` — choose dark theme, CSS variables
- [x] Add base components: `npx shadcn@latest add button badge input label select sheet dialog tabs skeleton avatar dropdown-menu`
- [x] Customize component styles to match Zenix design system

### 1.5 Convex Setup

- [x] Create Convex account and project at convex.dev
- [x] Initialize Convex in project: `npx convex dev`
- [x] Set up `NEXT_PUBLIC_CONVEX_URL` in `.env.local`
- [x] Wrap app with `ConvexClientProvider` in `app/layout.tsx`

### 1.6 Convex Auth Setup

- [x] Install and configure Convex Auth: follow `@convex-dev/auth` docs
- [x] Set `JWKS_PRIVATE_KEY` and `SITE_URL` in env
- [x] Configure email/password provider
- [ ] Test signup and login flow

### 1.7 Project Structure

- [x] Create all folders: `components/`, `lib/`, `stores/`, `types/`, `convex/`
- [x] Create `lib/utils.ts` with `cn()` helper (clsx + tailwind-merge)
- [x] Set up ESLint + Prettier config with `prettier-plugin-tailwindcss`
- [x] Set up Husky pre-commit hook with lint-staged

### 1.8 Environment Variables

- [x] Create `.env.local` with all variables from techstack.md
- [x] Create `.env.example` with placeholder values (commit this, not `.env.local`)
- [x] Add `.env.local` to `.gitignore`

---

## PHASE 2 — Convex Database Schema & Backend

### 2.1 Define Schema

- [x] Write `convex/schema.ts` — all tables: users, products, categories, orders, cartItems, wishlists, addresses
- [x] Run `npx convex dev` and verify schema deploys without errors
- [x] Define all TypeScript types in `types/index.ts` from Convex schema

### 2.2 Product Queries & Mutations

- [x] `convex/products.ts` — `getAllProducts` query (with optional category/condition filter args)
- [x] `convex/products.ts` — `getProductBySlug` query
- [x] `convex/products.ts` — `getFeaturedProducts` query
- [x] `convex/products.ts` — `getHotDeals` query
- [x] `convex/products.ts` — `getNewArrivals` query
- [x] `convex/products.ts` — `searchProducts` query (text search on name/description)
- [x] `convex/products.ts` — `createProduct` mutation (admin only)
- [x] `convex/products.ts` — `updateProduct` mutation (admin only)
- [x] `convex/products.ts` — `deleteProduct` mutation (admin only)
- [x] `convex/products.ts` — `updateStock` mutation

### 2.3 Cart Queries & Mutations

- [x] `convex/cart.ts` — `getCartItems` query (by userId)
- [x] `convex/cart.ts` — `addToCart` mutation
- [x] `convex/cart.ts` — `updateCartQuantity` mutation
- [x] `convex/cart.ts` — `removeFromCart` mutation
- [x] `convex/cart.ts` — `clearCart` mutation (called after successful order)

### 2.4 Order Queries & Mutations

- [x] `convex/orders.ts` — `createOrder` mutation
- [x] `convex/orders.ts` — `getOrderById` query
- [x] `convex/orders.ts` — `getUserOrders` query
- [x] `convex/orders.ts` — `getAllOrders` query (admin only)
- [x] `convex/orders.ts` — `updateOrderStatus` mutation (admin only)
- [x] `convex/orders.ts` — `updatePaymentStatus` mutation (called by Paystack webhook)

### 2.5 Wishlist & Address

- [x] `convex/wishlists.ts` — `getWishlist`, `addToWishlist`, `removeFromWishlist`
- [x] `convex/addresses.ts` — `getUserAddresses`, `addAddress`, `updateAddress`, `deleteAddress`, `setDefaultAddress`

### 2.6 Seed Data

- [x] Create `convex/seed.ts` — seed 15 sample products across all categories with placeholder images
- [ ] Run seed script to populate dev database

---

## PHASE 3 — Core Layout & Navigation

### 3.1 Root Layout

- [ ] `app/layout.tsx` — wrap with `ConvexClientProvider`, `TanStackQueryProvider`, `Toaster` (Sonner)
- [ ] Add font variables to html element
- [ ] Set dark background color on body

### 3.2 Header Component

- [ ] `components/layout/Header.tsx` — logo, nav links, search icon, account icon, cart icon with item count
- [ ] Sticky positioning with `backdrop-filter: blur(12px)` and semi-transparent bg
- [ ] Cart item count badge on cart icon (from Zustand cart store)
- [ ] Active link highlighting
- [ ] Responsive: hide nav links on mobile, show hamburger

### 3.3 Mobile Bottom Navigation

- [ ] `components/layout/BottomNav.tsx` — Home, Shop, Deals, Account, Cart (5 icons)
- [ ] Fixed bottom, visible only on mobile (hidden md:)
- [ ] Active state with orange accent

### 3.4 Footer Component

- [ ] `components/layout/Footer.tsx` — logo, nav links, address (Accra Road, Cookie House, Nairobi), social links, copyright
- [ ] 3-column grid on desktop, stacked on mobile

### 3.5 WhatsApp FAB

- [ ] `components/shared/WhatsAppFAB.tsx` — fixed bottom-right button with WhatsApp green + pulse ring CSS animation
- [ ] Links to `https://wa.me/${WHATSAPP_NUMBER}`
- [ ] Hidden on checkout page

### 3.6 Route Groups & Layouts

- [ ] `app/(store)/layout.tsx` — includes Header, Footer, WhatsAppFAB, BottomNav
- [ ] `app/(auth)/layout.tsx` — minimal layout, centered card
- [ ] `app/admin/layout.tsx` — AdminSidebar + main content area, protected route
- [ ] `app/account/layout.tsx` — AccountSidebar + content area, protected route

### 3.7 Zustand Stores

- [ ] `stores/cart.store.ts` — items, addItem, removeItem, updateQuantity, clearCart, isDrawerOpen, openDrawer, closeDrawer, computed totals
- [ ] `stores/ui.store.ts` — isSearchOpen, comparisonList (up to 3 products), addToComparison, removeFromComparison

---

## PHASE 4 — Homepage

### 4.1 Hero Section

- [ ] `components/home/Hero.tsx` — full viewport height, two-column layout
- [ ] Left: animated headline with Framer Motion text reveal, subtext, two CTA buttons (Shop Now + View Deals)
- [ ] Right: floating product image (framer-motion y-axis loop animation)
- [ ] Background: circuit board SVG pattern (subtle, animated opacity)
- [ ] Mobile: single column, centered

### 4.2 Category Strip

- [ ] `components/home/CategoryStrip.tsx` — horizontal scrollable row with snap
- [ ] One card per category: icon + label
- [ ] Hover: orange underline + scale(1.05)
- [ ] Scroll reveal on enter

### 4.3 New Arrivals Section

- [ ] `components/home/NewArrivals.tsx` — "New Arrivals" section heading + "View All" link
- [ ] Grid of 4 product cards, fetched via `getNewArrivals` Convex query
- [ ] Stagger scroll reveal animation

### 4.4 Hot Deals Section

- [ ] `components/home/HotDeals.tsx` — orange accent section header
- [ ] Grid of 4 discounted products, fetched via `getHotDeals`
- [ ] Show original price struck through + sale price
- [ ] Shimmer badge animation on "Hot Deal" badge

### 4.5 WhatsApp CTA Banner

- [ ] `components/home/WhatsAppBanner.tsx` — dark card with text + WhatsApp button
- [ ] "Need help choosing? Chat with us instantly on WhatsApp"

### 4.6 Homepage Page

- [ ] `app/(store)/page.tsx` — compose all home sections
- [ ] Add `<Suspense>` boundaries with skeleton loaders for data-fetched sections
- [ ] Page metadata (title, description, OG tags)

---

## PHASE 5 — Product Listing & Detail

### 5.1 Product Card Component

- [ ] `components/products/ProductCard.tsx` — image, condition badge, name, price in KES, add to cart button, wishlist toggle, compare toggle
- [ ] Hover: lift + orange border glow (CSS transition)
- [ ] Out of stock: greyed image overlay + "Out of Stock" badge, disabled cart button
- [ ] KES price formatted with thousands separator (KES 45,000)

### 5.2 Product Grid

- [ ] `components/products/ProductGrid.tsx` — responsive grid 2/3/4 cols
- [ ] Stagger scroll reveal for cards
- [ ] Loading state: skeleton cards

### 5.3 Filters Component

- [ ] `components/products/Filters.tsx`:
  - Category checkboxes (All, iPhones, Mac, TVs, Audio, Gaming, Connectivity, Power)
  - Condition: Brand New | Ex UK (radio or toggle)
  - Price range slider (0 — 500,000 KES)
  - In Stock only toggle
- [ ] Desktop: sidebar left panel
- [ ] Mobile: bottom sheet (Radix Sheet component)
- [ ] Apply filters updates URL search params

### 5.4 Shop Page

- [ ] `app/(store)/shop/page.tsx` — filters sidebar + product grid
- [ ] Read filters from URL search params (shareable/bookmarkable filter URLs)
- [ ] Sort dropdown (Newest, Price Low-High, Price High-Low)
- [ ] Active filter chips above grid with remove button
- [ ] Page metadata

### 5.5 Category Page

- [ ] `app/(store)/shop/[category]/page.tsx` — pre-filtered to category
- [ ] Category hero banner with name and product count
- [ ] Generates static params for all categories

### 5.6 Product Detail Page

- [ ] `app/(store)/shop/[category]/[slug]/page.tsx`
- [ ] Image gallery: main image + thumbnail row, click to switch
- [ ] Condition badge, product name, KES price, stock status
- [ ] Quantity selector (1 to available stock)
- [ ] Add to Cart button (primary) + Add to Wishlist (icon button) + Compare (icon button)
- [ ] WhatsApp inquiry link: "Ask about this product"
- [ ] Specs table (from product.specs object)
- [ ] Full description
- [ ] Related products (same category)
- [ ] Structured data (JSON-LD Product schema for SEO)
- [ ] generateMetadata for SEO title/description per product

---

## PHASE 6 — Cart & Cart Drawer

### 6.1 Cart Drawer

- [ ] `components/cart/CartDrawer.tsx` — slides in from right, Framer Motion spring animation
- [ ] Backdrop blur overlay
- [ ] Cart items list with image, name, price, quantity controls, remove button
- [ ] Subtotal at bottom
- [ ] Checkout button → `/checkout`
- [ ] Empty state with "Start Shopping" link
- [ ] Controlled by Zustand `isDrawerOpen`

### 6.2 Cart Item Component

- [ ] `components/cart/CartItem.tsx` — product thumbnail, name, condition, price × quantity, +/- buttons, delete button
- [ ] Optimistic UI — quantity updates instantly, syncs to Convex

### 6.3 Cart Page

- [ ] `app/(store)/cart/page.tsx` — full-page cart view
- [ ] Same items list as drawer, but with more space
- [ ] Order summary card (subtotal, delivery fee, total)
- [ ] "Continue Shopping" + "Proceed to Checkout" buttons

### 6.4 Add to Cart Logic

- [ ] `addToCart` in Zustand store triggers Convex `addToCart` mutation for authenticated users
- [ ] For guests: cart lives in Zustand only (localStorage persist)
- [ ] On login: merge guest cart with server cart

---

## PHASE 7 — Authentication

### 7.1 Login Page

- [ ] `app/(auth)/login/page.tsx` — email + password form
- [ ] React Hook Form + Zod validation
- [ ] Error messages inline
- [ ] Link to register + forgot password
- [ ] Redirect to previous page or `/account` after login

### 7.2 Register Page

- [ ] `app/(auth)/register/page.tsx` — name, email, password, confirm password
- [ ] Zod schema validation
- [ ] Success → redirect to `/account`

### 7.3 Forgot Password Page

- [ ] `app/(auth)/forgot-password/page.tsx` — email input
- [ ] Sends reset email via Convex Auth

### 7.4 Auth Middleware

- [ ] `middleware.ts` — protect `/checkout`, `/account/*`, `/admin/*` routes
- [ ] Redirect unauthenticated users to `/auth/login?redirect=...`
- [ ] Redirect non-admin users away from `/admin/*`

---

## PHASE 8 — Checkout & Payments

### 8.1 Checkout Page Structure

- [ ] `app/(store)/checkout/page.tsx` — multi-step with progress indicator
- [ ] Step 1: Delivery address (existing saved addresses or new address form)
- [ ] Step 2: Order review (items, address, totals)
- [ ] Step 3: Payment (Paystack)

### 8.2 Paystack Integration

- [ ] `lib/paystack.ts` — initialize transaction, verify transaction functions
- [ ] Install Paystack inline JS: `@paystack/inline-js` or use redirect
- [ ] On "Pay Now": call `/api/paystack/initialize` route → get access code → trigger Paystack popup
- [ ] On success callback: verify transaction via `/api/paystack/verify/[reference]`
- [ ] Redirect to `/order/[id]` on confirmed payment

### 8.3 Paystack Webhook

- [ ] `app/api/paystack/webhook/route.ts` — verify HMAC signature
- [ ] Handle `charge.success` event → call `updatePaymentStatus` in Convex
- [ ] Handle `charge.failed` event → update order accordingly

### 8.4 Order Confirmation Page

- [ ] `app/(store)/order/[id]/page.tsx` — order number, items summary, delivery address, payment method, status
- [ ] "Continue Shopping" button
- [ ] Option to download/print receipt (future)

---

## PHASE 9 — User Account

### 9.1 Account Layout & Profile

- [ ] `app/account/layout.tsx` — sidebar with nav links
- [ ] `app/account/page.tsx` — profile info (name, email, phone), edit form

### 9.2 Orders History

- [ ] `app/account/orders/page.tsx` — list of all user orders
- [ ] Order card: order number, date, total, status badge, item thumbnails
- [ ] Click → order detail view

### 9.3 Wishlist

- [ ] `app/account/wishlist/page.tsx` — product grid of wishlisted items
- [ ] Remove from wishlist button on each card
- [ ] Add to cart directly from wishlist

### 9.4 Addresses

- [ ] `app/account/addresses/page.tsx` — list of saved addresses
- [ ] Add new address form (React Hook Form)
- [ ] Set default address
- [ ] Delete address

---

## PHASE 10 — Product Comparison

### 10.1 Comparison Logic

- [ ] Zustand `comparisonList` — max 3 products
- [ ] "Compare" button on product cards — toggles product in comparison list
- [ ] Floating comparison bar at bottom of page when 2+ products selected
- [ ] "Compare Now" button in floating bar → navigates to `/compare`

### 10.2 Comparison Page

- [ ] `app/(store)/compare/page.tsx` — side-by-side table
- [ ] Rows: Image, Name, Price, Condition, Category, Specs (all spec keys merged)
- [ ] Highlight best value (lowest price) in green
- [ ] "Add to Cart" button per column
- [ ] "Remove" button per column

---

## PHASE 11 — Admin Dashboard

### 11.1 Admin Layout

- [ ] `app/admin/layout.tsx` — sidebar navigation + top bar
- [ ] Sidebar: Dashboard, Products, Orders, Inventory, Back to Store
- [ ] Admin-only route protection (check user role in middleware)

### 11.2 Dashboard Overview

- [ ] `app/admin/page.tsx` — KPI cards: Total Orders, Total Revenue (KES), Total Products, Low Stock Items
- [ ] Recent orders table (last 10)
- [ ] Low stock alert list

### 11.3 Products Management

- [ ] `app/admin/products/page.tsx` — products table with search
- [ ] Columns: Image, Name, Category, Condition, Price, Stock, Status, Actions
- [ ] Edit button → `/admin/products/[id]`
- [ ] Delete button with confirmation dialog
- [ ] "Add Product" button → `/admin/products/new`

### 11.4 Product Form (Add/Edit)

- [ ] `app/admin/products/new/page.tsx` and `app/admin/products/[id]/page.tsx`
- [ ] Fields: Name, Slug (auto-generated from name), Category, Condition, Price, Compare-at Price, Description, Specs (key-value pairs), Stock, isActive, isFeatured, isHotDeal, isNewArrival
- [ ] Cloudinary image upload widget (multi-image, reorder, remove)
- [ ] React Hook Form + Zod validation
- [ ] Submit → Convex `createProduct` or `updateProduct` mutation

### 11.5 Orders Management

- [ ] `app/admin/orders/page.tsx` — all orders table
- [ ] Filter by status: All, Pending, Processing, Shipped, Delivered, Cancelled
- [ ] Click row → order detail modal
- [ ] Status dropdown to update order status inline

### 11.6 Inventory

- [ ] `app/admin/inventory/page.tsx` — all products with stock levels
- [ ] Visual indicator: green (≥10), amber (1-9), red (0 - Out of Stock)
- [ ] Inline stock update input field per product

---

## PHASE 12 — Supporting Pages

### 12.1 Delivery Info Page

- [ ] `app/(store)/delivery/page.tsx`
- [ ] Coverage areas in Nairobi
- [ ] Estimated delivery times
- [ ] Delivery fee structure
- [ ] Pickup option at Accra Road, Cookie House

### 12.2 About/Contact Page

- [ ] `app/(store)/about/page.tsx`
- [ ] Zenix story, location, contact info
- [ ] Google Maps embed for Accra Road, Nairobi
- [ ] Contact form (sends WhatsApp or email)

---

## PHASE 13 — SEO & Performance

### 13.1 Metadata

- [ ] Root layout metadata (title template, description, OG image)
- [ ] `generateMetadata` for product pages (name, description, price, image)
- [ ] `generateMetadata` for category pages
- [ ] Sitemap: `app/sitemap.ts` — generates URLs for all products and categories
- [ ] Robots: `app/robots.ts`

### 13.2 Structured Data

- [ ] Product JSON-LD schema on all product detail pages (name, price, availability, image)
- [ ] BreadcrumbList JSON-LD on product and category pages

### 13.3 Performance

- [ ] All product images via `next/image` with explicit width/height
- [ ] Cloudinary image URLs with `f_auto,q_auto` transformations
- [ ] Lazy load below-fold images
- [ ] `loading="eager"` on above-fold hero image
- [ ] Route-level code splitting (automatic with App Router)
- [ ] `<Suspense>` with skeletons for all data-fetched sections

### 13.4 Accessibility

- [ ] All images have descriptive `alt` text
- [ ] Focus ring visible on all interactive elements (orange outline)
- [ ] Form labels always associated with inputs
- [ ] Color contrast verified with WCAG 2.1 AA
- [ ] Keyboard navigation tested — cart, modals, dropdowns

---

## PHASE 14 — Testing & Launch Prep

### 14.1 Manual Testing Checklist

- [ ] Full purchase flow: browse → add to cart → checkout → M-Pesa payment → order confirmation
- [ ] Full purchase flow: browse → add to cart → checkout → card payment → order confirmation
- [ ] User registration → login → wishlist → account orders
- [ ] Admin: add product → verify appears on site
- [ ] Admin: update order status → verify user sees update
- [ ] Product comparison with 3 products
- [ ] All filters: category, condition, price range
- [ ] Search: find product by name
- [ ] Mobile: test all pages on 375px viewport
- [ ] WhatsApp FAB: verify correct number and opens chat

### 14.2 Environment Setup

- [ ] Set all production environment variables in Vercel dashboard
- [ ] Switch Paystack to live keys (owner sets up Paystack account)
- [ ] Configure Paystack webhook URL to production domain
- [ ] Set Cloudinary to production config
- [ ] Deploy Convex to production: `npx convex deploy --prod`

### 14.3 Launch

- [ ] Deploy to Vercel production
- [ ] Connect custom domain `zenixelectronics.co.ke` (or equivalent)
- [ ] Verify SSL certificate is active
- [ ] Test live Paystack payment with real transaction
- [ ] Submit sitemap to Google Search Console
- [ ] Replace all placeholder product images with real product photos from client

---

## Notes for Development

- Always run `npx convex dev` alongside `npm run dev` — Convex backend needs to be running locally
- Use `cn()` utility for all conditional class merging (never template literals for Tailwind)
- All prices stored and calculated as integers in KES (no floats) — display formatted with `Intl.NumberFormat`
- Product slugs must be URL-safe (auto-generate from name, lowercase, hyphens)
- Never expose `PAYSTACK_SECRET_KEY` to the client — webhook and verification always server-side
- Test Paystack M-Pesa with Paystack test credentials before going live
