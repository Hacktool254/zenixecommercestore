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
- [x] Test signup and login flow

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
- [x] Run seed script to populate dev database

---

## PHASE 3 — Core Layout & Navigation

### 3.1 Root Layout

- [x] `app/layout.tsx` — wrap with `ConvexClientProvider`, `TanStackQueryProvider`, `Toaster` (Sonner)
- [x] Add font variables to html element
- [x] Set dark background color on body

### 3.2 Header Component

- [x] `components/layout/Header.tsx` — logo, nav links, search icon, account icon, cart icon with item count
- [x] Sticky positioning with `backdrop-filter: blur(12px)` and semi-transparent bg
- [x] Cart item count badge on cart icon (from Zustand cart store)
- [x] Active link highlighting
- [x] Responsive: hide nav links on mobile, show hamburger

### 3.3 Mobile Bottom Navigation

- [x] `components/layout/BottomNav.tsx` — Home, Shop, Deals, Account, Cart (5 icons)
- [x] Fixed bottom, visible only on mobile (hidden md:)
- [x] Active state with orange accent

### 3.4 Footer Component

- [x] `components/layout/Footer.tsx` — logo, nav links, address (Accra Road, Cookie House, Nairobi), social links, copyright
- [x] 3-column grid on desktop, stacked on mobile

### 3.5 WhatsApp FAB

- [x] `components/shared/WhatsAppFAB.tsx` — fixed bottom-right button with WhatsApp green + pulse ring CSS animation
- [x] Links to `https://wa.me/${WHATSAPP_NUMBER}`
- [x] Hidden on checkout page

### 3.6 Route Groups & Layouts

- [x] `app/(store)/layout.tsx` — includes Header, Footer, WhatsAppFAB, BottomNav
- [x] `app/(auth)/layout.tsx` — minimal layout, centered card
- [x] `app/admin/layout.tsx` — AdminSidebar + main content area, protected route
- [x] `app/account/layout.tsx` — AccountSidebar + content area, protected route

### 3.7 Zustand Stores

- [x] `stores/cart.store.ts` — items, addItem, removeItem, updateQuantity, clearCart, isDrawerOpen, openDrawer, closeDrawer, computed totals
- [x] `stores/ui.store.ts` — isSearchOpen, comparisonList (up to 3 products), addToComparison, removeFromComparison

---

## PHASE 4 — Homepage

### 4.1 Hero Section

- [x] `components/home/Hero.tsx` — full viewport height, two-column layout
- [x] Left: animated headline with Framer Motion text reveal, subtext, two CTA buttons (Shop Now + View Deals)
- [x] Right: floating product image (framer-motion y-axis loop animation)
- [x] Background: circuit board SVG pattern (subtle, animated opacity)
- [x] Mobile: single column, centered

### 4.2 Category Strip

- [x] `components/home/CategoryStrip.tsx` — horizontal scrollable row with snap
- [x] One card per category: icon + label
- [x] Hover: orange underline + scale(1.05)
- [x] Scroll reveal on enter

### 4.3 New Arrivals Section

- [x] `components/home/NewArrivals.tsx` — "New Arrivals" section heading + "View All" link
- [x] Grid of 4 product cards, fetched via `getNewArrivals` Convex query
- [x] Stagger scroll reveal animation

### 4.4 Hot Deals Section

- [x] `components/home/HotDeals.tsx` — orange accent section header
- [x] Grid of 4 discounted products, fetched via `getHotDeals`
- [x] Show original price struck through + sale price
- [x] Shimmer badge animation on "Hot Deal" badge

### 4.5 WhatsApp CTA Banner

- [x] `components/home/WhatsAppBanner.tsx` — dark card with text + WhatsApp button
- [x] "Need help choosing? Chat with us instantly on WhatsApp"

### 4.6 Homepage Page

- [x] `app/(store)/page.tsx` — compose all home sections
- [x] Add `<Suspense>` boundaries with skeleton loaders for data-fetched sections
- [x] Page metadata (title, description, OG tags)

---

## PHASE 5 — Product Listing & Detail

### 5.1 Product Card Component

- [x] `components/products/ProductCard.tsx` — image, condition badge, name, price in KES, add to cart button, wishlist toggle, compare toggle
- [x] Hover: lift + orange border glow (CSS transition)
- [x] Out of stock: greyed image overlay + "Out of Stock" badge, disabled cart button
- [x] KES price formatted with thousands separator (KES 45,000)

### 5.2 Product Grid

- [x] `components/products/ProductGrid.tsx` — responsive grid 2/3/4 cols
- [x] Stagger scroll reveal for cards
- [x] Loading state: skeleton cards

### 5.3 Filters Component

- [x] `components/products/Filters.tsx`:
  - Category checkboxes (All, iPhones, Mac, TVs, Audio, Gaming, Connectivity, Power)
  - Condition: Brand New | Ex UK (radio or toggle)
  - Price range slider (0 — 500,000 KES)
  - In Stock only toggle
- [x] Desktop: sidebar left panel
- [x] Mobile: bottom sheet (Radix Sheet component)
- [x] Apply filters updates URL search params

### 5.4 Shop Page

- [x] `app/(store)/shop/page.tsx` — filters sidebar + product grid
- [x] Read filters from URL search params (shareable/bookmarkable filter URLs)
- [x] Sort dropdown (Newest, Price Low-High, Price High-Low)
- [x] Active filter chips above grid with remove button
- [x] Page metadata

### 5.5 Category Page

- [x] `app/(store)/shop/[category]/page.tsx` — pre-filtered to category
- [x] Category hero banner with name and product count
- [x] Generates static params for all categories

### 5.6 Product Detail Page

- [x] `app/(store)/shop/[category]/[slug]/page.tsx`
- [x] Image gallery: main image + thumbnail row, click to switch
- [x] Condition badge, product name, KES price, stock status
- [x] Quantity selector (1 to available stock)
- [x] Add to Cart button (primary) + Add to Wishlist (icon button) + Compare (icon button)
- [x] WhatsApp inquiry link: "Ask about this product"
- [x] Specs table (from product.specs object)
- [x] Full description
- [x] Related products (same category)
- [x] Structured data (JSON-LD Product schema for SEO)
- [x] generateMetadata for SEO title/description per product

---

## PHASE 6 — Cart & Cart Drawer

### 6.1 Cart Drawer

- [x] `components/cart/CartDrawer.tsx` — slides in from right, Framer Motion spring animation
- [x] Backdrop blur overlay
- [x] Cart items list with image, name, price, quantity controls, remove button
- [x] Subtotal at bottom
- [x] Checkout button → `/checkout`
- [x] Empty state with "Start Shopping" link
- [x] Controlled by Zustand `isDrawerOpen`

### 6.2 Cart Item Component

- [x] `components/cart/CartItem.tsx` — product thumbnail, name, condition, price × quantity, +/- buttons, delete button
- [x] Optimistic UI — quantity updates instantly, syncs to Convex

### 6.3 Cart Page

- [x] `app/(store)/cart/page.tsx` — full-page cart view
- [x] Same items list as drawer, but with more space
- [x] Order summary card (subtotal, delivery fee KES 300, total)
- [x] "Continue Shopping" + "Proceed to Checkout" buttons

### 6.4 Add to Cart Logic

- [x] `addToCart` in Zustand store — cart lives in Zustand with localStorage persistence
- [x] For guests: cart persists in localStorage via Zustand persist middleware
- [x] On login: merge guest cart with server cart

---

## PHASE 7 — Authentication

### 7.1 Login Page

- [x] `app/(auth)/login/page.tsx` — email + password form
- [x] React Hook Form + Zod validation
- [x] Error messages inline
- [x] Link to register + forgot password
- [x] Redirect to previous page or `/account` after login via `?redirect=` param

### 7.2 Register Page

- [x] `app/(auth)/register/page.tsx` — name, email, password, confirm password
- [x] Zod schema validation with password match refine
- [x] Success → redirect to `/account`

### 7.3 Forgot Password Page

- [x] `app/(auth)/forgot-password/page.tsx` — email input
- [x] Sends reset email via Convex Auth `flow: "reset"`
- [x] Success state shown with checkmark (no page redirect)

### 7.4 Auth Middleware

- [x] `proxy.ts` — protect `/checkout`, `/account/*`, `/admin/*` routes (Next.js uses proxy.ts with Convex Auth)
- [x] Redirect unauthenticated users to `/login?redirect=...`
- [x] Redirect non-admin users away from `/admin/*` (JWT role check)

---

## PHASE 8 — Checkout & Payments

### 8.1 Checkout Page Structure

- [x] `app/(store)/checkout/page.tsx` — multi-step with progress indicator
- [x] Step 1: Delivery address (existing saved addresses or new address form)
- [x] Step 2: Order review (items, address, totals)
- [x] Step 3: Payment (Paystack)

### 8.2 Paystack Integration (Card payments)

- [x] `lib/paystack.ts` — initialize transaction, verify transaction functions
- [x] Install Paystack inline JS: `@paystack/inline-js` or use redirect
- [x] On "Pay Now": call `/api/paystack/initialize` route → get access code → trigger Paystack popup
- [x] On success callback: verify transaction via `/api/paystack/verify/[reference]`
- [x] Redirect to `/order/[id]` on confirmed payment

### 8.3 Paystack Webhook

- [x] `app/api/paystack/webhook/route.ts` — verify HMAC signature
- [x] Handle `charge.success` event → call `updatePaymentStatus` in Convex
- [x] Handle `charge.failed` event → update order accordingly

### 8.5 Co-op Bank M-Pesa STK Push Integration

- [x] `app/api/mpesa/stk/route.ts` — fetches OAuth token from Co-op Bank, sends STK push via Fixie static IP proxy
- [x] `app/api/mpesa/status/route.ts` — polls transaction status by MessageReference
- [x] `app/api/mpesa/callback/route.ts` — receives Co-op Bank callback, updates order paymentStatus in Convex
- [x] Checkout page updated: M-Pesa flow collects phone number, sends STK push, polls for confirmation every 5s
- [x] Fixie static IP proxy configured (FIXIE_URL env var) — required because Co-op Bank whitelists IPs
- [x] Co-op Bank outbound IPs (54.217.142.99, 54.195.3.54) shared with bank for whitelisting
- [x] Bank IP whitelist confirmed by Melvin (IPs: 54.217.142.99, 54.195.3.54)

### 8.4 Order Confirmation Page

- [x] `app/(store)/order/[id]/page.tsx` — order number, items summary, delivery address, payment method, status
- [x] "Continue Shopping" button
- [x] Option to download/print receipt (future — deferred, not required for launch)

---

## PHASE 9 — User Account

### 9.1 Account Layout & Profile

- [x] `app/account/layout.tsx` — sidebar with nav links
- [x] `app/account/page.tsx` — profile info (name, email, phone), edit form

### 9.2 Orders History

- [x] `app/account/orders/page.tsx` — list of all user orders
- [x] Order card: order number, date, total, status badge, item thumbnails
- [x] Click → order detail view

### 9.3 Wishlist

- [x] `app/account/wishlist/page.tsx` — product grid of wishlisted items
- [x] Remove from wishlist button on each card
- [x] Add to cart directly from wishlist

### 9.4 Addresses

- [x] `app/account/addresses/page.tsx` — list of saved addresses
- [x] Add new address form (React Hook Form)
- [x] Set default address
- [x] Delete address

---

## PHASE 10 — Product Comparison

### 10.1 Comparison Logic

- [x] Zustand `comparisonList` — max 3 products
- [x] "Compare" button on product cards — toggles product in comparison list
- [x] Floating comparison bar at bottom of page when 2+ products selected
- [x] "Compare Now" button in floating bar → navigates to `/compare`

### 10.2 Comparison Page

- [x] `app/(store)/compare/page.tsx` — side-by-side table
- [x] Rows: Image, Name, Price, Condition, Category, Specs (all spec keys merged)
- [x] Highlight best value (lowest price) in green
- [x] "Add to Cart" button per column
- [x] "Remove" button per column

---

## PHASE 11 — Admin Dashboard

### 11.1 Admin Layout

- [x] `app/admin/layout.tsx` — sidebar navigation + top bar
- [x] Sidebar: Dashboard, Products, Orders, Inventory, Back to Store
- [x] Admin-only route protection (check user role in middleware)

### 11.2 Dashboard Overview

- [x] `app/admin/page.tsx` — KPI cards: Total Orders, Total Revenue (KES), Total Products, Low Stock Items
- [x] Recent orders table (last 10)
- [x] Low stock alert list

### 11.3 Products Management

- [x] `app/admin/products/page.tsx` — products table with search
- [x] Columns: Image, Name, Category, Condition, Price, Stock, Status, Actions
- [x] Edit button → `/admin/products/[id]`
- [x] Delete button with confirmation dialog
- [x] "Add Product" button → `/admin/products/new`

### 11.4 Product Form (Add/Edit)

- [x] `app/admin/products/new/page.tsx` and `app/admin/products/[id]/page.tsx`
- [x] Fields: Name, Slug (auto-generated from name), Category, Condition, Price, Compare-at Price, Description, Specs (key-value pairs), Stock, isActive, isFeatured, isHotDeal, isNewArrival
- [x] Cloudinary image upload widget (multi-image, reorder, remove)
- [x] React Hook Form + Zod validation
- [x] Submit → Convex `createProduct` or `updateProduct` mutation

### 11.5 Orders Management

- [x] `app/admin/orders/page.tsx` — all orders table
- [x] Filter by status: All, Pending, Processing, Shipped, Delivered, Cancelled
- [x] Click row → order detail modal
- [x] Status dropdown to update order status inline

### 11.6 Abandoned Carts

- [x] `app/admin/abandoned-carts/page.tsx` — orders with pending payment status
- [x] Shows customer name, email, phone, items, total value, creation time
- [x] One-click WhatsApp recovery message (pre-filled with customer name + product + price)
- [x] Email and Call buttons per abandoned cart
- [x] Stats: total abandoned count, avg order value, potential revenue
- [x] `getAbandonedOrders` Convex query (admin only)
- [x] getUserOrders updated to hide pending payment orders from customer My Orders view

### 11.7 Inventory

- [x] `app/admin/inventory/page.tsx` — all products with stock levels
- [x] Visual indicator: green (≥10), amber (1-9), red (0 - Out of Stock)
- [x] Inline stock update input field per product

---

## PHASE 12 — Supporting Pages

### 12.1 Delivery Info Page

- [x] `app/(store)/delivery/page.tsx`
- [x] Coverage areas in Nairobi
- [x] Estimated delivery times
- [x] Delivery fee structure
- [x] Pickup option at Accra Road, Cookie House

### 12.2 About/Contact Page

- [x] `app/(store)/about/page.tsx`
- [x] Zenix story, location, contact info
- [x] Google Maps embed for Accra Road, Nairobi
- [x] Contact form (sends WhatsApp or email)
- [x] `app/(store)/contact/page.tsx` — dedicated contact page (footer link)
- [x] `app/(store)/returns/page.tsx` — returns & refunds policy (footer link)

---

## PHASE 13 — SEO & Performance

### 13.1 Metadata

- [x] Root layout metadata (title template, description, OG image)
- [x] `generateMetadata` for product pages (name, description, price, image)
- [x] `generateMetadata` for category pages
- [x] Sitemap: `app/sitemap.ts` — generates URLs for all products and categories (fixed: correct category slugs, added /deals, /contact, /returns)
- [x] Robots: `app/robots.ts`
- [x] OG image wired into root layout (`/opengraph-image.png`, 1200×630)
- [x] Twitter card (`summary_large_image`) in root layout
- [x] SEO keywords expanded with Nairobi-specific long-tail terms

### 13.2 Structured Data

- [x] Product JSON-LD schema on all product detail pages (name, price, availability, image, condition)
- [x] BreadcrumbList JSON-LD on product and category pages
- [x] LocalBusiness / ElectronicsStore JSON-LD on homepage (address, geo, hours, phone)
- [x] aggregateRating + review fields added (fixes Google Search Console Product snippets warnings)
- [x] shippingDetails + hasMerchantReturnPolicy added (fixes Merchant listings warnings)
- [x] Privacy Policy page at /privacy-policy
- [x] Terms of Service page at /terms
- [x] Google Merchant Center product feed at /api/merchant-feed (auto-updates every 24h)
- [x] Google tag GT-KD782FTB added to layout (all pages)
- [x] Google Customer Reviews opt-in on order confirmation page (merchant ID 5804859197)
- [x] Google Customer Reviews badge added to all pages (bottom right)
- [x] Sitemap submitted to Google Search Console — 93 pages, status: Success

### 13.3 Performance

- [x] All product images via `next/image` with explicit width/height
- [x] Cloudinary image URLs with `f_auto,q_auto` transformations
- [x] Lazy load below-fold images
- [x] `loading="eager"` on above-fold hero image
- [x] Route-level code splitting (automatic with App Router)
- [x] `<Suspense>` with skeletons for all data-fetched sections

### 13.4 Accessibility

- [x] All images have descriptive `alt` text
- [x] Focus ring visible on all interactive elements (orange outline)
- [x] Form labels always associated with inputs
- [x] Color contrast verified with WCAG 2.1 AA
- [x] Keyboard navigation tested — cart, modals, dropdowns

---

## PHASE 14 — Testing & Launch Prep

### 14.1 Manual Testing Checklist

- [ ] Full purchase flow: browse → add to cart → checkout → M-Pesa STK push → order confirmation (STK push confirmed working, needs KES 1 test to verify callback + order status)
- [x] Card payment removed — Paystack application denied, Co-op Bank card integration planned
- [x] User registration → login → wishlist → account orders (tested, fixed false error bug)
- [x] Save address at checkout (fixed — notes field was causing Convex validation error)
- [ ] Admin: add product → verify appears on site
- [ ] Admin: update order status → verify user sees update
- [x] Admin: abandoned carts visible with WhatsApp/email/call recovery actions
- [ ] Product comparison with 3 products
- [ ] All filters: category, condition, price range
- [ ] Search: find product by name
- [ ] Mobile: test all pages on 375px viewport
- [x] Mobile: sign out button added to mobile account nav
- [x] WhatsApp FAB: verified correct number and opens chat

### 14.2 Environment Setup

- [x] Set all production environment variables in Vercel (NEXT_PUBLIC_CONVEX_URL, NEXT_PUBLIC_CONVEX_SITE_URL, CONVEX_DEPLOY_KEY, COOPBANK_*, FIXIE_URL, COOPBANK_CALLBACK_URL)
- [x] Paystack removed — M-Pesa via Co-op Bank is the sole payment method
- [x] Set Cloudinary to production config
- [x] Deploy Convex to production: reliable-salamander-205
- [x] NEXT_PUBLIC_SITE_URL set to https://zenixelectronics.co.ke on Vercel

### 14.3 Launch

- [x] Deploy to Vercel production
- [x] Custom domain zenixelectronics.co.ke connected and live
- [x] SSL certificate active (HTTPS working)
- [x] Co-op Bank M-Pesa STK Push — IP whitelist confirmed, integration live
- [ ] Test live M-Pesa payment end-to-end (whitelist done — needs real transaction test)
- [x] Card payment via Paystack — removed. Paystack application denied. Co-op Bank card integration to be added when available.
- [x] Sitemap submitted to Google Search Console — 93 pages, Success
- [x] Google Merchant Center product feed submitted
- [x] Google Business Profile set up (client confirmed)
- [x] Replace all placeholder product images with real product photos (client confirmed current images are acceptable)

### 14.4 Post-Launch SEO & Integrations

- [x] Google Search Console — sitemap submitted, 93 pages indexed
- [x] Google Merchant Center — product feed live at /api/merchant-feed
- [x] Google Customer Reviews — opt-in on order confirmation + badge on all pages
- [x] Google Analytics / GA4 — tag GT-KD782FTB on all pages
- [x] Structured data warnings fixed (aggregateRating, review, shippingDetails, hasMerchantReturnPolicy)
- [x] Co-op Bank IP whitelist confirmed — IPs 54.217.142.99 and 54.195.3.54 whitelisted by Melvin

---

## Notes for Development

- Always run `npx convex dev` alongside `npm run dev` — Convex backend needs to be running locally
- Use `cn()` utility for all conditional class merging (never template literals for Tailwind)
- All prices stored and calculated as integers in KES (no floats) — display formatted with `Intl.NumberFormat`
- Product slugs must be URL-safe (auto-generate from name, lowercase, hyphens)
- Never expose `PAYSTACK_SECRET_KEY` to the client — webhook and verification always server-side
- Test Paystack M-Pesa with Paystack test credentials before going live
