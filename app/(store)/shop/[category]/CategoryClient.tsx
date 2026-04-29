"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProductGrid } from "@/components/products/ProductGrid";
import { FilterSheet, SORT_OPTIONS } from "@/components/products/Filters";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { Product } from "@/types";

const CATEGORY_META: Record<string, { label: string; description: string }> = {
  iphones: {
    label: "iPhones",
    description: "Brand new & Ex USA iPhones — iPhone 12 Pro to 17 Pro Max.",
  },
  samsung: {
    label: "Samsung",
    description: "Galaxy S-series, Z Fold & Z Flip — brand new and Ex UK.",
  },
  ipad: { label: "iPad", description: "iPad 10th Gen to iPad Pro M5. Wi-Fi and 5G models." },
  mac: { label: "Mac", description: "MacBook Air M4/M5, MacBook Pro M5, Mac Mini M4." },
  wearables: {
    label: "Wearables",
    description: "Apple Watch Series 6–11, SE 3, Ultra 2 & Ultra 3.",
  },
  audio: { label: "Audio", description: "AirPods 4, AirPods Pro 3, AirPods Max." },
  televisions: { label: "Televisions", description: "Smart TVs — Samsung, LG, Sony and more." },
  gaming: { label: "Gaming", description: "PlayStation, gaming chairs and accessories." },
  connectivity: {
    label: "Starlink & Connectivity",
    description: "Starlink kits and routers for Kenya.",
  },
  power: { label: "Power", description: "Power banks, fast chargers and power solutions." },
  accessories: {
    label: "Accessories",
    description: "Apple Pencil, AirTag, Magic Mouse, Keyboard, Apple TV.",
  },
};

export default function CategoryClient() {
  const { category } = useParams<{ category: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const sortBy = (searchParams.get("sort") as "newest" | "price-asc" | "price-desc") ?? "newest";

  const products = useQuery(api.products.getAllProducts, { category, sortBy });

  const meta = CATEGORY_META[category] ?? { label: category, description: "" };

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      {/* Category banner */}
      <div className="mb-8 rounded-2xl border border-[#1e2435] bg-[#0d1117] px-6 py-8">
        <p className="mb-1 text-xs font-semibold tracking-widest text-[#f5a623] uppercase">
          Category
        </p>
        <h1
          className="mb-2 text-3xl font-bold text-white sm:text-4xl"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          {meta.label}
        </h1>
        <p className="text-sm text-[#8b92a5]">{meta.description}</p>
        {products !== undefined && (
          <p className="mt-3 text-xs text-[#8b92a5]">{products.length} products</p>
        )}
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex items-center justify-between">
        <FilterSheet sortValue={sortBy} onSortChange={handleSort} />
        <select
          value={sortBy}
          onChange={(e) => handleSort(e.target.value)}
          className="hidden rounded-xl border border-[#1e2435] bg-[#0d1117] px-3 py-2.5 text-sm text-[#cbd5e1] outline-none focus:border-[#f5a623]/40 lg:block"
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value} className="bg-[#0d1117]">
              {label}
            </option>
          ))}
        </select>
      </div>

      <ProductGrid products={products as Product[] | undefined} />
    </div>
  );
}
