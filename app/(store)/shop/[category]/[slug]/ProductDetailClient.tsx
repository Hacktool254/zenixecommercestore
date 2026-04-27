"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  GitCompare,
  MessageCircle,
  ChevronLeft,
  Minus,
  Plus,
  Package,
} from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { useUIStore } from "@/stores/ui.store";
import { cloudinaryUrl } from "@/lib/utils";
import { ProductCard } from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/types";

const WHATSAPP_BASE = "https://wa.me/254703659956?text=";

export default function ProductDetailClient() {
  const { slug } = useParams<{ slug: string }>();
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);

  const product = useQuery(api.products.getProductBySlug, { slug });
  const relatedRaw = useQuery(
    api.products.getRelatedProducts,
    product ? { category: product.category, excludeId: product._id } : "skip"
  );
  const related = relatedRaw as Product[] | undefined;

  const addItem = useCartStore((s) => s.addItem);
  const addToComparison = useUIStore((s) => s.addToComparison);

  if (product === undefined) return <ProductDetailSkeleton />;
  if (product === null)
    return (
      <div className="flex flex-1 items-center justify-center py-32 text-center">
        <div>
          <p className="mb-2 text-lg font-semibold text-white">Product not found</p>
          <Link href="/shop" className="text-sm text-[#f5a623] hover:underline">
            Back to shop
          </Link>
        </div>
      </div>
    );

  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  const whatsappMsg = encodeURIComponent(
    `Hi Zenix Electronics, I'd like to enquire about the ${product.name} (KES ${product.price.toLocaleString()}). Is it available?`
  );

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: qty,
      image: product.images[0] ?? "",
      condition: product.condition,
      stock: product.stock,
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-[#8b92a5]">
        <Link href="/shop" className="hover:text-white">
          Shop
        </Link>
        <span>/</span>
        <Link href={`/shop/${product.category}`} className="capitalize hover:text-white">
          {product.category}
        </Link>
        <span>/</span>
        <span className="max-w-[200px] truncate text-[#cbd5e1]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Image gallery */}
        <div className="flex flex-col gap-3">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            className="relative aspect-square overflow-hidden rounded-2xl bg-[#111827]"
          >
            <Image
              src={cloudinaryUrl(product.images[activeImage] ?? "/logo.png")}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {product.condition === "ex-uk" && (
              <span className="absolute top-3 left-3 rounded-md bg-[#38bdf8]/15 px-2 py-0.5 text-[10px] font-semibold text-[#38bdf8]">
                Ex UK
              </span>
            )}
            {discount && (
              <span className="absolute top-3 right-3 rounded-md bg-[#ef4444]/15 px-2 py-0.5 text-[10px] font-semibold text-[#ef4444]">
                -{discount}%
              </span>
            )}
          </motion.div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${activeImage === i ? "border-[#f5a623]" : "border-[#1e2435]"}`}
                >
                  <Image
                    src={cloudinaryUrl(img)}
                    alt={`${product.name} ${i + 1}`}
                    fill
                    loading="lazy"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="flex flex-col">
          <p className="mb-2 text-xs font-semibold tracking-widest text-[#f5a623] uppercase">
            {product.category}
          </p>
          <h1
            className="mb-4 text-2xl leading-snug font-bold text-white sm:text-3xl"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {product.name}
          </h1>

          {/* Price */}
          <div className="mb-5 flex items-baseline gap-3">
            <span
              className="text-3xl font-bold text-[#f5a623]"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              KES {product.price.toLocaleString()}
            </span>
            {product.compareAtPrice && (
              <span className="text-base text-[#8b92a5] line-through">
                KES {product.compareAtPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Stock status */}
          <div className="mb-6 flex items-center gap-2">
            <Package className="h-4 w-4 text-[#8b92a5]" />
            {product.stock === 0 ? (
              <span className="text-sm font-medium text-[#ef4444]">Out of stock</span>
            ) : product.stock <= 3 ? (
              <span className="text-sm font-medium text-[#f5a623]">
                Only {product.stock} left in stock
              </span>
            ) : (
              <span className="text-sm font-medium text-[#22c55e]">
                In stock ({product.stock} available)
              </span>
            )}
          </div>

          {/* Quantity + actions */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-xl border border-[#1e2435] bg-[#0d1117]">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="flex h-10 w-10 items-center justify-center text-[#8b92a5] transition-colors hover:text-white"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-semibold text-white">{qty}</span>
              <button
                onClick={() => setQty(Math.min(product.stock, qty + 1))}
                disabled={product.stock === 0}
                className="flex h-10 w-10 items-center justify-center text-[#8b92a5] transition-colors hover:text-white disabled:opacity-40"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#f5a623] px-6 py-3 text-sm font-semibold text-[#0a0e1a] transition-all hover:bg-[#ff9f1c] hover:shadow-[0_0_20px_rgba(245,166,35,0.35)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
              }}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#1e2435] text-[#8b92a5] transition-colors hover:border-[#f5a623]/40 hover:text-[#f5a623]"
              aria-label="Add to wishlist"
            >
              <Heart className="h-5 w-5" />
            </button>
            <button
              onClick={() => addToComparison(product as Product)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#1e2435] text-[#8b92a5] transition-colors hover:border-[#f5a623]/40 hover:text-[#f5a623]"
              aria-label="Compare"
            >
              <GitCompare className="h-5 w-5" />
            </button>
          </div>

          {/* WhatsApp inquiry */}
          <a
            href={`${WHATSAPP_BASE}${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-8 flex items-center gap-2.5 rounded-xl border border-[#25d366]/30 bg-[#25d366]/10 px-5 py-3 text-sm font-medium text-[#25d366] transition-colors hover:bg-[#25d366]/15"
          >
            <MessageCircle className="h-4 w-4" />
            Ask about this product on WhatsApp
          </a>

          {/* Specs */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="mb-6 overflow-hidden rounded-2xl border border-[#1e2435] bg-[#0d1117]">
              <p className="border-b border-[#1e2435] px-5 py-3 text-xs font-semibold tracking-widest text-[#8b92a5] uppercase">
                Specifications
              </p>
              <table className="w-full">
                <tbody>
                  {Object.entries(product.specs).map(([key, val], i) => (
                    <tr key={key} className={i % 2 === 0 ? "bg-[#0a0e1a]/40" : ""}>
                      <td className="px-5 py-2.5 text-xs font-medium text-[#8b92a5]">{key}</td>
                      <td className="px-5 py-2.5 text-xs text-[#cbd5e1]">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Description */}
          <div>
            <p className="mb-2 text-xs font-semibold tracking-widest text-[#8b92a5] uppercase">
              Description
            </p>
            <p className="text-sm leading-relaxed text-[#cbd5e1]">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related && related.length > 0 && (
        <div className="mt-16">
          <h2
            className="mb-6 text-xl font-bold text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Related Products
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            image: product.images,
            offers: {
              "@type": "Offer",
              priceCurrency: "KES",
              price: product.price,
              availability:
                product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              seller: { "@type": "Organization", name: "Zenix Electronics" },
            },
          }),
        }}
      />
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-4 w-24" />
          <div className="mt-2 flex gap-3">
            <Skeleton className="h-11 w-28 rounded-xl" />
            <Skeleton className="h-11 flex-1 rounded-xl" />
            <Skeleton className="h-11 w-11 rounded-xl" />
          </div>
          <Skeleton className="mt-2 h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
