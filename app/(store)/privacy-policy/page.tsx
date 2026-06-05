import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zenixelectronics.co.ke";

export const metadata: Metadata = {
  title: "Privacy Policy — Zenix Electronics",
  description:
    "Zenix Electronics privacy policy. Learn how we collect, use, and protect your personal data when you shop with us in Nairobi, Kenya.",
  alternates: {
    canonical: `${BASE_URL}/privacy-policy`,
  },
};

const SECTIONS = [
  {
    title: "1. Who We Are",
    body: `Zenix Electronics is an electronics retailer based in Nairobi, Kenya. We operate the website zenixelectronics.co.ke and sell brand new and Ex UK electronics including iPhones, MacBooks, Samsung devices, televisions, gaming consoles, and accessories. Our physical store is located at Cookie House, Accra Road, Nairobi CBD.

Contact: info@zenixelectronics.co.ke | +254 703 659 956`,
  },
  {
    title: "2. Data We Collect",
    body: `When you use our website or place an order, we may collect the following:

• Account information: your name, email address, and password (hashed and never stored in plain text).
• Delivery information: name, phone number, street address, and city provided when placing an order.
• Order information: items purchased, quantities, prices, and order history.
• Payment information: for M-Pesa payments, we collect only your mobile number to initiate the STK push. We do not store your M-Pesa PIN or any card details.
• Usage data: pages visited, browser type, and device type for analytics purposes.`,
  },
  {
    title: "3. How We Use Your Data",
    body: `We use your data to:

• Process and fulfil your orders, including arranging delivery.
• Send order confirmation and delivery updates via email or SMS.
• Respond to customer service enquiries.
• Improve our website and product offerings.
• Comply with legal obligations under Kenyan law.

We do not sell, rent, or share your personal data with third parties for marketing purposes.`,
  },
  {
    title: "4. M-Pesa & Payment Data",
    body: `M-Pesa payments are processed via Co-operative Bank of Kenya's STK Push API. When you pay via M-Pesa:

• Your mobile number is sent to Co-op Bank to initiate the payment prompt.
• The transaction is processed entirely by Safaricom and Co-op Bank on their secure infrastructure.
• We receive only a confirmation of success or failure — we do not see or store your M-Pesa PIN.
• Co-op Bank's privacy policy governs the handling of your payment data on their end.`,
  },
  {
    title: "5. Data Storage & Security",
    body: `Your data is stored securely on Convex (convex.dev), a US-based cloud database provider that uses encryption at rest and in transit. Access to your data is restricted to authenticated users and authorised staff only.

We use industry-standard security measures including HTTPS, hashed passwords, and role-based access controls. However, no system is 100% secure and we cannot guarantee absolute security.`,
  },
  {
    title: "6. Data Retention",
    body: `We retain your account and order data for as long as your account is active or as required for legal and tax compliance under Kenyan law. If you wish to delete your account and associated data, contact us at info@zenixelectronics.co.ke and we will process your request within 14 days.`,
  },
  {
    title: "7. Cookies",
    body: `Our website uses essential cookies required for authentication and cart functionality. We do not use advertising or tracking cookies. No cookie consent banner is required as we only use strictly necessary cookies.`,
  },
  {
    title: "8. Your Rights",
    body: `You have the right to:

• Access the personal data we hold about you.
• Request correction of inaccurate data.
• Request deletion of your data (subject to legal retention requirements).
• Withdraw consent where processing is based on consent.

To exercise any of these rights, contact us at info@zenixelectronics.co.ke.`,
  },
  {
    title: "9. Third-Party Services",
    body: `We use the following third-party services that may process your data:

• Convex (convex.dev) — database and backend infrastructure
• Vercel (vercel.com) — website hosting
• Co-operative Bank of Kenya — M-Pesa payment processing
• Google Analytics (if enabled) — website usage analytics

Each provider operates under their own privacy policy and data processing agreements.`,
  },
  {
    title: "10. Changes to This Policy",
    body: `We may update this privacy policy from time to time. When we do, we will update the "Last updated" date below. Continued use of our website after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: "11. Contact Us",
    body: `If you have any questions about this privacy policy or how we handle your data, contact us:

Zenix Electronics
Cookie House, Accra Road, Nairobi CBD
Email: info@zenixelectronics.co.ke
Phone: +254 703 659 956
WhatsApp: +254 703 659 956`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <div className="mb-10">
        <h1
          className="text-3xl font-bold text-white md:text-4xl"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-[#8b92a5]">
          Last updated: 5 June 2026 &nbsp;·&nbsp; Zenix Electronics, Nairobi, Kenya
        </p>
        <p className="mt-4 text-[#8b92a5]">
          Your privacy matters to us. This policy explains what personal data we collect, why we
          collect it, and how we keep it safe.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {SECTIONS.map(({ title, body }) => (
          <div key={title} className="rounded-2xl border border-[#1e2435] bg-[#0d1117] p-6">
            <h2 className="mb-3 font-semibold text-white">{title}</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-[#8b92a5]">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
