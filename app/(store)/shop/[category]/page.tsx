import type { Metadata } from "next";
import CategoryClient from "./CategoryClient";

type Props = { params: Promise<{ category: string }> };

const CATEGORY_META: Record<string, { label: string; description: string }> = {
  iphones: {
    label: "iPhones in Nairobi",
    description:
      "Buy brand new & Ex UK iPhones in Nairobi — iPhone 16, 15 Pro Max, 14 and more. All models, all storage sizes. Cookie House, Accra Road.",
  },
  samsung: {
    label: "Samsung Phones in Nairobi",
    description:
      "Buy brand new & Ex UK Samsung phones in Nairobi — Galaxy S25 Ultra, S24, A-series and more. Cookie House, Accra Road.",
  },
  mac: {
    label: "MacBooks & Mac in Nairobi",
    description:
      "Buy Apple MacBook Pro, MacBook Air, Mac Mini in Nairobi. Brand new & Ex UK. Cookie House, Accra Road.",
  },
  ipad: {
    label: "iPads in Nairobi",
    description:
      "Buy iPad Pro, iPad Air, iPad Mini in Nairobi. Brand new & Ex UK, all models. Cookie House, Accra Road.",
  },
  ipads: {
    label: "iPads in Nairobi",
    description:
      "Buy iPad Pro, iPad Air, iPad Mini in Nairobi. Brand new & Ex UK, all models. Cookie House, Accra Road.",
  },
  wearables: {
    label: "Apple Watch & Wearables in Nairobi",
    description:
      "Buy Apple Watch Ultra, Series 9, Samsung Galaxy Watch and wearables in Nairobi. Brand new & Ex UK.",
  },
  audio: {
    label: "Headphones & Soundbars in Nairobi",
    description:
      "Buy AirPods Max, AirPods Pro, Bose, Sony soundbars and headphones in Nairobi. Brand new & Ex UK.",
  },
  accessories: {
    label: "Phone & Laptop Accessories in Nairobi",
    description:
      "Buy Apple Pencil, MagSafe chargers, cables, cases and accessories in Nairobi. Cookie House, Accra Road.",
  },
  televisions: {
    label: "Smart TVs in Nairobi",
    description:
      "Buy Samsung, LG, Sony and TCL smart TVs in Nairobi. 4K, QLED, OLED — all sizes. Cookie House, Accra Road.",
  },
  gaming: {
    label: "PlayStation & Gaming in Nairobi",
    description:
      "Buy PlayStation 5, PS5 Pro, gaming accessories and controllers in Nairobi. Brand new. Cookie House, Accra Road.",
  },
  connectivity: {
    label: "Starlink & Routers in Kenya",
    description:
      "Buy Starlink satellite internet kits and routers in Kenya. Fast delivery nationwide.",
  },
  power: {
    label: "Power Banks & Chargers in Nairobi",
    description:
      "Buy Anker power banks, fast chargers, MagSafe chargers and power solutions in Nairobi.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const meta = CATEGORY_META[category] ?? {
    label: category.charAt(0).toUpperCase() + category.slice(1),
    description: `Browse ${category} at Zenix Electronics, Nairobi.`,
  };

  return {
    title: meta.label,
    description: meta.description,
    openGraph: {
      title: `${meta.label} — Zenix Electronics`,
      description: meta.description,
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.label} — Zenix Electronics`,
      description: meta.description,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://zenixelectronics.co.ke"}/shop/${category}`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zenixecommercestore.vercel.app";
  const meta = CATEGORY_META[category] ?? {
    label: category.charAt(0).toUpperCase() + category.slice(1),
    description: "",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Shop", item: `${BASE_URL}/shop` },
      {
        "@type": "ListItem",
        position: 2,
        name: meta.label,
        item: `${BASE_URL}/shop/${category}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CategoryClient />
    </>
  );
}
