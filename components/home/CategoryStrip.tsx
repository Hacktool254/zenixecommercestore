"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "framer-motion";
import {
  Smartphone,
  Tv,
  Headphones,
  Gamepad2,
  Wifi,
  Plug,
  ShoppingBag,
  Monitor,
  Watch,
  Tablet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Category {
  label: string;
  href: string;
  icon: LucideIcon;
  color: string;
  glow: string;
  image?: string;
}

const CATEGORIES: Category[] = [
  {
    label: "iPhones",
    href: "/shop/iphones",
    icon: Smartphone,
    color: "#a8d5e2",
    glow: "rgba(168,213,226,0.10)",
    image: "/categories/iphones.jpg",
  },
  {
    label: "Samsung",
    href: "/shop/samsung",
    icon: Smartphone,
    color: "#1e88e5",
    glow: "rgba(30,136,229,0.10)",
    image: "/categories/samsung.jpg",
  },
  {
    label: "iPad",
    href: "/shop/ipad",
    icon: Tablet,
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.10)",
    image: "/categories/ipad.jpg",
  },
  {
    label: "Mac",
    href: "/shop/mac",
    icon: Monitor,
    color: "#cbd5e1",
    glow: "rgba(203,213,225,0.10)",
    image: "/categories/mac.jpg",
  },
  {
    label: "Wearables",
    href: "/shop/wearables",
    icon: Watch,
    color: "#34d399",
    glow: "rgba(52,211,153,0.10)",
    image: "/categories/wearables.png",
  },
  {
    label: "Audio",
    href: "/shop/audio",
    icon: Headphones,
    color: "#f87171",
    glow: "rgba(248,113,113,0.10)",
    image: "/categories/audio.jpg",
  },
  {
    label: "Televisions",
    href: "/shop/televisions",
    icon: Tv,
    color: "#f5a623",
    glow: "rgba(245,166,35,0.10)",
    image: "/categories/televisions.jpg",
  },
  {
    label: "Gaming",
    href: "/shop/gaming",
    icon: Gamepad2,
    color: "#f87171",
    glow: "rgba(248,113,113,0.10)",
    image: "/categories/gaming.jpg",
  },
  {
    label: "Starlink",
    href: "/shop/connectivity",
    icon: Wifi,
    color: "#38bdf8",
    glow: "rgba(56,189,248,0.10)",
    image: "/categories/connectivity.jpg",
  },
  {
    label: "Power",
    href: "/shop/power",
    icon: Plug,
    color: "#22c55e",
    glow: "rgba(34,197,94,0.10)",
    image: "/categories/power.jpg",
  },
  {
    label: "Accessories",
    href: "/shop/accessories",
    icon: ShoppingBag,
    color: "#fb923c",
    glow: "rgba(251,146,60,0.10)",
    image: "/categories/accessories.jpg",
  },
];

const SLIDE_W = 320;
const SLIDE_H = 440;
const GAP = 72;

interface SlideProps {
  item: Category;
  index: number;
  rowX: MotionValue<number>;
  padding: number;
  vw: number;
}

// Each slide computes its own scale/offsetX from the live row x position —
// exactly mirrors the Smooth-scroll-Slider: right of center = bigger + pushed right,
// left of center = smaller + fades.
function CategorySlide({ item, index, rowX, padding, vw }: SlideProps) {
  const Icon = item.icon;
  const slideCenter = padding + index * (SLIDE_W + GAP) + SLIDE_W / 2;

  const scale = useTransform(rowX, (x) => {
    const visual = slideCenter + x;
    const dist = visual - vw / 2;
    if (dist > 0) return Math.min(1.75, 1 + dist / vw);
    return Math.max(0.5, 1 - Math.abs(dist) / vw);
  });

  const pushX = useTransform(rowX, (x) => {
    const visual = slideCenter + x;
    const dist = visual - vw / 2;
    if (dist > 0) {
      const s = Math.min(1.75, 1 + dist / vw);
      return (s - 1) * 300;
    }
    return 0;
  });

  const opacity = useTransform(rowX, (x) => {
    const visual = slideCenter + x;
    const dist = visual - vw / 2;
    if (dist < 0) return Math.max(0.3, 1 - Math.abs(dist) / vw);
    return 1;
  });

  const hasImage = !!item.image;

  return (
    <motion.div
      style={{
        scale,
        x: pushX,
        opacity,
        width: SLIDE_W,
        height: SLIDE_H,
        flexShrink: 0,
        transformOrigin: "center center",
      }}
    >
      <Link
        href={item.href}
        className="group relative flex h-full w-full flex-col items-center justify-between overflow-hidden rounded-3xl border border-[#1e2435] transition-all duration-300"
        style={{
          background: hasImage
            ? "#0d1117"
            : `radial-gradient(ellipse at 50% 15%, ${item.glow} 0%, #0d1117 70%)`,
          boxShadow: hasImage
            ? `0 0 0 1px ${item.color}30, 0 0 60px ${item.color}25, 0 0 120px ${item.color}10`
            : undefined,
        }}
      >
        {/* Image fills entire card background */}
        {hasImage && (
          <>
            <Image
              src={item.image!}
              alt={item.label}
              fill
              sizes="320px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(10,14,26,0.85) 0%, rgba(10,14,26,0.3) 50%, transparent 100%)",
              }}
            />
          </>
        )}

        {/* Icon */}
        <div className="relative z-10 flex flex-1 items-center justify-center p-8">
          <div
            className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-[1.75rem] transition-transform duration-300 group-hover:scale-105"
            style={
              hasImage
                ? {
                    boxShadow: `inset 0 0 32px ${item.color}50, inset 0 0 12px ${item.color}35`,
                    border: `1px solid ${item.color}40`,
                    background: `radial-gradient(circle, ${item.color}08 0%, transparent 70%)`,
                  }
                : {
                    background: `radial-gradient(circle, ${item.glow} 0%, transparent 70%)`,
                    boxShadow: `0 0 40px ${item.color}20`,
                    border: "1px solid #1e2435",
                  }
            }
          >
            <Icon
              className="h-14 w-14"
              style={{
                color: item.color,
                filter: hasImage ? `drop-shadow(0 0 8px ${item.color}90)` : undefined,
              }}
            />
          </div>
        </div>

        {/* Label */}
        <div className="relative z-10 w-full p-8 pt-0 text-center">
          <p
            className="text-2xl font-bold tracking-tight uppercase"
            style={{ fontFamily: "var(--font-space-grotesk)", color: item.color }}
          >
            {item.label}
          </p>
          <p className="mt-2 text-[10px] font-semibold tracking-[0.2em] text-[#8b92a5] uppercase">
            Shop Now →
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export function CategoryStrip() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [vw, setVw] = useState(1440);
  const [maxScroll, setMaxScroll] = useState(5000);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      setVw(w);
      // padding centres the first/last slide
      const pad = w / 2 - SLIDE_W / 2;
      const totalRowW = pad * 2 + CATEGORIES.length * SLIDE_W + (CATEGORIES.length - 1) * GAP;
      setMaxScroll(Math.max(0, totalRowW - w));
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  // Scroll progress over the extra height equals row travel distance
  const { scrollYProgress } = useScroll({ target: wrapperRef });
  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -maxScroll]);
  // Spring smoothing replicates lerp(0.075) from the original script
  const rowX = useSpring(xRaw, { stiffness: 80, damping: 22, mass: 0.5 });

  const padding = vw / 2 - SLIDE_W / 2;

  return (
    // Tall wrapper — extra height = total horizontal travel
    <div
      ref={wrapperRef}
      style={{ height: `calc(100vh + ${maxScroll}px)` }}
      className="relative z-10 bg-[#080c16]"
    >
      {/* Sticky inner — stays in viewport while user scrolls through wrapper */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Ambient blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute top-1/3 left-1/4 h-[500px] w-[500px] rounded-full blur-[160px]"
            style={{ background: "rgba(245,166,35,0.04)" }}
          />
          <div
            className="absolute right-1/4 bottom-1/3 h-[400px] w-[400px] rounded-full blur-[130px]"
            style={{ background: "rgba(56,189,248,0.04)" }}
          />
        </div>

        {/* Section label — left center, reveals then exits left with scroll */}
        <motion.div
          initial={{ clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" }}
          whileInView={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ x: rowX }}
          className="absolute top-1/2 left-8 z-10 -translate-y-1/2"
        >
          <p className="mb-1 text-xs font-semibold tracking-widest text-[#f5a623] uppercase">
            Explore
          </p>
          <h2
            className="text-3xl font-bold text-white md:text-4xl"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Shop by Category
          </h2>
        </motion.div>

        {/* Scroll hint */}
        <div className="absolute right-8 bottom-8 z-10 flex items-center gap-3">
          <span className="text-[10px] font-semibold tracking-widest text-[#8b92a5] uppercase">
            Scroll to explore
          </span>
          <div className="h-px w-10 bg-[#8b92a5]/30" />
        </div>

        {/* Horizontal sliding row */}
        <motion.div
          className="absolute top-0 flex h-full items-center"
          style={{
            x: rowX,
            paddingLeft: padding,
            paddingRight: padding,
            gap: GAP,
          }}
        >
          {CATEGORIES.map((cat, i) => (
            <CategorySlide
              key={cat.href}
              item={cat}
              index={i}
              rowX={rowX}
              padding={padding}
              vw={vw}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
