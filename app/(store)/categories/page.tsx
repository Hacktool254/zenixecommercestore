"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { WidgetCarousel } from "@/components/shared/WidgetCarousel";
import type { WidgetItem } from "@/components/shared/WidgetCarousel";
import {
  Smartphone,
  Tv,
  Headphones,
  Gamepad2,
  Wifi,
  Monitor,
  Plug,
  ShoppingBag,
  ArrowRight,
  Watch,
  Tablet,
} from "lucide-react";

const CATEGORIES = [
  {
    value: "iphones",
    label: "iPhones",
    description: "Brand new & Ex USA iPhones — iPhone 12 Pro to 17 Pro Max. All storage options.",
    icon: Smartphone,
    color: "#a8d5e2",
    bg: "rgba(168,213,226,0.08)",
    border: "rgba(168,213,226,0.15)",
    image: "/categories/iphones.jpg",
  },
  {
    value: "samsung",
    label: "Samsung",
    description: "Galaxy S-series, Z Fold & Z Flip — brand new and Ex UK. S23 Ultra to Z Fold 7.",
    icon: Smartphone,
    color: "#1e88e5",
    bg: "rgba(30,136,229,0.08)",
    border: "rgba(30,136,229,0.15)",
    image: "/categories/samsung.jpg",
  },
  {
    value: "ipad",
    label: "iPad",
    description: "iPad 10th Gen to iPad Pro M5. Wi-Fi and 5G models, all storage options.",
    icon: Tablet,
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.15)",
    image: "/categories/ipad.jpg",
  },
  {
    value: "mac",
    label: "Mac",
    description: "MacBook Air M4/M5, MacBook Pro M5, Mac Mini M4. Brand new sealed units.",
    icon: Monitor,
    color: "#cbd5e1",
    bg: "rgba(203,213,225,0.08)",
    border: "rgba(203,213,225,0.15)",
    image: "/categories/mac.jpg",
  },
  {
    value: "wearables",
    label: "Wearables",
    description: "Apple Watch Series 6–11, SE 3, Ultra 2 & Ultra 3. Every size and model.",
    icon: Watch,
    color: "#34d399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.15)",
    image: "/categories/wearables.jpg",
  },
  {
    value: "audio",
    label: "Audio",
    description: "AirPods 4, AirPods Pro 3, AirPods Max. The full Apple audio lineup.",
    icon: Headphones,
    color: "#f87171",
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.15)",
    image: "/categories/audio.jpg",
  },
  {
    value: "televisions",
    label: "Televisions",
    description: "Smart TVs from Samsung, LG, Sony and more. 4K, OLED, QLED — all sizes.",
    icon: Tv,
    color: "#f5a623",
    bg: "rgba(245,166,35,0.08)",
    border: "rgba(245,166,35,0.15)",
    image: "/categories/televisions.jpg",
  },
  {
    value: "gaming",
    label: "Gaming",
    description: "PlayStation 5, gaming chairs, controllers and accessories for every gamer.",
    icon: Gamepad2,
    color: "#f87171",
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.15)",
    image: "/categories/gaming.jpg",
  },
  {
    value: "connectivity",
    label: "Starlink & Connectivity",
    description: "Starlink kits, routers and internet solutions for homes and businesses in Kenya.",
    icon: Wifi,
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.08)",
    border: "rgba(56,189,248,0.15)",
    image: "/categories/connectivity.jpg",
  },
  {
    value: "power",
    label: "Power",
    description: "Power banks, fast chargers and power solutions for every need.",
    icon: Plug,
    color: "#22c55e",
    bg: "rgba(34,197,94,0.08)",
    border: "rgba(34,197,94,0.15)",
    image: "/categories/power.jpg",
  },
  {
    value: "accessories",
    label: "Accessories",
    description: "Apple Pencil, AirTag, Magic Mouse, Magic Keyboard, Apple TV 4K and more.",
    icon: ShoppingBag,
    color: "#fb923c",
    bg: "rgba(251,146,60,0.08)",
    border: "rgba(251,146,60,0.15)",
    image: "/categories/accessories.jpg",
  },
];

function CategoryCard({ cat, index }: { cat: (typeof CATEGORIES)[number]; index: number }) {
  const products = useQuery(api.products.getAllProducts, { category: cat.value });
  const count = products?.length ?? null;
  const Icon = cat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.07, 0.42) }}
    >
      <Link
        href={`/shop/${cat.value}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
        style={{ borderColor: cat.border }}
      >
        {/* Category image */}
        <div className="relative h-44 w-full overflow-hidden bg-[#0d1117]">
          <Image
            src={cat.image}
            alt={cat.label}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, ${cat.bg.replace("0.08", "0.6")} 0%, transparent 60%)`,
            }}
          />
          {count !== null && (
            <span
              className="absolute top-3 right-3 rounded-full px-2 py-0.5 text-xs font-semibold backdrop-blur-sm"
              style={{
                background: `${cat.color}25`,
                color: cat.color,
                border: `1px solid ${cat.color}30`,
              }}
            >
              {count}
            </span>
          )}
        </div>

        {/* Card body */}
        <div className="flex flex-1 flex-col p-5" style={{ background: cat.bg }}>
          {/* Icon + label */}
          <div className="mb-2 flex items-center gap-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
              style={{ background: `${cat.color}18`, border: `1px solid ${cat.color}30` }}
            >
              <Icon className="h-5 w-5" style={{ color: cat.color }} />
            </div>
            <h2
              className="text-lg font-bold text-white"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              {cat.label}
            </h2>
          </div>

          {/* Description */}
          <p className="mb-4 flex-1 text-sm leading-relaxed text-[#8b92a5]">{cat.description}</p>

          {/* CTA */}
          <div
            className="flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200"
            style={{ color: cat.color }}
          >
            Browse {cat.label}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

const CATEGORY_WIDGETS: WidgetItem[] = [
  {
    id: "iphones",
    label: "iPhones",
    sub: "12 Pro → 17 Pro Max",
    color: "#a8d5e2",
    href: "/shop/iphones",
  },
  {
    id: "samsung",
    label: "Samsung",
    sub: "S-series · Z Fold · Z Flip",
    color: "#1e88e5",
    href: "/shop/samsung",
  },
  {
    id: "gaming",
    label: "Gaming",
    sub: "PS5 Pro · Xbox Series X",
    color: "#f87171",
    href: "/shop/gaming",
  },
  { id: "mac", label: "Mac", sub: "Air M4/M5 · Pro M5", color: "#cbd5e1", href: "/shop/mac" },
  { id: "ipad", label: "iPad", sub: "10th Gen → Pro M5", color: "#a78bfa", href: "/shop/ipads" },
  {
    id: "wearables",
    label: "Wearables",
    sub: "Series 6–11 · Ultra 3",
    color: "#34d399",
    href: "/shop/wearables",
  },
  {
    id: "audio",
    label: "Audio",
    sub: "AirPods 4 · AirPods Max",
    color: "#f87171",
    href: "/shop/audio",
  },
  {
    id: "televisions",
    label: "Televisions",
    sub: 'TCL 4K · 55"–85"',
    color: "#f5a623",
    href: "/shop/televisions",
  },
];

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-[1600px] px-4 py-10 md:px-6 lg:px-8">
      <div className="flex gap-8 xl:gap-10">
        {/* Main content */}
        <div className="min-w-0 flex-1">
          {/* Header */}
          <div className="mb-10">
            <p className="mb-1 text-xs font-semibold tracking-widest text-[#f5a623] uppercase">
              Browse
            </p>
            <h1
              className="mb-2 text-3xl font-bold text-white sm:text-4xl"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              All Categories
            </h1>
            <p className="text-sm text-[#8b92a5]">
              Explore our full range of premium electronics — brand new and Ex UK.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {CATEGORIES.map((cat, i) => (
              <CategoryCard key={cat.value} cat={cat} index={i} />
            ))}
          </div>
        </div>

        {/* Right widget — desktop only */}
        <div className="hidden w-[220px] shrink-0 flex-col pt-[76px] xl:flex">
          <p className="mb-3 text-[10px] font-semibold tracking-widest text-[#8b92a5] uppercase">
            Popular
          </p>
          <div className="sticky top-24 h-[480px]">
            <WidgetCarousel items={CATEGORY_WIDGETS} autoScrollMs={2800} />
          </div>
        </div>
      </div>
    </div>
  );
}
