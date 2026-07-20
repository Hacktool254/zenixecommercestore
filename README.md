# Zenix Electronics — E-Commerce Store

A full-stack e-commerce platform for **Zenix Electronics**, a Nairobi-based electronics retailer selling brand-new, ex-UK, and ex-USA devices. Built with Next.js 16 and Convex, with M-Pesa payments, Cloudinary image hosting, and a full admin panel.

---

## Features

### Storefront

- Product catalogue with category, brand, and condition filters (brand-new / ex-UK / ex-USA)
- Product detail pages with variant selection (storage, SIM type, colour)
- Hot deals, new arrivals, and featured products sections
- Fuzzy search with instant results
- Cart and wishlist (persisted per user)
- Customer reviews and ratings

### Checkout & Payments

- M-Pesa STK Push via Co-op Bank / Daraja API
- Paystack integration as a fallback
- Order confirmation emails
- Address book with multiple saved addresses

### Customer Account

- Email/password and OAuth sign-in via Convex Auth
- Order history and status tracking
- Profile management

### Admin Panel

- Product management — create, edit, and manage inventory with Cloudinary image uploads
- Order management — update order status, process refunds
- Customer management
- Coupon and discount code creation
- Site settings (homepage banners, featured products)
- Analytics dashboard — sales, revenue, top products
- Abandoned cart tracking
- Data export (CSV)

### Additional

- AI chatbot assistant for product discovery
- Sitemap and robots.txt generation
- Email notifications (Convex email actions)

---

## Tech Stack

| Layer         | Technology                           |
| ------------- | ------------------------------------ |
| Framework     | Next.js 16 (App Router) + TypeScript |
| Backend / DB  | Convex (real-time, serverless)       |
| Auth          | Convex Auth                          |
| Styling       | Tailwind CSS                         |
| UI components | Radix UI, Base UI                    |
| Image hosting | Cloudinary                           |
| Payments      | Daraja (M-Pesa) + Paystack           |
| State         | TanStack Query v5                    |
| Forms         | React Hook Form + Zod                |
| HTTP client   | Axios                                |

---

## Project Structure

```
zenixecommercestore/
├── app/
│   ├── (store)/         # Customer storefront routes
│   ├── admin/           # Admin panel routes
│   ├── (auth)/          # Sign-in, sign-up, OTP
│   └── api/             # API routes (webhooks, M-Pesa callbacks)
├── convex/
│   ├── schema.ts        # Database schema
│   ├── products.ts      # Product queries/mutations
│   ├── orders.ts        # Order management
│   ├── payments.ts      # Payment processing
│   ├── categories.ts    # Category management
│   └── ...              # Other Convex modules
├── components/          # Shared React components
├── lib/                 # Utilities and helpers
└── types/               # TypeScript type definitions
```

---

## Prerequisites

- **Node.js** 18+
- A **Convex** account — [convex.dev](https://convex.dev)
- **Cloudinary** account for image storage
- **Daraja API** credentials (Safaricom M-Pesa)
- **Paystack** account (optional)

---

## Getting Started

```bash
npm install

# Start Convex dev server
npx convex dev

# In a separate terminal, start Next.js
npm run dev
```

---

## Environment Variables

| Variable                 | Description                   |
| ------------------------ | ----------------------------- |
| `CONVEX_DEPLOYMENT`      | Convex deployment name        |
| `NEXT_PUBLIC_CONVEX_URL` | Convex URL for the frontend   |
| `CLOUDINARY_CLOUD_NAME`  | Cloudinary cloud name         |
| `CLOUDINARY_API_KEY`     | Cloudinary API key            |
| `CLOUDINARY_API_SECRET`  | Cloudinary API secret         |
| `DARAJA_CONSUMER_KEY`    | M-Pesa Daraja consumer key    |
| `DARAJA_CONSUMER_SECRET` | M-Pesa Daraja consumer secret |
| `DARAJA_PASSKEY`         | M-Pesa STK push passkey       |
| `PAYSTACK_SECRET_KEY`    | Paystack secret key           |

---

## Deployment

The project is configured for **Vercel** deployment. Run `npm run build` to verify the production build locally before pushing.
