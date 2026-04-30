"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Heart, GitCompare } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { useUIStore } from "@/stores/ui.store";
import type { Product } from "@/types";

interface Props {
  product: Product;
  showHotBadge?: boolean;
  priority?: boolean;
}

export function ProductCard({ product, showHotBadge, priority }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const addToComparison = useUIStore((s) => s.addToComparison);
  const comparisonList = useUIStore((s) => s.comparisonList);
  const isCompared = comparisonList.some((p) => p._id === product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0] ?? "",
      condition: product.condition,
      stock: product.stock,
    });
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    addToComparison(product);
  };

  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  return (
    <Link
      href={`/shop/${product.category}/${product.slug}`}
      className="group relative flex h-[340px] flex-col overflow-hidden rounded-2xl border border-[#1e2435] bg-[#0d1117] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#f5a623]/30 hover:shadow-[0_8px_32px_rgba(245,166,35,0.12)]"
    >
      {/* Image */}
      <div className="relative min-h-0 flex-1 overflow-hidden bg-[#111827]">
        <Image
          src={product.images[0] ?? "/logo.png"}
          alt={product.name}
          fill
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          className={`object-cover transition-all duration-500 group-hover:scale-105 ${product.images[1] ? "group-hover:opacity-0" : ""} ${isOutOfStock ? "opacity-50 grayscale" : ""}`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt={product.name}
            fill
            loading="lazy"
            className={`object-cover opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100 ${isOutOfStock ? "grayscale" : ""}`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0a0e1a]/60">
            <span className="rounded-lg bg-[#0a0e1a]/80 px-3 py-1 text-xs font-semibold text-[#8b92a5]">
              Out of Stock
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {product.condition === "ex-uk" && (
            <span className="rounded-md bg-[#38bdf8]/15 px-2 py-0.5 text-[10px] font-semibold text-[#38bdf8]">
              Ex UK
            </span>
          )}
          {product.condition === "ex-usa" && (
            <span className="rounded-md bg-[#a78bfa]/15 px-2 py-0.5 text-[10px] font-semibold text-[#a78bfa]">
              Ex USA
            </span>
          )}
          {product.isNewArrival && !showHotBadge && (
            <span className="rounded-md bg-[#22c55e]/15 px-2 py-0.5 text-[10px] font-semibold text-[#22c55e]">
              New
            </span>
          )}
          {showHotBadge && (
            <span className="shimmer rounded-md bg-[#f5a623]/20 px-2 py-0.5 text-[10px] font-semibold text-[#f5a623]">
              🔥 Hot Deal
            </span>
          )}
          {discount && (
            <span className="rounded-md bg-[#ef4444]/15 px-2 py-0.5 text-[10px] font-semibold text-[#ef4444]">
              -{discount}%
            </span>
          )}
        </div>

        {/* Action buttons — visible on hover */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 transition-all duration-200 group-hover:opacity-100">
          <button
            onClick={(e) => e.preventDefault()}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0a0e1a]/80 text-[#8b92a5] transition-colors hover:text-[#f5a623]"
            aria-label="Add to wishlist"
          >
            <Heart className="h-4 w-4" />
          </button>
          <button
            onClick={handleCompare}
            className={`flex h-8 w-8 items-center justify-center rounded-full bg-[#0a0e1a]/80 transition-colors ${isCompared ? "text-[#f5a623]" : "text-[#8b92a5] hover:text-[#f5a623]"}`}
            aria-label="Compare product"
          >
            <GitCompare className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="flex h-[112px] shrink-0 flex-col p-3">
        <h3 className="mb-2 line-clamp-2 text-sm leading-snug font-semibold text-white transition-colors duration-150 group-hover:text-[#f5a623]">
          {product.name}
        </h3>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="flex flex-col">
            <span
              className="text-base font-bold text-[#f5a623]"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              {product.variants && product.variants.length > 1 ? "From " : ""}KES{" "}
              {product.price.toLocaleString()}
            </span>
            {product.compareAtPrice && !product.variants?.length && (
              <span className="text-xs text-[#8b92a5] line-through">
                KES {product.compareAtPrice.toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#f5a623] text-[#0a0e1a] transition-all hover:bg-[#ff9f1c] hover:shadow-[0_0_12px_rgba(245,166,35,0.4)] active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>

        {isLowStock && (
          <p className="mt-1.5 text-[10px] font-medium text-[#f5a623]">Only {product.stock} left</p>
        )}
      </div>
    </Link>
  );
}
