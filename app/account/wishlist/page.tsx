"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import type { Product } from "@/types";

export default function WishlistPage() {
  const items = useQuery(api.wishlists.getWishlist);
  const removeFromWishlist = useMutation(api.wishlists.removeFromWishlist);
  const addItem = useCartStore((s) => s.addItem);

  const handleRemove = (productId: Id<"products">) => {
    void removeFromWishlist({ productId });
  };

  const handleAddToCart = (product: Product) => {
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

  if (items === undefined) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#f5a623] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1
          className="text-xl font-bold text-white"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Wishlist
        </h1>
        <p className="mt-0.5 text-sm text-[#8b92a5]">
          {items.length} item{items.length !== 1 ? "s" : ""}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-[#1e2435] bg-[#0d1117] px-6 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1e2435]">
            <Heart className="h-7 w-7 text-[#8b92a5]" />
          </div>
          <p className="font-semibold text-white">Your wishlist is empty</p>
          <p className="text-sm text-[#8b92a5]">Save items you love and come back to them later.</p>
          <Link
            href="/shop"
            className="mt-1 rounded-xl bg-[#f5a623] px-5 py-2.5 text-sm font-bold text-[#0a0e1a] transition hover:bg-[#ff9f1c]"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {items.map(({ _id, productId, product }) => {
            if (!product) return null;
            const p = product as unknown as Product;
            const isOutOfStock = p.stock === 0;

            return (
              <div
                key={_id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#1e2435] bg-[#0d1117] transition hover:border-[#f5a623]/30"
              >
                {/* Remove button */}
                <button
                  onClick={() => handleRemove(productId)}
                  className="absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#0a0e1a]/80 text-[#8b92a5] opacity-0 transition group-hover:opacity-100 hover:text-red-400"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>

                {/* Image */}
                <Link
                  href={`/shop/${p.category}/${p.slug}`}
                  className="relative block aspect-square overflow-hidden bg-[#111827]"
                >
                  <Image
                    src={p.images[0] ?? "/logo.png"}
                    alt={p.name}
                    fill
                    className={`object-cover transition-transform duration-300 group-hover:scale-105 ${isOutOfStock ? "opacity-50 grayscale" : ""}`}
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                  {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#0a0e1a]/50">
                      <span className="rounded-lg bg-[#0a0e1a]/80 px-2.5 py-1 text-xs font-semibold text-[#8b92a5]">
                        Out of stock
                      </span>
                    </div>
                  )}
                  {p.condition === "ex-uk" && (
                    <span className="absolute top-2 left-2 rounded-md bg-[#38bdf8]/15 px-2 py-0.5 text-[10px] font-semibold text-[#38bdf8]">
                      Ex UK
                    </span>
                  )}
                </Link>

                {/* Info */}
                <div className="flex flex-1 flex-col p-3">
                  <Link href={`/shop/${p.category}/${p.slug}`}>
                    <h3 className="mb-2 line-clamp-2 text-sm leading-snug font-semibold text-white transition-colors hover:text-[#f5a623]">
                      {p.name}
                    </h3>
                  </Link>
                  <div className="mt-auto flex items-end justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-[#f5a623]">
                        KES {p.price.toLocaleString()}
                      </span>
                      {p.compareAtPrice && (
                        <span className="text-xs text-[#8b92a5] line-through">
                          KES {p.compareAtPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(p)}
                      disabled={isOutOfStock}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#f5a623] text-[#0a0e1a] transition hover:bg-[#ff9f1c] hover:shadow-[0_0_12px_rgba(245,166,35,0.4)] active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Add to cart"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
