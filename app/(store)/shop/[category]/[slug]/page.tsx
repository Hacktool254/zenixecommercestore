import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";

export const dynamic = "force-dynamic";
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

  const conditionLabel =
    product.condition === "brand-new"
      ? "Brand New"
      : product.condition === "ex-uk"
        ? "Ex UK"
        : "Ex USA";
  const title = `Buy ${product.name} (${conditionLabel}) — KES ${product.price.toLocaleString()} | Nairobi`;
  const description =
    product.description.length > 155
      ? product.description.slice(0, 152) + "..."
      : product.description;
  const image = product.images[0] ?? "/opengraph-image.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: product.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: `${BASE_URL}/shop/${(await params).category}/${slug}`,
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

  const productJsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: product.images,
        sku: product.slug,
        brand: {
          "@type": "Brand",
          name: product.brand ?? categoryLabel,
        },
        offers: {
          "@type": "Offer",
          url: `${BASE_URL}/shop/${category}/${slug}`,
          priceCurrency: "KES",
          price: product.price,
          priceValidUntil: "2026-12-31",
          availability:
            product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          seller: {
            "@type": "Organization",
            name: "Zenix Electronics",
            url: BASE_URL,
          },
          itemCondition:
            product.condition === "brand-new"
              ? "https://schema.org/NewCondition"
              : "https://schema.org/UsedCondition",
        },
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      <ProductDetailClient />
    </>
  );
}
