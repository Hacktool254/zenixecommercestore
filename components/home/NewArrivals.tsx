"use client";

import { useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Product } from "@/types";

const CARD_H = 270;

function ArrivalCard({ product }: { product: Product }) {
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  return (
    <Link
      href={`/shop/${product.category}/${product.slug}`}
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-[#1e2435] bg-[#0d1117]"
    >
      <div className="relative flex-1 overflow-hidden">
        <Image
          src={product.images[0] ?? "/logo.png"}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          loading="lazy"
          className={`object-cover transition-all duration-500 group-hover:scale-105 ${product.images[1] ? "group-hover:opacity-0" : ""}`}
        />
        {product.images[1] && (
          <Image
            src={product.images[1]}
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

function TiltArrivalCard({ product, index }: { product: Product; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRX = useSpring(rotateX, { stiffness: 200, damping: 22 });
  const springRY = useSpring(rotateY, { stiffness: 200, damping: 22 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = cardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      rotateY.set(((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * 8);
      rotateX.set(-((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * 6);
    },
    [rotateX, rotateY]
  );

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.4) }}
      style={{
        height: CARD_H,
        rotateX: springRX,
        rotateY: springRY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <ArrivalCard product={product} />
    </motion.div>
  );
}

export function NewArrivals() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const scrollScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  const products = useQuery(api.products.getNewArrivals);
  const items = ((products ?? []) as Product[]).slice(0, 18);

  return (
    <motion.section
      ref={sectionRef}
      style={{ scale: scrollScale, transformOrigin: "center top" }}
      className="sticky top-0 z-0 bg-[#0a0e1a] px-4 py-10 md:px-6 lg:px-10"
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-1/3 right-1/4 h-[400px] w-[400px] rounded-full blur-[160px]"
          style={{ background: "rgba(245,166,35,0.04)" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px]">
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

        <div className="overflow-x-auto">
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: "repeat(6, minmax(140px, 1fr))",
              minWidth: 900,
            }}
          >
            {items.map((product, i) => (
              <TiltArrivalCard key={product._id} product={product} index={i} />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
