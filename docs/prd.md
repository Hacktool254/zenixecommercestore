# Product Requirements Document — Zenix Electronics

## 1. Overview

Zenix Electronics is a Nairobi-based electronics retailer located at Accra Road, Cookie House, Nairobi, Kenya. This document defines the requirements for building a full e-commerce web application that allows customers to browse, compare, and purchase electronics online, with full Paystack payment processing (M-Pesa + card), user accounts, and an admin dashboard for store management.

---

## 2. Goals

- Establish a professional online presence for Zenix Electronics
- Enable online sales with M-Pesa and card payments via Paystack
- Provide customers a fast, mobile-friendly shopping experience
- Give the store owner full control over products, orders, and inventory via admin dashboard
- Build a scalable foundation that grows as product catalog expands

---

## 3. Target Users

| Segment | Description |
|---|---|
| General Public | Everyday shoppers looking for phones, TVs, accessories |
| Tech Enthusiasts | Looking for specific specs, comparing products |
| Corporate Buyers | Bulk orders of laptops, starlinks, accessories |
| Store Admin | Owner/staff managing products, orders, inventory |

---

## 4. Product Catalog

### Categories & Products

| Category | Products | Conditions |
|---|---|---|
| Apple iPhones | iPhone 7, 8, X, XS, XR, 11, 12, 13, 14, 15 series | Brand New, Ex UK |
| Apple Mac | Mac Mini | Brand New, Ex UK |
| Apple Accessories | Pencils, AirPods Max, Chargers | Brand New, Ex UK |
| Televisions | Smart TVs (various brands/sizes) | Brand New, Ex UK |
| Audio | Soundbars, Headphones | Brand New, Ex UK |
| Connectivity | Starlinks | Brand New |
| Gaming | PlayStation consoles/accessories, Gaming Chairs | Brand New, Ex UK |
| Power | Power Banks | Brand New, Ex UK |

**Condition Definitions:**
- **Brand New** — Sealed, original packaging, full warranty
- **Ex UK** — Used/refurbished units imported from the UK, graded, tested

---

## 5. Feature Requirements

### P0 — Must Have (Launch Blockers)

| ID | Feature | Description |
|---|---|---|
| F-01 | Product Catalog | Browse all products with images, price in KES, condition badge, stock status |
| F-02 | Category & Filter | Filter by category, condition (Brand New / Ex UK), price range |
| F-03 | Product Detail Page | Full product info, image gallery, specs, condition, add to cart |
| F-04 | Shopping Cart | Add/remove items, update quantity, cart drawer + full cart page |
| F-05 | Checkout | Multi-step: address → payment → confirmation |
| F-06 | Paystack Integration | M-Pesa STK push + card payments in KES |
| F-07 | Order Confirmation | Email + on-screen confirmation with order number |
| F-08 | User Registration/Login | Email/password auth, JWT sessions |
| F-09 | Admin — Products | Create, read, update, delete products with images |
| F-10 | Admin — Orders | View all orders, update order status |
| F-11 | Mobile Responsive | Full mobile-first experience, bottom nav on mobile |
| F-12 | WhatsApp FAB | Floating WhatsApp button linking to business number |

### P1 — Should Have (Shortly After Launch)

| ID | Feature | Description |
|---|---|---|
| F-13 | User Wishlist | Save products to wishlist from account |
| F-14 | Order History | Users can view past orders and status |
| F-15 | Saved Addresses | Store delivery addresses in user account |
| F-16 | Search | Full-text search across product names, descriptions |
| F-17 | New Arrivals Section | Homepage section showing recently added products |
| F-18 | Hot Deals Section | Homepage section for discounted/promoted products |
| F-19 | Product Comparison | Compare up to 3 products side-by-side on specs/price |
| F-20 | Admin — Inventory | Track stock levels, low stock alerts |
| F-21 | Delivery Info Page | Coverage areas, delivery times, fees |

### P2 — Nice to Have (Future)

| ID | Feature | Description |
|---|---|---|
| F-22 | Product Reviews | Star ratings and written reviews from verified buyers |
| F-23 | Related Products | "You may also like" section on product detail |
| F-24 | Stock Notifications | Email alert when out-of-stock item is restocked |
| F-25 | Promo Codes | Discount code support at checkout |
| F-26 | Analytics Dashboard | Sales charts, revenue, top products in admin |

---

## 6. Page Inventory

| Page | Route | Auth Required |
|---|---|---|
| Homepage | / | No |
| Shop / All Products | /shop | No |
| Category Page | /shop/[category] | No |
| Product Detail | /shop/[category]/[slug] | No |
| Cart | /cart | No |
| Checkout | /checkout | Yes |
| Order Confirmation | /order/[id] | Yes |
| Login | /auth/login | No |
| Register | /auth/register | No |
| Forgot Password | /auth/forgot-password | No |
| Account — Profile | /account | Yes |
| Account — Orders | /account/orders | Yes |
| Account — Wishlist | /account/wishlist | Yes |
| Account — Addresses | /account/addresses | Yes |
| Product Comparison | /compare | No |
| Delivery Info | /delivery | No |
| About / Contact | /about | No |
| Admin — Dashboard | /admin | Admin only |
| Admin — Products | /admin/products | Admin only |
| Admin — Add Product | /admin/products/new | Admin only |
| Admin — Edit Product | /admin/products/[id] | Admin only |
| Admin — Orders | /admin/orders | Admin only |
| Admin — Inventory | /admin/inventory | Admin only |

---

## 7. User Stories

### Customer
- As a customer, I can browse products by category so I can find what I'm looking for quickly
- As a customer, I can filter by "Brand New" or "Ex UK" so I can choose the condition I prefer
- As a customer, I can view detailed product info including images and price in KES before buying
- As a customer, I can add items to my cart and checkout using M-Pesa or my card
- As a customer, I can create an account to track my orders and save my wishlist
- As a customer, I can contact the store instantly via WhatsApp if I have a question
- As a customer, I can compare products side by side to make informed decisions
- As a customer, I can see "New Arrivals" and "Hot Deals" on the homepage

### Admin
- As an admin, I can add new products with images, price, condition, and stock count
- As an admin, I can update product details and mark items out of stock
- As an admin, I can view all orders and update their status (pending, processing, shipped, delivered)
- As an admin, I can see inventory levels and identify low-stock products

---

## 8. Non-Functional Requirements

| Requirement | Target |
|---|---|
| Performance | Lighthouse score ≥ 90 on mobile |
| Page Load | First Contentful Paint < 2s on 4G |
| SEO | All product pages have meta title, description, OG tags, structured data (Product schema) |
| Accessibility | WCAG 2.1 AA compliant |
| Security | Input validation, XSS protection, CSRF protection, secure auth tokens |
| Uptime | 99.9% via Vercel + Convex infrastructure |
| Scalability | Architecture supports catalog growing to 1000+ products without refactor |
| Image Optimization | All images served via Cloudinary CDN with responsive sizes |
| Mobile | Full feature parity on mobile, bottom navigation pattern |

---

## 9. Out of Scope

- Installment/financing plans
- Multi-vendor marketplace
- Live chat (WhatsApp handles this)
- Native mobile app (web-first)
- Physical POS integration
- Multi-currency (KES only at launch)
- Bulk/wholesale pricing tiers
