"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProductCard } from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/types";

const CARD_W = 290;
const CARD_H = 460;
const AUTO_MS = 2600;

const SLOT: Record<number, { x: number; scale: number; opacity: number; z: number }> = {
  [-3]: { x: -760, scale: 0.44, opacity: 0, z: 0 },
  [-2]: { x: -520, scale: 0.64, opacity: 0.38, z: 1 },
  [-1]: { x: -288, scale: 0.82, opacity: 0.7, z: 3 },
  [0]: { x: 0, scale: 1.0, opacity: 1.0, z: 5 },
  [1]: { x: 288, scale: 0.82, opacity: 0.7, z: 3 },
  [2]: { x: 520, scale: 0.64, opacity: 0.38, z: 1 },
  [3]: { x: 760, scale: 0.44, opacity: 0, z: 0 },
};

const SPRING = { type: "spring" as const, stiffness: 260, damping: 28, mass: 0.9 };

function SkeletonCard() {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-2xl border border-[#1e2435] bg-[#0d1117]"
      style={{ height: CARD_H }}
    >
      <Skeleton className="aspect-square w-full" />
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="mt-2 flex justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-8 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function ElectricCard({
  product,
  isCenter,
  priority,
}: {
  product: Product;
  isCenter: boolean;
  priority?: boolean;
}) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRX = useSpring(rotateX, { stiffness: 150, damping: 20 });
  const springRY = useSpring(rotateY, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCenter) return;
    const rect = e.currentTarget.getBoundingClientRect();
    rotateY.set(((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * 15);
    rotateX.set(-((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * 10);
  };

  const handleMouseLeave = () => {
    if (!isCenter) return;
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isCenter ? springRX : 0,
        rotateY: isCenter ? springRY : 0,
        transformStyle: "preserve-3d",
        borderRadius: 20,
        padding: 2,
        position: "relative",
        background:
          "linear-gradient(-30deg, rgba(245,166,35,0.10) 0%, transparent 50%, rgba(245,166,35,0.10) 100%), #0d1117",
      }}
    >
      <ProductCard product={product} priority={priority} />
    </motion.div>
  );
}

export function HotDeals() {
  const sectionRef = useRef<HTMLElement>(null);
  const products = useQuery(api.products.getHotDeals);
  const [center, setCenter] = useState(10_000);
  const carouselRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wheelLockRef = useRef(false);
  const touchStartX = useRef(0);

  // Recede behind VideoExpandSection — same mechanic as NewArrivals behind HotDeals
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const scrollScale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);
  const scrollY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  const items: Product[] = products ? (products as Product[]) : [];
  const count = items.length;

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (count < 2) return;
    timerRef.current = setInterval(() => setCenter((c) => c + 1), AUTO_MS);
  }, [count]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Always auto-play — no pause on hover
  useEffect(() => {
    startTimer();
    return stopTimer;
  }, [startTimer, stopTimer]);

  // Touch swipe
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const onTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0]!.clientX;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const dx = touchStartX.current - e.changedTouches[0]!.clientX;
      if (Math.abs(dx) < 40) return;
      setCenter((c) => (dx > 0 ? c + 1 : c - 1));
      stopTimer();
      if (resumeRef.current) clearTimeout(resumeRef.current);
      resumeRef.current = setTimeout(startTimer, 1400);
    };
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [startTimer, stopTimer]);

  const cards = [-3, -2, -1, 0, 1, 2, 3].map((slot) => {
    const key = center + slot;
    const product = count > 0 ? items[((key % count) + count) % count] : null;
    return { slot, key, product };
  });

  return (
    <motion.section
      ref={sectionRef}
      style={{ scale: scrollScale, y: scrollY, transformOrigin: "center top" }}
      className="sticky top-0 z-0 overflow-hidden bg-[#080c16] py-14"
    >
      {/* Header */}
      <div className="relative z-10 mx-auto mb-10 flex max-w-[1600px] items-end justify-between px-4 md:px-6 lg:px-10">
        <div>
          <p className="mb-1 text-xs font-semibold tracking-widest text-[#f5a623] uppercase">
            Limited Time
          </p>
          <h2
            className="text-2xl font-bold text-white sm:text-3xl"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Hot Deals
          </h2>
        </div>
        <Link
          href="/deals"
          className="flex items-center gap-1.5 text-sm font-medium text-[#8b92a5] transition-colors hover:text-[#f5a623]"
        >
          View All <ArrowRight className="inline h-4 w-4" />
        </Link>
      </div>

      {/* Carousel */}
      <div ref={carouselRef} className="relative" style={{ height: CARD_H + 60 }}>
        <button
          onClick={() => setCenter((c) => c - 1)}
          aria-label="Previous"
          className="absolute top-1/2 left-4 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#f5a623]/30 bg-[#0d1117]/80 text-[#f5a623] backdrop-blur-sm transition-all hover:border-[#f5a623]/70 hover:bg-[#f5a623]/10 hover:shadow-[0_0_20px_rgba(245,166,35,0.25)] active:scale-90"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => setCenter((c) => c + 1)}
          aria-label="Next"
          className="absolute top-1/2 right-4 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#f5a623]/30 bg-[#0d1117]/80 text-[#f5a623] backdrop-blur-sm transition-all hover:border-[#f5a623]/70 hover:bg-[#f5a623]/10 hover:shadow-[0_0_20px_rgba(245,166,35,0.25)] active:scale-90"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {cards.map(({ slot, key, product }) => {
          const cfg = SLOT[slot]!;
          return (
            <motion.div
              key={key}
              initial={{ x: cfg.x, scale: cfg.scale, opacity: cfg.opacity }}
              animate={{ x: cfg.x, scale: cfg.scale, opacity: cfg.opacity }}
              transition={SPRING}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: CARD_W,
                marginLeft: -CARD_W / 2,
                marginTop: -(CARD_H / 2),
                zIndex: cfg.z,
              }}
            >
              {!product ? (
                <SkeletonCard />
              ) : (
                <ElectricCard product={product} isCenter={slot === 0} priority={slot === 0} />
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
