"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Zap } from "lucide-react";
import { WidgetCarousel } from "@/components/shared/WidgetCarousel";
import type { WidgetItem } from "@/components/shared/WidgetCarousel";

const HEADLINE_WORDS = ["Premium", "Electronics,", "Nairobi's", "Best."];

const circuitPath =
  "M10 10 L50 10 L50 30 L90 30 M30 10 L30 50 L70 50 L70 70 L110 70 M70 30 L70 10 M90 70 L130 70 L130 50 M110 10 L110 50";

const WIDGET_ITEMS: WidgetItem[] = [
  {
    id: "iphone17pro",
    label: "iPhone 17 Pro Max",
    sub: "From KES 189,999 · 256GB–1TB",
    color: "#a8d5e2",
  },
  {
    id: "s26ultra",
    label: "Samsung S26 Ultra",
    sub: "From KES 179,999 · 256GB–1TB",
    color: "#1e88e5",
  },
  { id: "ps5pro", label: "PlayStation 5 Pro", sub: "KES 84,999 · Brand New", color: "#f87171" },
  { id: "mbprom5", label: "MacBook Pro M5", sub: "KES 349,999 · 16GB RAM", color: "#cbd5e1" },
  {
    id: "ipadpro",
    label: 'iPad Pro 13" M5',
    sub: "From KES 179,999 · Wi-Fi & 5G",
    color: "#a78bfa",
  },
  { id: "applewatch", label: "Apple Watch Ultra 3", sub: "KES 99,999 · 49mm", color: "#34d399" },
  { id: "airpodsmax", label: "AirPods Max USB-C", sub: "KES 54,999 · Brand New", color: "#f87171" },
  {
    id: "iphone16",
    label: "iPhone 16 Series",
    sub: "From KES 129,999 · Brand New",
    color: "#a8d5e2",
  },
  { id: "tcl85", label: 'TCL C8L 85"', sub: "KES 189,999 · 4K Smart TV", color: "#f5a623" },
  { id: "zfold7", label: "Samsung Z Fold 7", sub: "KES 219,999 · Brand New", color: "#1e88e5" },
];

export function Hero() {
  const logoRef = useRef<HTMLDivElement>(null);

  // Mouse tilt for logo
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [18, -18]), {
    stiffness: 180,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-18, 18]), {
    stiffness: 180,
    damping: 22,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mouseX.set(e.clientX - cx);
    mouseY.set(e.clientY - cy);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      className="relative flex min-h-screen items-center overflow-hidden bg-[#0a0e1a]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Circuit board background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.svg
          className="absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.03, 0.07, 0.03] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <defs>
            <pattern
              id="circuit"
              x="0"
              y="0"
              width="140"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <path d={circuitPath} fill="none" stroke="#f5a623" strokeWidth="1" />
              <circle cx="10" cy="10" r="2.5" fill="#f5a623" />
              <circle cx="50" cy="10" r="2.5" fill="#f5a623" />
              <circle cx="50" cy="30" r="2.5" fill="#f5a623" />
              <circle cx="90" cy="30" r="2.5" fill="#f5a623" />
              <circle cx="30" cy="50" r="2.5" fill="#f5a623" />
              <circle cx="70" cy="50" r="2.5" fill="#f5a623" />
              <circle cx="70" cy="10" r="2.5" fill="#f5a623" />
              <circle cx="110" cy="70" r="2.5" fill="#f5a623" />
              <circle cx="130" cy="50" r="2.5" fill="#f5a623" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </motion.svg>
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 40% 50%, transparent 0%, #0a0e1a 75%)",
          }}
        />
      </div>

      {/* Logo — behind text, left-anchored, tilt on hover */}
      <div
        ref={logoRef}
        className="pointer-events-none absolute top-1/2 left-0 z-0 -translate-y-1/2"
        style={{ perspective: 800 }}
      >
        <motion.div
          style={{ rotateX, rotateY }}
          className="relative h-[520px] w-[520px] opacity-[0.07] md:h-[640px] md:w-[640px] lg:h-[740px] lg:w-[740px]"
        >
          <Image src="/logo.png" alt="" fill sizes="740px" className="object-contain" priority />
        </motion.div>
      </div>

      {/* Main layout */}
      <div className="relative z-10 w-full px-4 py-20 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[1fr_260px] lg:grid-cols-[1fr_300px]">
          {/* Left — text content, left-aligned */}
          <div className="flex flex-col items-start text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#f5a623]/30 bg-[#f5a623]/10 px-3 py-1.5 text-xs font-semibold text-[#f5a623]"
            >
              <Zap className="h-3 w-3 fill-[#f5a623]" />
              Brand New &amp; Ex UK — Nairobi
            </motion.div>

            {/* Headline */}
            <h1
              className="mb-5 text-4xl leading-tight font-bold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              {HEADLINE_WORDS.map((word, i) => (
                <motion.span
                  key={word}
                  className={`mr-3 inline-block ${i === 0 || i === 3 ? "text-[#f5a623]" : "text-white"}`}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="mb-8 max-w-lg text-base leading-relaxed text-[#8b92a5] sm:text-lg"
            >
              iPhones, TVs, Soundbars, Starlinks, PlayStation &amp; more. Located at{" "}
              <span className="text-[#cbd5e1]">Cookie House, Accra Road</span>.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-xl bg-[#f5a623] px-6 py-3 text-sm font-semibold text-[#0a0e1a] transition-all hover:bg-[#ff9f1c] hover:shadow-[0_0_20px_rgba(245,166,35,0.4)] active:scale-95"
              >
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/deals"
                className="inline-flex items-center gap-2 rounded-xl border border-[#1e2435] bg-[#0d1117] px-6 py-3 text-sm font-semibold text-white transition-all hover:border-[#f5a623]/40 hover:bg-[#1a2035] active:scale-95"
              >
                View Deals
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-10 flex gap-8"
            >
              {[
                { value: "500+", label: "Products" },
                { value: "24h", label: "Delivery" },
                { value: "90-day", label: "Warranty" },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col">
                  <span
                    className="text-xl font-bold text-[#f5a623]"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {value}
                  </span>
                  <span className="text-xs text-[#8b92a5]">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — widget carousel */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="hidden h-[400px] flex-col md:flex lg:h-[480px]"
          >
            <p className="mb-3 text-[10px] font-semibold tracking-widest text-[#8b92a5] uppercase">
              Featured Products
            </p>
            <div className="min-h-0 flex-1">
              <WidgetCarousel items={WIDGET_ITEMS} autoScrollMs={2400} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 2 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5"
      >
        <div className="h-8 w-[1px] bg-gradient-to-b from-[#f5a623]/60 to-transparent" />
        <span className="text-[10px] tracking-widest text-[#8b92a5] uppercase">Scroll</span>
      </motion.div>
    </section>
  );
}
