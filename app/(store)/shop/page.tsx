"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProductGrid } from "@/components/products/ProductGrid";
import { FilterSidebar, FilterSheet, SORT_OPTIONS } from "@/components/products/Filters";
import { X } from "lucide-react";
import type { Product } from "@/types";

const CHIP_LABELS: Record<string, (v: string) => string> = {
  category: (v) => v.charAt(0).toUpperCase() + v.slice(1),
  condition: (v) => (v === "brand-new" ? "Brand New" : "Ex UK"),
  maxPrice: (v) => `Max KES ${Number(v).toLocaleString()}`,
  inStock: () => "In Stock Only",
};

export default function ShopPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const category = searchParams.get("category") ?? undefined;
  const condition = (searchParams.get("condition") as "brand-new" | "ex-uk" | null) ?? undefined;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
  const inStockOnly = searchParams.get("inStock") === "1" ? true : undefined;
  const sortBy = (searchParams.get("sort") as "newest" | "price-asc" | "price-desc") ?? "newest";

  const products = useQuery(api.products.getAllProducts, {
    category,
    condition,
    maxPrice,
    inStockOnly,
    sortBy,
  });

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  const activeChips = ["category", "condition", "maxPrice", "inStock"].filter((k) =>
    searchParams.get(k)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {category ? category.charAt(0).toUpperCase() + category.slice(1) : "All Products"}
          </h1>
          {products !== undefined && (
            <p className="mt-0.5 text-sm text-[#8b92a5]">{products.length} products</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile filter + sort */}
          <FilterSheet sortValue={sortBy} onSortChange={handleSort} />

          {/* Desktop sort */}
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
      </div>

      {/* Active filter chips */}
      {activeChips.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {activeChips.map((key) => (
            <span
              key={key}
              className="flex items-center gap-1.5 rounded-full border border-[#f5a623]/30 bg-[#f5a623]/10 px-3 py-1 text-xs font-medium text-[#f5a623]"
            >
              {CHIP_LABELS[key]?.(searchParams.get(key)!) ?? key}
              <button onClick={() => removeFilter(key)} aria-label={`Remove ${key} filter`}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <button
            onClick={() => router.push(pathname)}
            className="text-xs text-[#8b92a5] hover:text-white"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Body */}
      <div className="flex gap-8">
        <FilterSidebar />
        <div className="min-w-0 flex-1">
          <ProductGrid products={products as Product[] | undefined} />
        </div>
      </div>
    </div>
  );
}
