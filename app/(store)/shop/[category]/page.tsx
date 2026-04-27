import type { Metadata } from "next";
import CategoryClient from "./CategoryClient";

type Props = { params: Promise<{ category: string }> };

const CATEGORY_META: Record<string, { label: string; description: string }> = {
  iphones: { label: "iPhones", description: "Brand new & Ex UK iPhones — all models, all grades." },
  mac: { label: "Mac", description: "Apple Mac Mini, MacBook and more." },
  tvs: { label: "Televisions", description: "Smart TVs — Samsung, LG, Sony and more." },
  audio: { label: "Audio", description: "Soundbars, headphones, speakers." },
  gaming: { label: "Gaming", description: "PlayStation, gaming chairs and accessories." },
  connectivity: {
    label: "Starlink & Connectivity",
    description: "Starlink kits and routers for Kenya.",
  },
  power: { label: "Power", description: "Power banks, chargers, UPS solutions." },
  accessories: { label: "Accessories", description: "Apple Pencil, cables, cases and more." },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const meta = CATEGORY_META[category] ?? {
    label: category.charAt(0).toUpperCase() + category.slice(1),
    description: `Browse ${category} at Zenix Electronics, Nairobi.`,
  };

  return {
    title: meta.label,
    description: `${meta.description} Located at Accra Road, Cookie House, Nairobi.`,
    openGraph: {
      title: `${meta.label} — Zenix Electronics`,
      description: meta.description,
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
