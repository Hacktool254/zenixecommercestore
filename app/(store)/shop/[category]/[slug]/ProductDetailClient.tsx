"use client";

import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, GitCompare, MessageCircle, Minus, Plus, Package } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { useUIStore } from "@/stores/ui.store";
import { ProductCard } from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product, ProductVariant } from "@/types";

const WHATSAPP_BASE = "https://wa.me/254703659956?text=";

const SIM_LABELS: Record<string, string> = {
  "physical-sim": "Physical SIM",
  esim: "eSIM",
  wifi: "Wi-Fi",
  "wifi-5g": "Wi-Fi + 5G",
};

export default function ProductDetailClient() {
  const { slug } = useParams<{ slug: string }>();
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedStorage, setSelectedStorage] = useState<string | null>(null);
  const [selectedSim, setSelectedSim] = useState<string | null>(null);

  const product = useQuery(api.products.getProductBySlug, { slug });
  const relatedRaw = useQuery(
    api.products.getRelatedProducts,
    product ? { category: product.category, excludeId: product._id } : "skip"
  );
  const related = relatedRaw as Product[] | undefined;

  const addItem = useCartStore((s) => s.addItem);
  const addToComparison = useUIStore((s) => s.addToComparison);

  const variants = (product?.variants ?? []) as ProductVariant[];
  const hasVariants = variants.length > 0;

  // Unique storage options across all variants
  const storageOptions = useMemo(() => [...new Set(variants.map((v) => v.storage))], [variants]);

  // SIM options available for the currently selected storage
  const simOptions = useMemo(() => {
    if (!selectedStorage) return [];
    const sims = variants
      .filter((v) => v.storage === selectedStorage && v.simType)
      .map((v) => v.simType as string);
    return [...new Set(sims)];
  }, [variants, selectedStorage]);

  // Active variant based on selections
  const activeVariant: ProductVariant | null = useMemo(() => {
    if (!hasVariants) return null;
    if (selectedStorage && selectedSim) {
      return (
        variants.find((v) => v.storage === selectedStorage && v.simType === selectedSim) ?? null
      );
    }
    if (selectedStorage && simOptions.length === 0) {
      return variants.find((v) => v.storage === selectedStorage) ?? null;
    }
    return null;
  }, [variants, selectedStorage, selectedSim, simOptions, hasVariants]);

  // Displayed price + stock — falls back to product-level
  const displayPrice = activeVariant?.price ?? product?.price ?? 0;
  const displayStock = activeVariant?.stock ?? product?.stock ?? 0;

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

  const conditionLabel =
    product.condition === "ex-uk" ? "Ex UK" : product.condition === "ex-usa" ? "Ex USA" : null;
  const conditionColor =
    product.condition === "ex-uk" ? "#38bdf8" : product.condition === "ex-usa" ? "#a78bfa" : null;

  const variantLabel = [selectedStorage, selectedSim ? SIM_LABELS[selectedSim] : null]
    .filter(Boolean)
    .join(" · ");

  const whatsappMsg = encodeURIComponent(
    `Hi Zenix Electronics, I'd like to enquire about the ${product.name}${variantLabel ? ` (${variantLabel})` : ""} at KES ${displayPrice.toLocaleString()}. Is it available?`
  );

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      name: product.name + (variantLabel ? ` — ${variantLabel}` : ""),
      price: displayPrice,
      quantity: qty,
      image: product.images[0] ?? "",
      condition: product.condition,
      stock: displayStock,
    });
  };

  const canAddToCart =
    !hasVariants || (selectedStorage !== null && (simOptions.length === 0 || selectedSim !== null));

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
              src={product.images[activeImage] ?? "/logo.png"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {conditionLabel && (
              <span
                className="absolute top-3 left-3 rounded-md px-2 py-0.5 text-[10px] font-semibold"
                style={{ background: `${conditionColor}22`, color: conditionColor! }}
              >
                {conditionLabel}
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
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    fill
                    loading="lazy"
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="flex flex-col">
          <p className="mb-1 text-xs font-semibold tracking-widest text-[#f5a623] uppercase">
            {product.brand ? `${product.brand} · ` : ""}
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
              {hasVariants && !activeVariant ? "From " : ""}KES {displayPrice.toLocaleString()}
            </span>
            {product.compareAtPrice && !hasVariants && (
              <span className="text-base text-[#8b92a5] line-through">
                KES {product.compareAtPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* ── Storage selector ── */}
          {storageOptions.length > 0 && (
            <div className="mb-5">
              <p className="mb-2.5 text-xs font-semibold tracking-widest text-[#8b92a5] uppercase">
                Storage
                {selectedStorage && (
                  <span className="ml-2 font-medium text-white normal-case">{selectedStorage}</span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {storageOptions.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSelectedStorage(s);
                      setSelectedSim(null);
                    }}
                    className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-all ${
                      selectedStorage === s
                        ? "border-[#f5a623] bg-[#f5a623]/10 text-[#f5a623] shadow-[inset_0_0_0_1px_rgba(245,166,35,0.4)]"
                        : "border-[#1e2435] text-[#8b92a5] hover:border-[#f5a623]/40 hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── SIM type selector ── */}
          {simOptions.length > 0 && (
            <div className="mb-5">
              <p className="mb-2.5 text-xs font-semibold tracking-widest text-[#8b92a5] uppercase">
                Connectivity
                {selectedSim && (
                  <span className="ml-2 font-medium text-white normal-case">
                    {SIM_LABELS[selectedSim]}
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {simOptions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSim(s)}
                    className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-all ${
                      selectedSim === s
                        ? "border-[#f5a623] bg-[#f5a623]/10 text-[#f5a623] shadow-[inset_0_0_0_1px_rgba(245,166,35,0.4)]"
                        : "border-[#1e2435] text-[#8b92a5] hover:border-[#f5a623]/40 hover:text-white"
                    }`}
                  >
                    {SIM_LABELS[s] ?? s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock status */}
          <div className="mb-6 flex items-center gap-2">
            <Package className="h-4 w-4 text-[#8b92a5]" />
            {displayStock === 0 ? (
              <span className="text-sm font-medium text-[#ef4444]">Out of stock</span>
            ) : displayStock <= 3 ? (
              <span className="text-sm font-medium text-[#f5a623]">
                Only {displayStock} left in stock
              </span>
            ) : (
              <span className="text-sm font-medium text-[#22c55e]">
                In stock ({displayStock} available)
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
                onClick={() => setQty(Math.min(displayStock, qty + 1))}
                disabled={displayStock === 0}
                className="flex h-10 w-10 items-center justify-center text-[#8b92a5] transition-colors hover:text-white disabled:opacity-40"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={displayStock === 0 || !canAddToCart}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#f5a623] px-6 py-3 text-sm font-semibold text-[#0a0e1a] transition-all hover:bg-[#ff9f1c] hover:shadow-[0_0_20px_rgba(245,166,35,0.35)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ShoppingCart className="h-4 w-4" />
              {!canAddToCart ? "Select options" : "Add to Cart"}
            </button>

            <button
              onClick={() => {}}
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
              price: displayPrice,
              availability:
                displayStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
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
