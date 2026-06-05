import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zenixelectronics.co.ke";

export const metadata: Metadata = {
  title: "Terms of Service — Zenix Electronics",
  description:
    "Terms and conditions for shopping at Zenix Electronics, Nairobi. Read our purchase terms, delivery policy, returns, and dispute resolution.",
  alternates: {
    canonical: `${BASE_URL}/terms`,
  },
};

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: `By accessing or using zenixelectronics.co.ke (the "Site") or purchasing any product from Zenix Electronics, you agree to be bound by these Terms of Service. If you do not agree, please do not use the Site.

These terms are governed by the laws of the Republic of Kenya.`,
  },
  {
    title: "2. About Zenix Electronics",
    body: `Zenix Electronics is a retail electronics business registered in Kenya, operating from Cookie House, Accra Road, Nairobi CBD. We sell brand new and Ex UK/USA electronics including smartphones, laptops, televisions, gaming consoles, audio equipment, and accessories.

Contact: info@zenixelectronics.co.ke | +254 703 659 956`,
  },
  {
    title: "3. Products & Pricing",
    body: `• All prices are displayed in Kenyan Shillings (KES) and are inclusive of applicable taxes.
• Product descriptions, images, and specifications are provided for informational purposes and are as accurate as possible.
• We reserve the right to correct pricing errors. If a product is listed at an incorrect price, we will notify you before processing your order.
• Stock availability is shown on each product page. We reserve the right to cancel orders if stock becomes unavailable after purchase.
• "Ex UK" and "Ex USA" products are pre-owned devices sourced from the UK or USA. Their condition is described on each product listing.`,
  },
  {
    title: "4. Orders & Payment",
    body: `• Orders are confirmed once payment is successfully processed.
• We accept M-Pesa (via Co-operative Bank STK Push) and debit/credit cards (via Paystack).
• For M-Pesa payments, you will receive a payment prompt on your phone. Enter your PIN to complete the transaction.
• Zenix Electronics reserves the right to cancel or refuse any order at its discretion, including in cases of suspected fraud or payment failure.
• You will receive an order confirmation via email once your order is placed.`,
  },
  {
    title: "5. Delivery",
    body: `• We deliver within Nairobi and surrounding areas. Delivery fees and timelines are shown at checkout.
• Standard delivery fee is KES 300 within Nairobi CBD and nearby areas. Fees for other areas may vary.
• Delivery timelines are estimates and may be affected by traffic, public holidays, or other factors outside our control.
• You are responsible for providing accurate delivery information. We are not liable for failed deliveries due to incorrect addresses.
• Risk of loss and title for products pass to you upon delivery.`,
  },
  {
    title: "6. Returns & Refunds",
    body: `Our returns policy is detailed at zenixelectronics.co.ke/returns. In summary:

• Dead-on-arrival (DOA) devices must be reported within 48 hours of delivery.
• Hardware defects are covered within 90 days of purchase.
• Physical damage, liquid damage, and user-caused faults are not covered.
• Refunds are processed within 3–5 business days after approval.
• Change of mind after opening a sealed product is not covered.

Contact us via WhatsApp (+254 703 659 956) or email to initiate a return.`,
  },
  {
    title: "7. Warranty",
    body: `All devices sold at Zenix Electronics carry a 90-day quality guarantee from the date of purchase. This covers hardware defects not caused by physical damage or user modification. The guarantee does not cover:

• Physical damage (cracked screens, liquid damage, dents)
• Damage caused by third-party repairs or accessories
• Software issues caused by jailbreaking, rooting, or unauthorised modifications
• Normal wear and tear`,
  },
  {
    title: "8. Intellectual Property",
    body: `All content on this Site including text, images, logos, and product descriptions is the property of Zenix Electronics or its suppliers and is protected by applicable intellectual property laws. You may not reproduce, distribute, or use any content without our written permission.`,
  },
  {
    title: "9. Limitation of Liability",
    body: `To the fullest extent permitted by Kenyan law, Zenix Electronics shall not be liable for:

• Indirect, incidental, or consequential damages arising from the use of our products or website.
• Loss of data, revenue, or profits.
• Damages arising from delays, delivery failures, or events outside our reasonable control (force majeure).

Our total liability to you shall not exceed the amount you paid for the product giving rise to the claim.`,
  },
  {
    title: "10. Dispute Resolution",
    body: `Any disputes arising from these terms or your purchase shall be resolved as follows:

1. Contact our customer service team at info@zenixelectronics.co.ke. We aim to resolve all disputes within 7 business days.
2. If unresolved, disputes shall be submitted to mediation under the Kenyan Arbitration Act.
3. These terms are governed by and construed in accordance with the laws of the Republic of Kenya. The courts of Kenya shall have exclusive jurisdiction.`,
  },
  {
    title: "11. Changes to Terms",
    body: `We reserve the right to update these Terms of Service at any time. Changes will be posted on this page with an updated date. Continued use of the Site after changes constitutes acceptance of the revised terms.`,
  },
  {
    title: "12. Contact",
    body: `Zenix Electronics
Cookie House, Accra Road, Nairobi CBD
Email: info@zenixelectronics.co.ke
Phone: +254 703 659 956
WhatsApp: +254 703 659 956`,
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <div className="mb-10">
        <h1
          className="text-3xl font-bold text-white md:text-4xl"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-[#8b92a5]">
          Last updated: 5 June 2026 &nbsp;·&nbsp; Zenix Electronics, Nairobi, Kenya
        </p>
        <p className="mt-4 text-[#8b92a5]">
          Please read these terms carefully before placing an order. By purchasing from Zenix
          Electronics you agree to these terms.
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
