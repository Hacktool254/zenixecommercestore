import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import ProductDetailClient from "./ProductDetailClient";

type Props = { params: Promise<{ category: string; slug: string }> };

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zenixecommercestore.vercel.app";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchQuery(api.products.getProductBySlug, { slug }).catch(() => null);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const title = `${product.name} — KES ${product.price.toLocaleString()}`;
  const description = product.description.slice(0, 160);
  const image = product.images[0] ?? "/logo.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image, alt: product.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { category, slug } = await params;
  const product = await fetchQuery(api.products.getProductBySlug, { slug }).catch(() => null);

  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Shop", item: `${BASE_URL}/shop` },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryLabel,
        item: `${BASE_URL}/shop/${category}`,
      },
      ...(product
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: product.name,
              item: `${BASE_URL}/shop/${category}/${slug}`,
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductDetailClient />
    </>
  );
}
