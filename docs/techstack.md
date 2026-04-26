# Tech Stack — Zenix Electronics

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    BROWSER (Client)                          │
│  Next.js 15 App Router + React 19 + Tailwind CSS v4         │
│  Framer Motion | Zustand | TanStack Query | shadcn/ui        │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP / WebSocket
┌──────────────────────▼──────────────────────────────────────┐
│              Next.js API Routes / Server Actions             │
│         (Auth middleware, Paystack webhook handler)          │
└────┬─────────────────┬──────────────────────────────────────┘
     │                 │
┌────▼────┐      ┌─────▼──────────┐      ┌─────────────────┐
│ Convex  │      │   Paystack API │      │   Cloudinary    │
│ Backend │      │  (KES, M-Pesa, │      │  (Image CDN +   │
│  DB +   │      │   Cards)       │      │   Storage)      │
│  Auth + │      └────────────────┘      └─────────────────┘
│  RT     │
└─────────┘
     │
┌────▼──────────────────────┐
│  Vercel (Deployment)      │
│  Edge Network + CDN       │
└───────────────────────────┘
```

---

## 2. Core Stack Decisions

### Frontend Framework: Next.js 15 (App Router) + TypeScript

**Why Next.js 15:**
- Server-Side Rendering (SSR) for product pages — critical for SEO (Google indexes product names, prices, specs)
- Static Site Generation (SSG) for marketing pages (homepage, delivery info, about)
- Built-in Image optimization (`next/image`) — auto WebP conversion, responsive sizes, lazy loading
- API Routes handle Paystack webhooks without a separate server
- Server Actions eliminate boilerplate for form submissions
- Vercel deployment is zero-config for Next.js

**Why TypeScript:**
- Catches bugs at compile time — critical for e-commerce (wrong price types, missing product fields)
- Convex is TypeScript-native, so the schema types flow end-to-end automatically

**Rejected alternatives:**
- Vite + React: No SSR/SSG without additional setup, worse SEO out of box
- Remix: Smaller ecosystem, less Convex tooling
- SvelteKit: Team unfamiliarity, smaller component ecosystem

---

### Backend & Database: Convex

**Why Convex:**
- TypeScript-native — schema, queries, mutations all typed end-to-end
- Real-time subscriptions out of the box — cart updates, order status live
- Built-in authentication (Convex Auth)
- File storage for product images (fallback to Cloudinary)
- Serverless — scales automatically, no infrastructure management
- Generous free tier for small-medium stores
- Single platform: replaces database + backend + auth + real-time

**Convex Schema Tables:**
```typescript
// users — extended from Convex Auth
users: {
  name: string
  email: string
  phone?: string
  role: "customer" | "admin"
  createdAt: number
}

// products
products: {
  name: string
  slug: string
  description: string
  category: string        // "iphones" | "mac" | "tvs" | "audio" | etc.
  condition: "brand-new" | "ex-uk"
  price: number           // in KES (integer, no decimals)
  compareAtPrice?: number // original price for Hot Deals
  images: string[]        // Cloudinary URLs
  specs: Record<string, string>
  stock: number
  isActive: boolean
  isFeatured: boolean
  isHotDeal: boolean
  isNewArrival: boolean
  createdAt: number
}

// orders
orders: {
  userId: Id<"users">
  orderNumber: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  items: Array<{ productId: Id<"products">, name: string, price: number, quantity: number, image: string }>
  subtotal: number
  deliveryFee: number
  total: number
  address: { name: string, phone: string, street: string, city: string, notes?: string }
  paymentMethod: "mpesa" | "card"
  paymentStatus: "pending" | "paid" | "failed"
  paystackReference: string
  createdAt: number
}

// cart_items
cartItems: {
  userId: Id<"users">
  productId: Id<"products">
  quantity: number
}

// wishlists
wishlists: {
  userId: Id<"users">
  productId: Id<"products">
  addedAt: number
}

// addresses
addresses: {
  userId: Id<"users">
  name: string
  phone: string
  street: string
  city: string
  isDefault: boolean
}
```

---

### Styling: Tailwind CSS v4 + shadcn/ui

**Why Tailwind CSS v4:**
- Utility-first — consistent spacing, colors, responsive design without custom CSS files
- Dark mode by default — perfect for Zenix's dark theme
- v4 uses CSS-native cascade layers, faster build times
- Design tokens map directly to the color system in the design doc

**Why shadcn/ui:**
- Accessible components (Radix UI primitives) — dialogs, dropdowns, sheets
- Copy-paste into your codebase — full customization, no fighting the library
- Pre-built dark theme that matches Zenix aesthetic
- Components used: Dialog, Sheet (cart drawer), DropdownMenu, Select, Slider (price filter), Tabs, Badge, Skeleton, Toast

**Rejected:** Chakra UI (heavier, opinionated), MUI (Google Material look, wrong aesthetic), Bootstrap (outdated)

---

### Animation: Framer Motion (already installed)

**Usage map:**
| Section | Animation |
|---|---|
| Hero headline | Text reveal (opacity + y) with spring |
| Hero product | Floating y-axis loop |
| Product cards | Stagger scroll reveal on enter |
| Cart drawer | Spring slide-in from right |
| Page transitions | Fade + y slide via AnimatePresence |
| Mobile nav | Height expand |
| Modals | Scale + fade |
| WhatsApp FAB | CSS pulse ring (not Framer — lighter) |
| Skeletons | CSS pulse animation |

---

### State Management

**Zustand** — client-side state
- Cart state (items, totals, open/close drawer)
- UI state (search open, comparison drawer)
- Filter state (selected category, condition, price range)

**Why Zustand over Context + useReducer:** Simpler API, no provider nesting, better performance with selective subscriptions.

**TanStack Query (React Query v5)** — server state
- Product data fetching with caching
- Pagination/infinite queries for product listing
- Optimistic updates for wishlist toggles
- Stale-while-revalidate for product pages

**Why TanStack Query:** Automatic caching means product pages don't re-fetch on every navigation. Convex's `useQuery` hook handles real-time subscriptions directly for cart/orders.

---

### Authentication: Convex Auth

**Why Convex Auth:**
- Tightly integrated with Convex database — user records automatically linked
- Handles email/password, JWT, session management
- Row-level security through Convex's identity system
- No extra service needed

**Auth flows:**
- Email + password (primary)
- Password reset via email
- Admin role protected routes via middleware

---

### Payments: Paystack

**Why Paystack:**
- Built for African markets — Kenya is a primary market
- Supports KES natively
- M-Pesa STK Push (customer types number, gets push prompt on phone)
- Card payments (Visa, Mastercard)
- Webhook support for order confirmation
- Simple integration with Next.js API routes

**Integration flow:**
1. Customer clicks "Pay" → initialize Paystack transaction via API route
2. Paystack popup or redirect → customer pays via M-Pesa or card
3. Paystack sends webhook to `/api/paystack/webhook`
4. Webhook verifies signature, updates order status in Convex
5. Customer redirected to `/order/[id]` confirmation page

---

### Image Management: Cloudinary

**Why Cloudinary:**
- Free tier: 25GB storage, 25GB bandwidth/month — sufficient for 10s-100s of products
- Automatic format conversion (WebP, AVIF)
- Responsive image transformations via URL params (`w_400,f_auto,q_auto`)
- CDN delivery — fast load times globally
- Upload widget for admin dashboard product image uploads

**Integration:**
- Admin uploads via Cloudinary Upload Widget
- URLs stored in Convex products table
- Served via `next/image` with Cloudinary domain in `next.config`

---

### Forms: React Hook Form + Zod

**Why this combo:**
- React Hook Form: Uncontrolled inputs = no re-render on every keystroke = fast forms
- Zod: TypeScript-first schema validation, same schema used frontend + backend
- `@hookform/resolvers/zod` connects them with one line

**Used for:** Checkout address, login, register, admin product form, contact form

---

## 3. Complete Package List

### Production Dependencies
```json
{
  "next": "^15.1.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "^5.7.0",
  "convex": "^1.17.0",
  "@convex-dev/auth": "^0.0.71",
  "framer-motion": "^12.0.0",
  "tailwindcss": "^4.0.0",
  "@tailwindcss/postcss": "^4.0.0",
  "zustand": "^5.0.0",
  "@tanstack/react-query": "^5.62.0",
  "react-hook-form": "^7.54.0",
  "@hookform/resolvers": "^3.9.0",
  "zod": "^3.24.0",
  "lucide-react": "^0.468.0",
  "sonner": "^1.7.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.5.0",
  "class-variance-authority": "^0.7.0",
  "@radix-ui/react-dialog": "^1.1.0",
  "@radix-ui/react-dropdown-menu": "^2.1.0",
  "@radix-ui/react-select": "^2.1.0",
  "@radix-ui/react-slider": "^1.2.0",
  "@radix-ui/react-tabs": "^1.1.0",
  "@radix-ui/react-switch": "^1.1.0",
  "@radix-ui/react-avatar": "^1.1.0",
  "next-cloudinary": "^6.13.0",
  "cloudinary": "^2.5.0"
}
```

### Dev Dependencies
```json
{
  "@types/node": "^22.0.0",
  "@types/react": "^19.0.0",
  "@types/react-dom": "^19.0.0",
  "eslint": "^9.0.0",
  "eslint-config-next": "^15.1.0",
  "prettier": "^3.4.0",
  "prettier-plugin-tailwindcss": "^0.6.0",
  "husky": "^9.1.0",
  "lint-staged": "^15.2.0"
}
```

---

## 4. Environment Variables

```env
# Convex
CONVEX_DEPLOYMENT=dev:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Convex Auth
JWKS_PRIVATE_KEY=         # Generated by Convex Auth
SITE_URL=http://localhost:3000

# Paystack
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxx
PAYSTACK_SECRET_KEY=sk_live_xxxx
PAYSTACK_WEBHOOK_SECRET=whsec_xxxx

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx

# App
NEXT_PUBLIC_WHATSAPP_NUMBER=254700000000
NEXT_PUBLIC_SITE_URL=https://zenixelectronics.co.ke
```

---

## 5. Project Structure

```
zenixecommercestore/
├── app/                          # Next.js App Router
│   ├── (store)/                  # Customer-facing routes
│   │   ├── page.tsx              # Homepage
│   │   ├── shop/
│   │   │   ├── page.tsx          # All products
│   │   │   ├── [category]/
│   │   │   │   ├── page.tsx      # Category page
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx  # Product detail
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── order/[id]/page.tsx
│   │   ├── compare/page.tsx
│   │   ├── delivery/page.tsx
│   │   └── about/page.tsx
│   ├── (auth)/                   # Auth routes
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── account/                  # User account
│   │   ├── page.tsx
│   │   ├── orders/page.tsx
│   │   ├── wishlist/page.tsx
│   │   └── addresses/page.tsx
│   ├── admin/                    # Admin dashboard
│   │   ├── page.tsx
│   │   ├── products/
│   │   ├── orders/
│   │   └── inventory/
│   ├── api/
│   │   └── paystack/
│   │       └── webhook/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                       # shadcn components
│   ├── layout/                   # Header, Footer, BottomNav
│   ├── products/                 # ProductCard, ProductGrid, Filters
│   ├── cart/                     # CartDrawer, CartItem
│   ├── checkout/                 # CheckoutSteps, PaystackButton
│   ├── home/                     # Hero, CategoryStrip, NewArrivals, HotDeals
│   ├── admin/                    # AdminSidebar, ProductForm, OrdersTable
│   └── shared/                   # WhatsAppFAB, Badge, Skeleton
├── convex/                       # Convex backend
│   ├── schema.ts
│   ├── auth.ts
│   ├── products.ts
│   ├── orders.ts
│   ├── cart.ts
│   ├── wishlists.ts
│   └── addresses.ts
├── lib/
│   ├── utils.ts
│   ├── paystack.ts
│   └── cloudinary.ts
├── stores/
│   ├── cart.store.ts
│   └── ui.store.ts
├── types/
│   └── index.ts
├── docs/                         # Project documentation
└── public/
```

---

## 6. Deployment

**Platform: Vercel**
- Zero-config Next.js deployment
- Automatic preview deployments on every PR
- Edge network CDN for static assets
- Environment variables managed in Vercel dashboard
- Domain: `zenixelectronics.co.ke` (custom domain via Vercel)

**Convex:** Auto-deployed via `npx convex deploy` in CI
**Cloudinary:** SaaS, no deployment needed
**Paystack:** SaaS, webhook URL configured in Paystack dashboard
