import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Zenix Electronics Nairobi",
  description:
    "Zenix Electronics is Nairobi's trusted electronics store. Brand new and Ex UK iPhones, MacBooks, Samsung, TVs and more. Cookie House, Accra Road, Nairobi CBD.",
  openGraph: {
    title: "About Zenix Electronics — Nairobi's Trusted Electronics Store",
    description:
      "Zenix Electronics — brand new and Ex UK gadgets verified before sale. Cookie House, Accra Road, Nairobi CBD.",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://zenixelectronics.co.ke"}/about`,
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
