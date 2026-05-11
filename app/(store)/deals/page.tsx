import type { Metadata } from "next";
import { DealsClient } from "./DealsClient";

export const metadata: Metadata = {
  title: "Hot Deals on Electronics in Nairobi — Zenix Electronics",
  description:
    "Limited time deals on iPhones, Samsung, MacBooks, TVs, PlayStation and more at Zenix Electronics, Nairobi. Best prices guaranteed.",
  openGraph: {
    title: "Hot Deals on Electronics — Zenix Electronics Nairobi",
    description: "Limited time deals on premium electronics in Nairobi. Best prices guaranteed.",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hot Deals on Electronics — Zenix Electronics Nairobi",
    description: "Limited time deals on iPhones, Samsung, MacBooks, TVs, PlayStation and more.",
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://zenixelectronics.co.ke"}/deals`,
  },
};

export default function DealsPage() {
  return <DealsClient />;
}
