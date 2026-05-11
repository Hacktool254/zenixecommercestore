import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Electronics in Nairobi — iPhones, MacBooks, TVs & More",
  description:
    "Browse all electronics at Zenix Electronics, Nairobi. Brand new and Ex UK iPhones, Samsung, MacBooks, iPads, TVs, PlayStation, Starlinks, AirPods and more. Same-day delivery.",
  openGraph: {
    title: "Shop All Electronics — Zenix Electronics Nairobi",
    description:
      "Brand new & Ex UK iPhones, MacBooks, Samsung, TVs, PlayStation and more. Cookie House, Accra Road, Nairobi. Same-day delivery.",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop All Electronics — Zenix Electronics Nairobi",
    description:
      "Brand new & Ex UK iPhones, MacBooks, Samsung, TVs, PlayStation and more. Nairobi. Same-day delivery.",
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://zenixelectronics.co.ke"}/shop`,
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
