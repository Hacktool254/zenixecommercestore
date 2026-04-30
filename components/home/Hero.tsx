"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useTransform, useSpring, useScroll } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { WidgetCarousel } from "@/components/shared/WidgetCarousel";
import type { WidgetItem } from "@/components/shared/WidgetCarousel";

const HEADLINE_WORDS = [
  "Zenix",
  "Electronics",
  "—",
  "Your",
  "Go-To",
  "for",
  "All",
  "Your",
  "Electronic",
  "Needs.",
];

const circuitPath =
  "M10 10 L50 10 L50 30 L90 30 M30 10 L30 50 L70 50 L70 70 L110 70 M70 30 L70 10 M90 70 L130 70 L130 50 M110 10 L110 50";

const WIDGET_ITEMS: WidgetItem[] = [
  {
    id: "iphone17promax",
    label: "iPhone 17 Pro Max",
    sub: "From KES 189,999",
    color: "#a8d5e2",
    href: "/shop/iphones/iphone-17-pro-max-brand-new",
  },
  {
    id: "iphone17pro",
    label: "iPhone 17 Pro",
    sub: "From KES 159,999",
    color: "#a8d5e2",
    href: "/shop/iphones/iphone-17-pro-brand-new",
  },
  {
    id: "iphone17air",
    label: "iPhone 17 Air",
    sub: "From KES 139,999",
    color: "#a8d5e2",
    href: "/shop/iphones/iphone-17-air-brand-new",
  },
  {
    id: "iphone16",
    label: "iPhone 16",
    sub: "From KES 129,999",
    color: "#a8d5e2",
    href: "/shop/iphones/iphone-16-brand-new",
  },
  {
    id: "s26ultra",
    label: "Samsung S26 Ultra",
    sub: "From KES 179,999",
    color: "#1e88e5",
    href: "/shop/samsung/samsung-s26-ultra-brand-new",
  },
  {
    id: "s25ultra",
    label: "Samsung S25 Ultra",
    sub: "From KES 149,999",
    color: "#1e88e5",
    href: "/shop/samsung/samsung-s25-ultra-brand-new",
  },
  {
    id: "zfold7",
    label: "Samsung Z Fold 7",
    sub: "KES 219,999",
    color: "#1e88e5",
    href: "/shop/samsung/samsung-fold-7-brand-new",
  },
  {
    id: "ps5pro",
    label: "PlayStation 5 Pro",
    sub: "KES 84,999",
    color: "#f87171",
    href: "/shop/gaming/ps5-pro",
  },
  {
    id: "ps5slim",
    label: "PlayStation 5 Slim",
    sub: "From KES 64,999",
    color: "#f87171",
    href: "/shop/gaming/ps5-slim",
  },
  {
    id: "xbox",
    label: "Xbox Series X",
    sub: "KES 79,999",
    color: "#22c55e",
    href: "/shop/gaming/xbox-series-x",
  },
  {
    id: "mbprom5",
    label: "MacBook Pro M5",
    sub: "KES 349,999",
    color: "#cbd5e1",
    href: "/shop/mac/macbook-pro-m5",
  },
  {
    id: "mbairkm4",
    label: "MacBook Air M4",
    sub: "From KES 149,999",
    color: "#cbd5e1",
    href: "/shop/mac/macbook-air-m4",
  },
  {
    id: "ipadpro",
    label: 'iPad Pro 13" M5',
    sub: "From KES 179,999",
    color: "#a78bfa",
    href: "/shop/ipads/ipad-pro-13-m5",
  },
  {
    id: "applewatch",
    label: "Apple Watch Ultra 3",
    sub: "KES 99,999",
    color: "#34d399",
    href: "/shop/wearables/apple-watch-ultra-3",
  },
  {
    id: "airpodsmax",
    label: "AirPods Max USB-C",
    sub: "KES 54,999",
    color: "#f87171",
    href: "/shop/audio/airpods-max-usbc",
  },
  {
    id: "tcl85",
    label: 'TCL C8L 85"',
    sub: "KES 189,999",
    color: "#f5a623",
    href: "/shop/televisions/tcl-c8l-miniled-qled",
  },
];

// 3D orb rings — angles for each ring plane
const RINGS = [
  { rx: 0, ry: 0, rz: 0, r: 120, delay: 0, dur: 18 },
  { rx: 60, ry: 0, rz: 30, r: 110, delay: 0.5, dur: 22 },
  { rx: 120, ry: 20, rz: 60, r: 100, delay: 1, dur: 26 },
  { rx: 30, ry: 80, rz: 10, r: 130, delay: 0.3, dur: 20 },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function HolographicOrb({
  mouseX,
  mouseY,
}: {
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const floatY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const scale = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1.05, 0.9]);
  const orbRotateX = useSpring(useTransform(mouseY, [-400, 400], [12, -12]), {
    stiffness: 100,
    damping: 20,
  });
  const orbRotateY = useSpring(useTransform(mouseX, [-400, 400], [-12, 12]), {
    stiffness: 100,
    damping: 20,
  });

  return (
    <div ref={sectionRef} className="relative flex h-full w-full items-center justify-center">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute h-[420px] w-[420px] rounded-full blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, rgba(245,166,35,0.12) 0%, rgba(167,139,250,0.07) 50%, transparent 70%)",
        }}
      />
      {/* 3D spinning rings */}
      <motion.div
        style={{ y: floatY, scale, rotateX: orbRotateX, rotateY: orbRotateY, perspective: 900 }}
        className="relative flex items-center justify-center"
      >
        <svg width="300" height="300" viewBox="-150 -150 300 300" className="overflow-visible">
          {RINGS.map((ring, i) => (
            <motion.g
              key={i}
              style={{
                transform: `rotateX(${ring.rx}deg) rotateY(${ring.ry}deg) rotateZ(${ring.rz}deg)`,
              }}
              animate={{ rotateZ: [ring.rz, ring.rz + 360] }}
              transition={{
                duration: ring.dur,
                repeat: Infinity,
                ease: "linear",
                delay: ring.delay,
              }}
            >
              <ellipse
                cx="0"
                cy="0"
                rx={ring.r}
                ry={ring.r * 0.28}
                fill="none"
                stroke="url(#ringGrad)"
                strokeWidth="1.2"
                strokeDasharray="8 5"
                opacity="0.55"
              />
              {/* Dot on ring — parent g rotation handles the orbit */}
              <circle cx={ring.r} cy="0" r="3.5" fill="#f5a623" opacity="0.9" />
            </motion.g>
          ))}
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f5a623" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center glow dot */}
        <motion.div
          className="absolute h-16 w-16 rounded-full"
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(circle, rgba(245,166,35,0.9) 0%, rgba(245,166,35,0.2) 50%, transparent 70%)",
          }}
        />
        <motion.div
          className="absolute h-4 w-4 rounded-full bg-[#f5a623]"
          animate={{ scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 160 + (i % 3) * 25;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * 0.5;
        return (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-[#f5a623]"
            style={{ left: "50%", top: "50%", marginLeft: x, marginTop: y }}
            animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{
              duration: 2.5 + (i % 4) * 0.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {/* Scroll text */}
      <motion.div
        className="absolute bottom-8 flex flex-col items-center gap-1.5"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        style={{ y: floatY }}
      >
        <div className="h-8 w-[1px] bg-gradient-to-b from-[#f5a623]/60 to-transparent" />
        <span className="text-[9px] tracking-widest text-[#8b92a5] uppercase">Scroll</span>
      </motion.div>
    </div>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const logoRotateX = useSpring(useTransform(mouseY, [-400, 400], [14, -14]), {
    stiffness: 160,
    damping: 24,
  });
  const logoRotateY = useSpring(useTransform(mouseX, [-400, 400], [-14, 14]), {
    stiffness: 160,
    damping: 24,
  });

  // Hero stays sticky so CategoryStrip can slide over it
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // Slight scale-down as it gets covered — subtle depth cue
  const scrollScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - (rect.left + rect.width / 2));
    mouseY.set(e.clientY - (rect.top + rect.height / 2));
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.section
      ref={sectionRef}
      style={{ scale: scrollScale, transformOrigin: "center center" }}
      className="sticky top-0 z-0 flex min-h-screen overflow-hidden bg-[#0a0e1a]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Full-hero background video — plays once, freezes on last frame */}
      <video
        src="/hero-web.mp4"
        autoPlay
        muted
        playsInline
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        onEnded={(e) => {
          const v = e.currentTarget;
          v.pause();
          v.currentTime = v.duration;
        }}
      />
      {/* Dark overlay so text stays readable over video */}
      <div className="pointer-events-none absolute inset-0 bg-[#0a0e1a]/55" />

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
      </div>

      {/* ── Three-column layout ── */}
      <div className="relative z-10 flex min-h-screen w-full">
        {/* ── LEFT COLUMN — ~40% wide, text reaches nav midpoint ── */}
        <div className="flex w-[480px] shrink-0 flex-col md:w-[520px] lg:w-[580px] xl:w-[620px]">
          {/* Logo — just below header */}
          <div className="px-4 pt-6 md:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{ perspective: 900 }}
            >
              <motion.div
                style={{ rotateX: logoRotateX, rotateY: logoRotateY }}
                className="relative h-[200px] w-[200px] md:h-[240px] md:w-[240px] lg:h-[280px] lg:w-[280px]"
              >
                <Image
                  src="/logo.png"
                  alt="Zenix Electronics"
                  fill
                  sizes="(max-width: 768px) 200px, (max-width: 1024px) 240px, 280px"
                  className="rounded-full object-cover shadow-[0_0_80px_rgba(245,166,35,0.3),0_0_30px_rgba(245,166,35,0.15)]"
                  priority
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-12px] rounded-full border border-dashed border-[#f5a623]/20"
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Text — below logo with extra top spacing */}
          <div className="flex flex-col px-4 pt-16 pb-10 md:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.35 }}
              className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-[#f5a623]/30 bg-[#f5a623]/10 px-3 py-1.5 text-xs font-semibold text-[#f5a623]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#f5a623]" />
              Zenix Electronics
            </motion.div>

            <h1
              className="mb-4 text-2xl leading-tight font-bold tracking-tight text-white md:text-3xl lg:text-4xl"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              {HEADLINE_WORDS.map((word, wi) => (
                <span key={wi} className="mr-2 inline-block overflow-hidden align-bottom">
                  <span className={wi === 0 || wi === 1 ? "text-[#f5a623]" : "text-white"}>
                    {word.split("").map((char, ci) => (
                      <motion.span
                        key={ci}
                        className="inline-block"
                        initial={{ y: "110%" }}
                        animate={{ y: 0 }}
                        transition={{
                          duration: 0.55,
                          delay: 0.4 + wi * 0.1 + ci * 0.022,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.75 }}
              className="mb-6 text-sm leading-relaxed text-[#8b92a5]"
            >
              iPhones, Samsung, MacBooks, PlayStation, TVs &amp; more. Located at{" "}
              <span className="text-[#cbd5e1]">Cookie House, Accra Road, Nairobi</span>.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-3 overflow-hidden"
              initial={{ clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" }}
              animate={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
              transition={{ duration: 0.55, delay: 0.88, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-xl bg-[#f5a623] px-5 py-2.5 text-sm font-semibold text-[#0a0e1a] transition-all hover:bg-[#ff9f1c] hover:shadow-[0_0_20px_rgba(245,166,35,0.4)] active:scale-95"
              >
                Shop All <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/deals"
                className="inline-flex items-center gap-2 rounded-xl border border-[#1e2435] bg-[#0d1117] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:border-[#f5a623]/40 hover:bg-[#1a2035] active:scale-95"
              >
                View Deals
              </Link>
            </motion.div>

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

        {/* ── MIDDLE — spacer so right panel stays positioned ── */}
        <div className="hidden flex-1 md:block" />

        {/* ── RIGHT PANEL — auto-scrolling widget carousel ── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.3 }}
          className="hidden w-[200px] shrink-0 flex-col md:flex lg:w-[230px]"
        >
          <div className="flex flex-1 flex-col px-3 pt-[72px] pb-4">
            <WidgetCarousel items={WIDGET_ITEMS} autoScrollMs={2400} />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
