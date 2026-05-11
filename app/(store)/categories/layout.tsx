import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop by Category — Electronics in Nairobi",
  description:
    "Browse by category at Zenix Electronics: iPhones, Samsung, MacBooks, iPads, TVs, PlayStation, Starlinks, AirPods, wearables and accessories. Nairobi, Kenya.",
  openGraph: {
    title: "Shop by Category — Zenix Electronics Nairobi",
    description:
      "Browse all categories at Zenix Electronics. iPhones, MacBooks, TVs, PlayStation, Starlinks and more in Nairobi.",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://zenixelectronics.co.ke"}/categories`,
  },
};

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
