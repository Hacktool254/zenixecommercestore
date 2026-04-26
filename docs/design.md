# Design Document — Zenix Electronics

## 1. Brand Identity

### Logo Analysis
The Zenix Electronics logo establishes a clear premium tech brand:
- Deep navy/black background: `#0A0E1A`
- "ZENIX" in silver/chrome metallic gradient: tech authority, premium feel
- "ELECTRONICS" in orange/amber: energy, innovation
- Circuit board lines on the Z + lightning bolt: technology, speed, connectivity
- Overall tone: **Bold. Premium. Modern. Tech-forward.**

The entire website must feel like an extension of this logo — dark, premium, with orange as the single accent color.

---

## 2. Color System

### Core Palette

| Token | Hex | Usage |
|---|---|---|
| `--bg-base` | `#0A0E1A` | Page background |
| `--bg-surface` | `#0D1117` | Card backgrounds |
| `--bg-elevated` | `#111827` | Modals, drawers, elevated cards |
| `--bg-subtle` | `#1A2035` | Hover states, input backgrounds |
| `--accent` | `#F5A623` | Primary CTA, highlights, links |
| `--accent-hover` | `#FF9F1C` | Button hover state |
| `--accent-muted` | `rgba(245,166,35,0.15)` | Glow backgrounds, badge fills |
| `--silver` | `linear-gradient(135deg, #C0C0C0, #E8E8E8)` | Logo-matching chrome elements |
| `--text-primary` | `#FFFFFF` | Headings, prices |
| `--text-secondary` | `#CBD5E1` | Body text |
| `--text-muted` | `#8B92A5` | Captions, placeholders |
| `--border` | `#1E2435` | Card borders, dividers |
| `--border-accent` | `rgba(245,166,35,0.4)` | Focused/hovered card borders |
| `--success` | `#22C55E` | Brand New badge, success states |
| `--error` | `#EF4444` | Errors, Hot Deal badge |
| `--info` | `#38BDF8` | New Arrival badge |

### Glow Effects
```css
/* Orange card glow — used on product card hover */
box-shadow: 0 0 20px rgba(245, 166, 35, 0.3), 0 0 40px rgba(245, 166, 35, 0.1);

/* Subtle card shadow — resting state */
box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);

/* Hero element glow */
box-shadow: 0 0 60px rgba(245, 166, 35, 0.2);
```

---

## 3. Typography

### Font Choices

| Role | Font | Weight | Rationale |
|---|---|---|---|
| Headings | **Space Grotesk** | 600, 700 | Geometric, modern, tech feel without being unreadable like Orbitron |
| Body | **Inter** | 400, 500 | Industry standard for readability, pairs perfectly with Space Grotesk |
| Prices / Numbers | **Space Grotesk** | 700 | Keeps numeric data consistent and bold |
| Labels / Badges | **Inter** | 600 | Legible at small sizes |

### Google Fonts Import
```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
```

### Type Scale (rem, base 16px)

| Token | Size | Line Height | Usage |
|---|---|---|---|
| `text-xs` | 0.75rem | 1rem | Badges, captions |
| `text-sm` | 0.875rem | 1.25rem | Secondary labels |
| `text-base` | 1rem | 1.5rem | Body text |
| `text-lg` | 1.125rem | 1.75rem | Card titles |
| `text-xl` | 1.25rem | 1.75rem | Section subheadings |
| `text-2xl` | 1.5rem | 2rem | Section headings |
| `text-3xl` | 1.875rem | 2.25rem | Page headings |
| `text-4xl` | 2.25rem | 2.5rem | Hero subheading |
| `text-5xl` | 3rem | 1 | Hero heading |
| `text-6xl` | 3.75rem | 1 | Hero heading (desktop) |

---

## 4. Spacing & Layout

### Spacing Scale (Tailwind tokens)
```
4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px, 128px
```

### Border Radius
| Token | Value | Usage |
|---|---|---|
| `rounded-sm` | 4px | Badges |
| `rounded` | 6px | Buttons, inputs |
| `rounded-lg` | 12px | Cards |
| `rounded-xl` | 16px | Featured cards, modals |
| `rounded-2xl` | 24px | Hero cards, large containers |
| `rounded-full` | 9999px | Avatar, FAB button |

### Breakpoints
| Name | Width | Layout |
|---|---|---|
| xs | < 640px | 1 col, bottom nav, full-width cards |
| sm | 640px | 2 col product grid |
| md | 768px | 2-3 col, sidebar filters visible |
| lg | 1024px | 3 col product grid, desktop nav |
| xl | 1280px | 4 col product grid |
| 2xl | 1536px | Max container 1400px centered |

### Container
```css
max-width: 1400px;
margin: 0 auto;
padding: 0 16px; /* mobile */
padding: 0 32px; /* tablet+ */
padding: 0 48px; /* desktop */
```

---

## 5. Component Design Specs

### Buttons

**Primary (Orange)**
```css
background: #F5A623;
color: #0A0E1A;
font-weight: 600;
padding: 12px 24px;
border-radius: 6px;
transition: all 0.2s;
hover: background #FF9F1C, box-shadow: 0 4px 16px rgba(245,166,35,0.4)
```

**Secondary (Ghost)**
```css
background: transparent;
border: 1px solid #1E2435;
color: #FFFFFF;
hover: border-color #F5A623, color #F5A623
```

**Ghost Orange**
```css
background: rgba(245,166,35,0.1);
border: 1px solid rgba(245,166,35,0.3);
color: #F5A623;
hover: background rgba(245,166,35,0.2)
```

### Product Card
```
┌─────────────────────────────┐
│  [condition badge]          │  ← top-left corner
│                             │
│      [product image]        │  ← aspect-ratio: 1/1, object-fit: cover
│                             │
├─────────────────────────────┤
│  Product Name               │  ← text-base, font-medium, text-white
│  Category                   │  ← text-sm, text-muted
│                             │
│  KES 45,000                 │  ← text-xl, font-bold, text-accent
│                             │
│  [Add to Cart] [Wishlist]   │  ← primary btn + icon btn
└─────────────────────────────┘

Background: #0D1117
Border: 1px solid #1E2435
Border-radius: 12px
Hover: border-color → #F5A623, box-shadow → orange glow, translateY(-4px)
Transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
```

### Condition Badges

| Badge | Background | Text Color | Label |
|---|---|---|---|
| Brand New | `rgba(34,197,94,0.15)` | `#22C55E` | ✓ Brand New |
| Ex UK | `rgba(245,166,35,0.15)` | `#F5A623` | Ex UK |
| Hot Deal | `rgba(239,68,68,0.15)` | `#EF4444` | 🔥 Hot Deal |
| New Arrival | `rgba(56,189,248,0.15)` | `#38BDF8` | New Arrival |
| Out of Stock | `rgba(139,146,165,0.15)` | `#8B92A5` | Out of Stock |

All badges: `font-size: 0.75rem`, `font-weight: 600`, `padding: 4px 10px`, `border-radius: 4px`

### Navigation (Desktop)
```
[Logo] [Categories ▾] [Shop] [Deals] [Delivery]    [Search 🔍] [Account] [Cart 🛒 (2)]
```
- Background: `rgba(10,14,26,0.8)` with `backdrop-filter: blur(12px)`
- Border-bottom: `1px solid #1E2435`
- Position: sticky top-0, z-index: 50
- Height: 72px

### Navigation (Mobile)
- Top bar: Logo + Search icon + Cart icon
- Bottom navigation bar (fixed):
  - Home | Shop | Deals | Account | Cart

### Cart Drawer
- Slides in from right
- Width: 420px (desktop), 100vw (mobile)
- Background: `#0D1117`
- Backdrop: `rgba(0,0,0,0.6)` with blur

---

## 6. Animation Specifications (Framer Motion)

### 6.1 Hero Section
```javascript
// Headline staggered text reveal
const heroHeadline = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
}

// Floating product image — continuous loop
const floatingProduct = {
  animate: {
    y: [-12, 12, -12],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
  }
}

// Background: animated circuit board SVG lines (CSS animation, opacity pulse)
// Particle effect: small dots moving along circuit paths
```

### 6.2 Product Cards — Scroll Reveal
```javascript
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" }
  })
}
// Stagger: each card in a grid animates in with 80ms offset
```

### 6.3 Product Card Hover
```css
/* Handled in CSS for performance */
.product-card {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.3s ease,
              border-color 0.3s ease;
}
.product-card:hover {
  transform: translateY(-6px);
  border-color: rgba(245,166,35,0.6);
  box-shadow: 0 0 24px rgba(245,166,35,0.25);
}
```

### 6.4 Cart Drawer
```javascript
const drawerVariants = {
  closed: { x: "100%", opacity: 0 },
  open: {
    x: 0, opacity: 1,
    transition: { type: "spring", damping: 25, stiffness: 300 }
  }
}
const backdropVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.2 } }
}
```

### 6.5 Page Transitions
```javascript
const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } }
}
```

### 6.6 Section Scroll Reveal
```javascript
// useInView from framer-motion, triggerOnce: true, margin: "-100px"
const sectionVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
}
```

### 6.7 WhatsApp FAB Pulse
```css
@keyframes whatsapp-pulse {
  0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.5); }
  70% { box-shadow: 0 0 0 16px rgba(37, 211, 102, 0); }
  100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
}
.whatsapp-fab {
  animation: whatsapp-pulse 2.5s infinite;
}
```

### 6.8 Hot Deal Badge Shimmer
```css
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
.hot-deal-badge {
  background: linear-gradient(90deg, #EF4444 25%, #FF6B6B 50%, #EF4444 75%);
  background-size: 200% auto;
  animation: shimmer 2s linear infinite;
}
```

### 6.9 Mobile Navigation Slide
```javascript
const mobileNavVariants = {
  closed: { height: 0, opacity: 0 },
  open: {
    height: "auto", opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  }
}
```

### 6.10 Loading Skeletons
```css
@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.skeleton {
  background: #1A2035;
  animation: skeleton-pulse 1.8s ease-in-out infinite;
}
```

---

## 7. Page-by-Page Design Specs

### 7.1 Homepage
```
[Sticky Header — blur backdrop]

[Hero Section — full viewport height]
  Left: Headline (Space Grotesk 700, 60px) + subtext + CTA buttons
  Right: Floating product image (3D float animation)
  Background: Dark navy + animated circuit SVG lines + subtle gradient

[Category Strip — horizontal scroll, snap]
  Icons + label for each category
  Hover: orange underline + slight scale

[New Arrivals — 4 card grid]
  Section header with "New Arrival" badge + "View All" link
  Cards animate in on scroll (stagger)

[Hot Deals — 4 card grid with countdown timer optional]
  Red gradient section header

[Featured / All Products — grid]
  Filter chips at top (All | iPhones | TVs | Gaming | ...)

[WhatsApp CTA Banner]
  Dark card: "Have questions? Chat with us on WhatsApp" + button

[Footer]
  Logo | Links | Address | Social | Copyright
```

### 7.2 Product Listing Page
```
[Header]
[Breadcrumb]

[Filters Sidebar (desktop) / Bottom sheet (mobile)]
  - Category checkboxes
  - Condition: Brand New | Ex UK
  - Price range slider
  - In Stock only toggle

[Product Grid — 2/3/4 cols by breakpoint]
  Sort: Newest | Price Low-High | Price High-Low

[Pagination or infinite scroll]
```

### 7.3 Product Detail Page
```
[Breadcrumb]

[Two column layout]
Left:
  - Image gallery (main + thumbnails)
  - Zoom on hover

Right:
  - Condition badge
  - Product name (text-3xl)
  - Price in KES (text-4xl, accent color)
  - Stock status
  - Short description
  - Quantity selector
  - [Add to Cart] [Add to Wishlist] [Compare]
  - WhatsApp inquiry link
  - Delivery info snippet

[Full description / specs tab section below]
[Related products]
```

### 7.4 Checkout (Multi-Step)
```
Step 1: Delivery Address
Step 2: Review Order
Step 3: Payment (Paystack — M-Pesa / Card)
Step 4: Confirmation

Progress indicator at top
Dark card containers per step
```

### 7.5 Admin Dashboard
```
Sidebar navigation (dark, #0D1117):
  Dashboard | Products | Orders | Inventory | Settings

Main content area (#111827):
  Dashboard: KPI cards (total orders, revenue, products, low stock alerts)
  Products: Table with search, edit, delete, add button
  Orders: Table with status filters, quick status update
  Inventory: Stock level bars, low stock highlighted in red
```

### 7.6 User Account
```
Sidebar: Profile | Orders | Wishlist | Addresses | Logout

Orders: Timeline-style order history with status badges
Wishlist: Product card grid with remove button
Addresses: Saved addresses with default label
```

---

## 8. Glassmorphism Usage

Applied selectively for premium feel — not overused:
- Hero featured product card overlay
- Cart drawer header
- Modal backgrounds
- Admin stat cards

```css
.glass-card {
  background: rgba(13, 17, 23, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.06);
}
```

---

## 9. Design Inspiration References

- **Apple.com** — Product photography standards, generous whitespace, detail-first
- **Newegg.com** — E-commerce layout patterns, filter sidebar, comparison feature
- **Razer.com** — Dark premium electronics aesthetic with accent glow
- **Nothing.tech** — Modern dark e-commerce with animation-forward design
- **Noon.com** — African/Middle East e-commerce UX patterns, mobile-first

---

## 10. Accessibility Notes

- All color combinations meet WCAG 2.1 AA contrast ratios
- Focus rings visible (orange outline)
- All interactive elements keyboard navigable
- Images have descriptive alt text
- Form labels always visible (not just placeholder)
- Reduced motion: wrap all Framer Motion animations in `prefers-reduced-motion` check
