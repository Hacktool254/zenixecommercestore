import type { MetadataRoute } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zenixecommercestore.vercel.app";

const CATEGORIES = [
  "iphones",
  "mac",
  "audio",
  "accessories",
  "tvs",
  "gaming",
  "connectivity",
  "power",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    {
      url: `${BASE_URL}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/delivery`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${BASE_URL}/shop/${cat}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await fetchQuery(api.products.getAllProducts, {});
    productRoutes = products.map((p) => ({
      url: `${BASE_URL}/shop/${p.category}/${p.slug}`,
      lastModified: new Date(p._creationTime),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // Convex not available at build time — product routes omitted
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
