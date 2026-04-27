"use client";

import { useRef, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Heart,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Tv,
  Headphones,
  Gamepad2,
  Wifi,
  Monitor,
  Plug,
  ShoppingCart,
  Star,
  Watch,
  Tablet,
} from "lucide-react";
import { cloudinaryUrl } from "@/lib/utils";
import { useCartStore } from "@/stores/cart.store";
import type { Product } from "@/types";

const CATEGORIES = [
  {
    value: "iphones",
    label: "iPhones",
    icon: Smartphone,
    color: "#a8d5e2",
    glow: "rgba(168,213,226,0.35)",
  },
  {
    value: "samsung",
    label: "Samsung",
    icon: Smartphone,
    color: "#1e88e5",
    glow: "rgba(30,136,229,0.35)",
  },
  { value: "ipad", label: "iPad", icon: Tablet, color: "#a78bfa", glow: "rgba(167,139,250,0.35)" },
  { value: "mac", label: "Mac", icon: Monitor, color: "#cbd5e1", glow: "rgba(203,213,225,0.35)" },
  {
    value: "wearables",
    label: "Wearables",
    icon: Watch,
    color: "#34d399",
    glow: "rgba(52,211,153,0.35)",
  },
  {
    value: "audio",
    label: "Audio",
    icon: Headphones,
    color: "#f87171",
    glow: "rgba(248,113,113,0.35)",
  },
  { value: "televisions", label: "TVs", icon: Tv, color: "#f5a623", glow: "rgba(245,166,35,0.35)" },
  {
    value: "gaming",
    label: "Gaming",
    icon: Gamepad2,
    color: "#f87171",
    glow: "rgba(248,113,113,0.35)",
  },
  {
    value: "connectivity",
    label: "Starlink",
    icon: Wifi,
    color: "#38bdf8",
    glow: "rgba(56,189,248,0.35)",
  },
  { value: "power", label: "Power", icon: Plug, color: "#22c55e", glow: "rgba(34,197,94,0.35)" },
  {
    value: "accessories",
    label: "Accessories",
    icon: ShoppingCart,
    color: "#fb923c",
    glow: "rgba(251,146,60,0.35)",
  },
];

function TrendingCarousel({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((s) => s.addItem);

  const scroll = (dir: "left" | "right") =>
    scrollRef.current?.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" });

  return (
    <div className="relative">
      <button
        onClick={() => scroll("left")}
        className="absolute top-1/2 -left-3 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#1e2435] bg-[#0d1117] text-[#8b92a5] shadow-lg transition hover:border-[#f5a623]/40 hover:text-[#f5a623] md:flex"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute top-1/2 -right-3 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#1e2435] bg-[#0d1117] text-[#8b92a5] shadow-lg transition hover:border-[#f5a623]/40 hover:text-[#f5a623] md:flex"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2"
        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
      >
        {products.map((p, i) => (
          <motion.div
            key={p._id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.35 }}
            className="w-40 shrink-0 sm:w-44"
            style={{ scrollSnapAlign: "start" }}
          >
            <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#1e2435] bg-[#0d1117] transition hover:border-[#f5a623]/25 hover:shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
              <Link
                href={`/shop/${p.category}/${p.slug}`}
                className="relative block aspect-square overflow-hidden bg-[#111827]"
              >
                <Image
                  src={cloudinaryUrl(p.images[0] ?? "/logo.png")}
                  alt={p.name}
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="176px"
                />
                {p.compareAtPrice && (
                  <span className="absolute top-2 left-2 rounded-md bg-[#f5a623] px-1.5 py-0.5 text-[10px] font-bold text-[#0a0e1a]">
                    SALE
                  </span>
                )}
              </Link>
              <div className="flex flex-col gap-1 p-3">
                <p className="line-clamp-2 text-xs leading-snug font-semibold text-white">
                  {p.name}
                </p>
                <p className="text-sm font-bold text-[#f5a623]">KES {p.price.toLocaleString()}</p>
                <button
                  onClick={() =>
                    addItem({
                      productId: p._id,
                      name: p.name,
                      price: p.price,
                      quantity: 1,
                      image: p.images[0] ?? "",
                      condition: p.condition,
                      stock: p.stock,
                    })
                  }
                  disabled={p.stock === 0}
                  className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#f5a623]/10 py-1.5 text-[11px] font-semibold text-[#f5a623] transition hover:bg-[#f5a623] hover:text-[#0a0e1a] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ShoppingCart className="h-3 w-3" />
                  {p.stock === 0 ? "Out of stock" : "Add to cart"}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function CategoryPill({ cat, index }: { cat: (typeof CATEGORIES)[number]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const Icon = cat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
    >
      <Link
        href={`/shop/${cat.value}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="flex flex-col items-center gap-2"
      >
        <motion.div
          animate={
            hovered
              ? { y: -6, rotate: [0, -8, 8, -4, 0], scale: 1.1 }
              : { y: 0, rotate: 0, scale: 1 }
          }
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="relative flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
            border: `1px solid ${hovered ? cat.color + "55" : "rgba(255,255,255,0.07)"}`,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: hovered
              ? `0 8px 24px ${cat.glow}, inset 0 1px 0 rgba(255,255,255,0.1)`
              : "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
            transition: "border-color 0.3s, box-shadow 0.3s",
          }}
        >
          <motion.div
            animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.8 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `radial-gradient(circle at center, ${cat.color}20 0%, transparent 70%)`,
            }}
          />
          <Icon
            className="relative z-10 h-6 w-6 transition-colors duration-300"
            style={{ color: hovered ? cat.color : "#8b92a5" }}
          />
        </motion.div>
        <span
          className="text-center text-[11px] font-semibold transition-colors duration-200"
          style={{ color: hovered ? cat.color : "#8b92a5" }}
        >
          {cat.label}
        </span>
      </Link>
    </motion.div>
  );
}

export default function OverviewPage() {
  const viewer = useQuery(api.users.viewer);
  const orders = useQuery(api.orders.getUserOrders);
  const wishlist = useQuery(api.wishlists.getWishlist);
  const featured = useQuery(api.products.getFeaturedProducts);

  const initials = viewer?.name
    ? viewer.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  const quickStats = [
    {
      label: "Total Orders",
      value: orders?.length ?? "—",
      icon: ShoppingBag,
      href: "/account/orders",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Wishlist Items",
      value: wishlist?.length ?? "—",
      icon: Heart,
      href: "/account/wishlist",
      color: "text-pink-400",
      bg: "bg-pink-400/10",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Mobile header */}
      <div className="flex items-center justify-between md:hidden">
        <div>
          <p className="text-xs font-semibold tracking-widest text-[#8b92a5] uppercase">
            Welcome back
          </p>
          <h1
            className="text-xl font-bold text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {viewer?.name ?? "—"}
          </h1>
        </div>
        <Link
          href="/account/settings"
          className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#f5a623] to-[#ff9f1c] shadow-[0_0_20px_rgba(245,166,35,0.25)]"
        >
          {viewer?.image ? (
            <Image
              src={cloudinaryUrl(viewer.image)}
              alt="avatar"
              fill
              className="object-cover"
              sizes="44px"
            />
          ) : (
            <span className="text-sm font-bold text-[#0a0e1a]">{initials}</span>
          )}
        </Link>
      </div>

      {/* Desktop header */}
      <div className="hidden md:block">
        <h1
          className="text-2xl font-bold text-white"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Overview
        </h1>
        <p className="mt-0.5 text-sm text-[#8b92a5]">
          Welcome back{viewer?.name ? `, ${viewer.name.split(" ")[0]}` : ""}
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        {quickStats.map(({ label, value, icon: Icon, href, color, bg }) => (
          <Link
            key={label}
            href={href}
            className="group flex items-center gap-3 rounded-2xl border border-[#1e2435] bg-[#0d1117] p-4 transition hover:border-[#f5a623]/20 hover:bg-[#111827]"
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="text-xs text-[#8b92a5]">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Trending carousel */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-[#f5a623]" />
            <h2 className="text-sm font-bold text-white">Trending Now</h2>
          </div>
          <Link href="/shop" className="text-xs font-semibold text-[#f5a623] hover:underline">
            View all →
          </Link>
        </div>
        {featured === undefined ? (
          <div className="flex h-48 items-center justify-center rounded-2xl border border-[#1e2435] bg-[#0d1117]">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#f5a623] border-t-transparent" />
          </div>
        ) : featured.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-2xl border border-[#1e2435] bg-[#0d1117]">
            <p className="text-sm text-[#8b92a5]">No featured products yet</p>
          </div>
        ) : (
          <TrendingCarousel products={featured as unknown as Product[]} />
        )}
      </div>

      {/* Category icons — glassmorphism panel */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Shop by Category</h2>
          <Link href="/categories" className="text-xs font-semibold text-[#f5a623] hover:underline">
            All →
          </Link>
        </div>
        <div
          className="rounded-2xl p-5"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            boxShadow: "0 4px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 lg:grid-cols-11">
            {CATEGORIES.map((cat, i) => (
              <CategoryPill key={cat.value} cat={cat} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
