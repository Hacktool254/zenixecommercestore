"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cloudinaryUrl } from "@/lib/utils";
import type { Product } from "@/types";

const LERP = 0.1;
const CARD_H = 270;

interface CardState {
  curRotY: number;
  tgtRotY: number;
  curScale: number;
  tgtScale: number;
  curPX: number;
  tgtPX: number;
  curPY: number;
  tgtPY: number;
}

function ArrivalCard({ product }: { product: Product }) {
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  return (
    <Link
      href={`/shop/${product.category}/${product.slug}`}
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-[#1e2435] bg-[#0d1117]"
      style={{ backfaceVisibility: "hidden" }}
    >
      <div className="relative flex-1 overflow-hidden">
        <Image
          src={cloudinaryUrl(product.images[0] ?? "/logo.png")}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          loading="lazy"
          className={`object-cover transition-all duration-500 group-hover:scale-105 ${product.images[1] ? "group-hover:opacity-0" : ""}`}
        />
        {product.images[1] && (
          <Image
            src={cloudinaryUrl(product.images[1])}
            alt={product.name}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            className="object-cover opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
          />
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/50 to-transparent px-2 pt-8 pb-2">
          <p
            className="text-[10px] font-bold text-[#f5a623]"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            KES {product.price.toLocaleString()}
          </p>
          {product.compareAtPrice && (
            <p className="text-[8px] text-[#8b92a5] line-through">
              KES {product.compareAtPrice.toLocaleString()}
            </p>
          )}
        </div>
        <div className="absolute top-1.5 left-1.5 flex flex-col gap-0.5">
          {product.isNewArrival && (
            <span className="rounded bg-[#22c55e]/15 px-1 py-0.5 text-[8px] font-bold text-[#22c55e]">
              New
            </span>
          )}
          {product.condition === "ex-uk" && (
            <span className="rounded bg-[#38bdf8]/15 px-1 py-0.5 text-[8px] font-bold text-[#38bdf8]">
              Ex UK
            </span>
          )}
          {product.condition === "ex-usa" && (
            <span className="rounded bg-[#a78bfa]/15 px-1 py-0.5 text-[8px] font-bold text-[#a78bfa]">
              Ex USA
            </span>
          )}
          {discount && (
            <span className="rounded bg-[#ef4444]/15 px-1 py-0.5 text-[8px] font-bold text-[#ef4444]">
              -{discount}%
            </span>
          )}
        </div>
      </div>
      <div className="px-2 py-1.5">
        <p className="line-clamp-1 text-[9px] leading-tight font-semibold text-[#cbd5e1]">
          {product.name}
        </p>
      </div>
    </Link>
  );
}

export function NewArrivals() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const states = useRef<CardState[]>([]);
  const rafId = useRef(0);

  // Scale down as HotDeals scrolls over the top — same mechanic as Hero
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const scrollScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  const products = useQuery(api.products.getNewArrivals);
  const allItems = (products ?? []) as Product[];
  // 3 rows × 6 cols on desktop; all 18 cards reflow naturally on smaller screens
  const items = allItems.slice(0, 18);
  const count = items.length;

  // Init card states
  useEffect(() => {
    if (count === 0) return;
    states.current = Array.from({ length: count }, () => ({
      curRotY: 0,
      tgtRotY: 0,
      curScale: 1,
      tgtScale: 1,
      curPX: 0,
      tgtPX: 0,
      curPY: 0,
      tgtPY: 0,
    }));
    cardRefs.current = Array(count).fill(null);
  }, [count]);

  // rAF loop — desktop hover effects only
  useEffect(() => {
    if (count === 0) return;
    const tick = () => {
      states.current.forEach((s, i) => {
        s.curRotY += (s.tgtRotY - s.curRotY) * LERP;
        s.curScale += (s.tgtScale - s.curScale) * LERP;
        s.curPX += (s.tgtPX - s.curPX) * LERP;
        s.curPY += (s.tgtPY - s.curPY) * LERP;
        const el = cardRefs.current[i];
        if (!el) return;
        el.style.transform = [
          `perspective(600px)`,
          `translate(${s.curPX}px, ${s.curPY}px)`,
          `rotateY(${s.curRotY}deg)`,
          `scale(${s.curScale})`,
        ].join(" ");
      });
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [count]);

  // Mouse events (desktop only)
  useEffect(() => {
    const container = containerRef.current;
    if (!container || count === 0) return;

    const onMove = (e: MouseEvent) => {
      states.current.forEach((s, i) => {
        const el = cardRefs.current[i];
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 220) {
          const f = Math.max(0, 1 - dist / 110);
          const angle = Math.atan2(dy, dx);
          s.tgtRotY = 18 * f;
          s.tgtScale = 1 + 0.08 * f;
          s.tgtPX = -10 * f * Math.cos(angle);
          s.tgtPY = -10 * f * Math.sin(angle);
        } else {
          s.tgtRotY = 0;
          s.tgtScale = 1;
          s.tgtPX = 0;
          s.tgtPY = 0;
        }
      });
    };

    const onLeave = () => {
      states.current.forEach((s) => {
        s.tgtRotY = 0;
        s.tgtScale = 1;
        s.tgtPX = 0;
        s.tgtPY = 0;
      });
    };

    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);
    return () => {
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, [count]);

  return (
    <motion.section
      ref={sectionRef}
      style={{ scale: scrollScale, transformOrigin: "center top" }}
      className="sticky top-0 z-0 bg-[#0a0e1a] px-4 py-10 md:px-6 lg:px-10"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-1/3 right-1/4 h-[400px] w-[400px] rounded-full blur-[160px]"
          style={{ background: "rgba(245,166,35,0.04)" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold tracking-widest text-[#f5a623] uppercase">
              Just Landed
            </p>
            <h2
              className="text-2xl font-bold text-white sm:text-3xl"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              New Arrivals
            </h2>
          </div>
          <Link
            href="/shop?filter=new"
            className="flex items-center gap-1.5 text-sm font-medium text-[#8b92a5] transition-colors hover:text-[#f5a623]"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Always 6 cols × 3 rows — horizontal scroll on small screens */}
        <div className="overflow-x-auto">
          <div
            ref={containerRef}
            className="grid gap-2"
            style={{
              gridTemplateColumns: "repeat(6, minmax(140px, 1fr))",
              minWidth: 900,
            }}
          >
            {items.map((product, i) => (
              <div
                key={product._id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                style={{
                  height: CARD_H,
                  willChange: "transform",
                }}
              >
                <ArrivalCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
