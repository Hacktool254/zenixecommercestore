"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef, useEffect } from "react";
import { ArrowRight } from "lucide-react";

const HEADLINE_WORDS = ["Premium", "Electronics,", "Nairobi's", "Best."];

const circuitPath =
  "M10 10 L50 10 L50 30 L90 30 M30 10 L30 50 L70 50 L70 70 L110 70 M70 30 L70 10 M90 70 L130 70 L130 50 M110 10 L110 50";

const WIDGET_ITEMS = [
  { id: "iphone17promax", label: "iPhone 17 Pro Max", sub: "From KES 189,999", color: "#a8d5e2" },
  { id: "iphone17pro", label: "iPhone 17 Pro", sub: "From KES 159,999", color: "#a8d5e2" },
  { id: "iphone17air", label: "iPhone 17 Air", sub: "From KES 139,999", color: "#a8d5e2" },
  { id: "iphone16", label: "iPhone 16", sub: "From KES 129,999", color: "#a8d5e2" },
  { id: "s26ultra", label: "Samsung S26 Ultra", sub: "From KES 179,999", color: "#1e88e5" },
  { id: "s25ultra", label: "Samsung S25 Ultra", sub: "From KES 149,999", color: "#1e88e5" },
  { id: "zfold7", label: "Samsung Z Fold 7", sub: "KES 219,999", color: "#1e88e5" },
  { id: "ps5pro", label: "PlayStation 5 Pro", sub: "KES 84,999", color: "#f87171" },
  { id: "ps5slim", label: "PlayStation 5 Slim", sub: "From KES 64,999", color: "#f87171" },
  { id: "xbox", label: "Xbox Series X", sub: "KES 79,999", color: "#22c55e" },
  { id: "mbprom5", label: "MacBook Pro M5", sub: "KES 349,999", color: "#cbd5e1" },
  { id: "mbairkm4", label: "MacBook Air M4", sub: "From KES 149,999", color: "#cbd5e1" },
  { id: "ipadpro", label: 'iPad Pro 13" M5', sub: "From KES 179,999", color: "#a78bfa" },
  { id: "applewatch", label: "Apple Watch Ultra 3", sub: "KES 99,999", color: "#34d399" },
  { id: "airpodsmax", label: "AirPods Max USB-C", sub: "KES 54,999", color: "#f87171" },
  { id: "tcl85", label: 'TCL C8L 85"', sub: "KES 189,999", color: "#f5a623" },
];

export function Hero() {
  // Mouse tilt for logo
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-400, 400], [14, -14]), {
    stiffness: 160,
    damping: 24,
  });
  const rotateY = useSpring(useTransform(mouseX, [-400, 400], [-14, 14]), {
    stiffness: 160,
    damping: 24,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - (rect.left + rect.width / 2));
    mouseY.set(e.clientY - (rect.top + rect.height / 2));
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Widget panel: capture wheel events on hover so page doesn't scroll
  const widgetListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = widgetListRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      el.scrollBy({ top: e.deltaY * 0.85 });
    };

    const addWheel = () => el.addEventListener("wheel", onWheel, { passive: false });
    const removeWheel = () => el.removeEventListener("wheel", onWheel);

    el.addEventListener("mouseenter", addWheel);
    el.addEventListener("mouseleave", removeWheel);

    return () => {
      el.removeEventListener("mouseenter", addWheel);
      el.removeEventListener("mouseleave", removeWheel);
      removeWheel();
    };
  }, []);

  return (
    <section
      className="relative flex min-h-screen overflow-hidden bg-[#0a0e1a]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Circuit board background */}
      <div className="pointer-events-none absolute inset-0">
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
        {/* Soft glow behind logo area */}
        <div
          className="absolute top-0 left-0 h-[55vh] w-[40vw]"
          style={{
            background:
              "radial-gradient(ellipse 70% 70% at 20% 40%, rgba(245,166,35,0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ── Full-height flex row ── */}
      <div className="relative z-10 flex min-h-screen w-full">
        {/* ── LEFT COLUMN ── */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top — logo just below header */}
          <div className="flex px-4 pt-6 md:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{ perspective: 900 }}
            >
              <motion.div
                style={{ rotateX, rotateY }}
                className="relative h-[220px] w-[220px] md:h-[260px] md:w-[260px] lg:h-[300px] lg:w-[300px]"
              >
                <Image
                  src="/logo.png"
                  alt="Zenix Electronics"
                  fill
                  sizes="(max-width: 768px) 220px, (max-width: 1024px) 260px, 300px"
                  className="rounded-full object-cover shadow-[0_0_80px_rgba(245,166,35,0.3),0_0_30px_rgba(245,166,35,0.15)]"
                  priority
                />
                {/* Orbit ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-14px] rounded-full border border-dashed border-[#f5a623]/20"
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Text — directly below logo */}
          <div className="flex flex-col px-4 pt-6 pb-14 md:px-6 lg:px-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.35 }}
              className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-[#f5a623]/30 bg-[#f5a623]/10 px-3 py-1.5 text-xs font-semibold text-[#f5a623]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#f5a623]" />
              Zenix Electronics
            </motion.div>

            {/* Headline */}
            <h1
              className="mb-4 text-3xl leading-tight font-bold tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-[3.5rem]"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              {HEADLINE_WORDS.map((word, i) => (
                <motion.span
                  key={word}
                  className={`mr-2 inline-block ${i === 0 || i === 3 ? "text-[#f5a623]" : "text-white"}`}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.75 }}
              className="mb-6 max-w-md text-sm leading-relaxed text-[#8b92a5] sm:text-base"
            >
              iPhones, TVs, Soundbars, Starlinks, PlayStation &amp; more. Located at{" "}
              <span className="text-[#cbd5e1]">Cookie House, Accra Road</span>.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.88 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-xl bg-[#f5a623] px-5 py-2.5 text-sm font-semibold text-[#0a0e1a] transition-all hover:bg-[#ff9f1c] hover:shadow-[0_0_20px_rgba(245,166,35,0.4)] active:scale-95"
              >
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/deals"
                className="inline-flex items-center gap-2 rounded-xl border border-[#1e2435] bg-[#0d1117] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:border-[#f5a623]/40 hover:bg-[#1a2035] active:scale-95"
              >
                View Deals
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.05 }}
              className="mt-8 flex gap-8"
            >
              {[
                { value: "500+", label: "Products" },
                { value: "24h", label: "Delivery" },
                { value: "90-day", label: "Warranty" },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col">
                  <span
                    className="text-lg font-bold text-[#f5a623]"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {value}
                  </span>
                  <span className="text-xs text-[#8b92a5]">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.3 }}
          className="hidden w-[220px] shrink-0 flex-col border-l border-[#1e2435] md:flex lg:w-[250px]"
        >
          {/* "Featured Products" header — aligned with nav height */}
          <div className="flex h-[72px] shrink-0 items-center border-b border-[#1e2435] px-4">
            <p className="text-[10px] font-semibold tracking-widest text-[#f5a623] uppercase">
              Featured Products
            </p>
          </div>

          {/* All widgets — scrollable on hover */}
          <div
            ref={widgetListRef}
            className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-3 py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {WIDGET_ITEMS.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.28, delay: 0.45 + i * 0.04 }}
                className="group relative cursor-pointer rounded-xl border border-[#1e2435] bg-[#0d1117] px-3.5 py-2.5 transition-all duration-200 hover:border-[rgba(245,166,35,0.25)] hover:bg-[#111827]"
              >
                {/* Left accent bar */}
                <div
                  className="absolute top-0 bottom-0 left-0 w-[2.5px] rounded-r-full opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  style={{ background: item.color }}
                />
                <p className="text-xs leading-snug font-semibold text-[#cbd5e1] transition-colors duration-150 group-hover:text-white">
                  {item.label}
                </p>
                <p className="mt-0.5 text-[10px] text-[#8b92a5]">{item.sub}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
