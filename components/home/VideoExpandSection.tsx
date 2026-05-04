"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import Link from "next/link";

// ─── Data ────────────────────────────────────────────────────────────────────

const HEADLINE = [
  "Kenya's",
  "most",
  "trusted",
  "source",
  "for",
  "premium",
  "electronics,",
  "delivered",
  "to",
  "your",
  "door.",
];

const SUBTITLE = [
  "From",
  "brand-new",
  "iPhones",
  "to",
  "Ex-UK",
  "MacBooks",
  "—",
  "every",
  "device",
  "verified,",
  "sealed,",
  "and",
  "backed",
  "by",
  "our",
  "quality",
  "guarantee.",
];

const TESTI_LINES = [
  { text: "WHAT'S", gold: false },
  { text: "NAIROBI", gold: true },
  { text: "SAYING", gold: false },
  { text: "ABOUT US?", gold: true },
];

const CARDS = [
  {
    name: "Brian M.",
    location: "Westlands",
    rating: 5,
    text: "Got my MacBook Pro M4 here. Price was fair, staff knew their stuff. Came back for AirPods Max a month later.",
    product: "MacBook Pro M4",
    color: "#cbd5e1",
  },
  {
    name: "Aisha K.",
    location: "Karen",
    rating: 5,
    text: "Samsung S25 Ultra with a trade-in deal no other shop would match. Same-day delivery, everything sealed.",
    product: "Samsung S25 Ultra",
    color: "#1e88e5",
  },
  {
    name: "Kevin N.",
    location: "Nairobi CBD",
    rating: 5,
    text: "Best iPhone prices in Nairobi. Walked in, got exactly what I needed in under ten minutes.",
    product: "iPhone 17 Pro Max",
    color: "#a8d5e2",
  },
  {
    name: "David O.",
    location: "CBD",
    rating: 5,
    text: "PS5 Pro in stock when everywhere else was sold out. Full warranty, sealed box — legit shop.",
    product: "PlayStation 5 Pro",
    color: "#f87171",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SpinRing() {
  const text = "ZENIX ELECTRONICS · NAIROBI'S BEST · SHOP NOW · ";
  const chars = text.split("");
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const charSpacing = circumference / chars.length;

  return (
    <motion.svg
      width="180"
      height="180"
      viewBox="-90 -90 180 180"
      className="absolute"
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      {chars.map((char, i) => {
        const angle = ((i * charSpacing) / radius) * (180 / Math.PI) - 90;
        return (
          <text
            key={i}
            x={0}
            y={-radius}
            textAnchor="middle"
            dominantBaseline="auto"
            fontSize="9"
            fontWeight="600"
            letterSpacing="0.1em"
            fill="#f5a623"
            transform={`rotate(${angle})`}
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {char}
          </text>
        );
      })}
    </motion.svg>
  );
}

function TestimonialCard({
  card,
  delay,
  inView,
}: {
  card: (typeof CARDS)[0];
  delay: number;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="w-[260px] shrink-0 rounded-2xl border border-[#1e2435] bg-[#0d1117]/90 p-4 backdrop-blur-sm"
    >
      <div className="mb-2 flex gap-0.5">
        {Array.from({ length: card.rating }).map((_, i) => (
          <Star key={i} className="h-3 w-3 fill-[#f5a623] text-[#f5a623]" />
        ))}
      </div>
      <p className="mb-3 text-xs leading-relaxed text-[#8b92a5]">&ldquo;{card.text}&rdquo;</p>
      <div
        className="mb-3 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase"
        style={{ borderColor: `${card.color}40`, color: card.color }}
      >
        <span className="h-1 w-1 rounded-full" style={{ background: card.color }} />
        {card.product}
      </div>
      <div className="border-t border-[#1e2435] pt-2">
        <p className="text-[11px] font-semibold text-[#cbd5e1]">{card.name}</p>
        <p className="text-[9px] text-[#8b92a5]">{card.location}, Nairobi</p>
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function VideoExpandSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mobileCardsRef = useRef<HTMLDivElement>(null);
  const mobileCardsInView = useInView(mobileCardsRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    mass: 0.5,
  });

  // SpinRing + play button fades out as circle starts opening
  const baseOpacity = useTransform(smoothProgress, [0.0, 0.25], [1, 0]);

  // Circle expands from centre — 0% → 100%
  const clipSize = useTransform(smoothProgress, [0.12, 0.55], [0, 100]);
  const clipPath = useTransform(clipSize, (s) => `circle(${s}% at 50% 50%)`);

  // Sub-progress for testimonials — starts early so content hits as circle opens
  const testiProgress = useTransform(smoothProgress, [0.18, 1.0], [0, 1]);

  // Fade-in for the circle's inner content
  const testiOpacity = useTransform(smoothProgress, [0.18, 0.34], [0, 1]);

  // ── Big sliding headline lines (desktop) ──
  const xRight0 = useTransform(testiProgress, [0, 0.28, 1], [900, 0, 140]);
  const xLeft1 = useTransform(testiProgress, [0, 0.28, 1], [-900, 0, -140]);
  const xLeft2 = useTransform(testiProgress, [0, 0.28, 1], [-900, 0, -140]);
  const xRight3 = useTransform(testiProgress, [0, 0.28, 1], [900, 0, 140]);
  const lineX = [xRight0, xLeft1, xLeft2, xRight3];

  // ── Review card animations (desktop) ──
  const cardX0 = useTransform(testiProgress, [0.1, 0.4], [-80, 0]);
  const cardX1 = useTransform(testiProgress, [0.25, 0.55], [-80, 0]);
  const cardX2 = useTransform(testiProgress, [0.4, 0.7], [-80, 0]);
  const cardX3 = useTransform(testiProgress, [0.55, 0.85], [-80, 0]);
  const cardOp0 = useTransform(testiProgress, [0.1, 0.35], [0, 1]);
  const cardOp1 = useTransform(testiProgress, [0.25, 0.5], [0, 1]);
  const cardOp2 = useTransform(testiProgress, [0.4, 0.65], [0, 1]);
  const cardOp3 = useTransform(testiProgress, [0.55, 0.8], [0, 1]);
  const cardMotion = [
    { x: cardX0, opacity: cardOp0 },
    { x: cardX1, opacity: cardOp1 },
    { x: cardX2, opacity: cardOp2 },
    { x: cardX3, opacity: cardOp3 },
  ];

  return (
    <div ref={wrapperRef} className="relative z-10" style={{ height: "500vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* ── Layer 1 — Why Zenix background ── */}
        <div className="absolute inset-0 bg-[#0a0e1a]">
          {/* Ambient glow */}
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute top-1/3 left-1/3 h-[500px] w-[500px] -translate-y-1/2 rounded-full blur-[200px]"
              style={{ background: "rgba(245,166,35,0.04)" }}
            />
          </div>

          {/* Why Zenix text — Hero-style character reveal on viewport entry */}
          <div className="absolute inset-0 flex items-center px-6 md:px-12 lg:px-20">
            <div className="relative z-10 max-w-5xl">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-6 text-xs font-semibold tracking-[0.25em] text-[#f5a623] uppercase"
              >
                Why Zenix
              </motion.p>

              <h2
                className="mb-8 leading-[1.05] font-black uppercase"
                style={{
                  fontSize: "clamp(2.6rem, 6.5vw, 6.5rem)",
                  fontFamily: "var(--font-space-grotesk)",
                }}
              >
                {HEADLINE.map((word, wi) => (
                  <span key={wi} className="mr-[0.28em] inline-block overflow-hidden align-bottom">
                    {word.split("").map((char, ci) => (
                      <motion.span
                        key={ci}
                        className="inline-block"
                        initial={{ y: "110%" }}
                        whileInView={{ y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.55,
                          delay: wi * 0.08 + ci * 0.022,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>
                ))}
              </h2>
            </div>
          </div>

          {/* SpinRing + play button + flanking labels — fades out as circle opens */}
          <motion.div
            style={{ opacity: baseOpacity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Left panel */}
            <div className="absolute top-0 left-0 flex h-full w-[calc(50%-110px)] flex-col items-start justify-center gap-6 px-10 lg:px-16">
              {[
                {
                  stat: "500+",
                  label: "Products In Stock",
                  desc: "iPhones, MacBooks, Samsung, TVs, Starlinks, PlayStation & more — all under one roof.",
                },
                {
                  stat: "90-Day",
                  label: "Quality Guarantee",
                  desc: "Every device is tested, sealed and backed. No lemons. No surprises.",
                },
                {
                  stat: "Brand New",
                  label: "& Ex-UK Devices",
                  desc: "Full-box brand new stock and certified Ex-UK imports at unbeatable Nairobi prices.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.stat}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col gap-1"
                >
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-2xl font-black text-[#f5a623]"
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {item.stat}
                    </span>
                    <span className="text-xs font-semibold tracking-widest text-white/70 uppercase">
                      {item.label}
                    </span>
                  </div>
                  <p className="max-w-[260px] text-[11px] leading-relaxed text-[#8b92a5]">
                    {item.desc}
                  </p>
                  {i < 2 && <div className="mt-2 h-px w-12 bg-[#f5a623]/25" />}
                </motion.div>
              ))}
            </div>

            <SpinRing />
            <div className="absolute flex h-10 w-10 items-center justify-center rounded-full bg-[#f5a623]">
              <div
                className="h-0 w-0 translate-x-0.5"
                style={{
                  borderTop: "7px solid transparent",
                  borderBottom: "7px solid transparent",
                  borderLeft: "12px solid #0a0e1a",
                }}
              />
            </div>

            {/* Right panel */}
            <div className="absolute top-0 right-0 flex h-full w-[calc(50%-110px)] flex-col items-start justify-center gap-6 px-10 lg:px-16">
              {[
                {
                  stat: "Same-Day",
                  label: "Delivery Nairobi",
                  desc: "Order before noon and get it the same day. We deliver across all Nairobi estates.",
                },
                {
                  stat: "Cookie House",
                  label: "Accra Road, CBD",
                  desc: "Walk in, touch it, buy it. Our showroom is open 7 days — Mon to Sun.",
                },
                {
                  stat: "24/7",
                  label: "WhatsApp Support",
                  desc: "Ask about stock, specs, pricing or trade-in deals. We respond fast, always.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.stat}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col gap-1"
                >
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-2xl font-black text-[#f5a623]"
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {item.stat}
                    </span>
                    <span className="text-xs font-semibold tracking-widest text-white/70 uppercase">
                      {item.label}
                    </span>
                  </div>
                  <p className="max-w-[260px] text-[11px] leading-relaxed text-[#8b92a5]">
                    {item.desc}
                  </p>
                  {i < 2 && <div className="mt-2 h-px w-12 bg-[#f5a623]/25" />}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Shop Now button — persistent, centered below spinner */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-xl bg-[#f5a623] px-7 py-3 text-sm font-semibold text-[#0a0e1a] transition-all hover:bg-[#ff9f1c] hover:shadow-[0_0_24px_rgba(245,166,35,0.5)] active:scale-95"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Shop Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* ── Layer 2 — Expanding circle revealing Testimonials ── */}
        <motion.div className="absolute inset-0 bg-[#0a0e1a]" style={{ clipPath }}>
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute top-1/4 right-1/4 h-[600px] w-[600px] rounded-full blur-[180px]"
              style={{ background: "rgba(245,166,35,0.03)" }}
            />
          </div>

          {/* ── Mobile testimonials ── */}
          <motion.div
            style={{ opacity: testiOpacity }}
            className="flex h-full flex-col items-center justify-center px-4 py-10 lg:hidden"
          >
            <div className="mb-6 text-center">
              <p className="mb-2 text-xs font-semibold tracking-widest text-[#f5a623] uppercase">
                What customers say
              </p>
              <h2
                className="font-black tracking-tighter text-white uppercase"
                style={{
                  fontSize: "clamp(1.8rem, 10vw, 3rem)",
                  fontFamily: "var(--font-space-grotesk)",
                  lineHeight: 0.95,
                }}
              >
                What&apos;s <span className="text-[#f5a623]">Nairobi</span>
                <br />
                Saying <span className="text-[#f5a623]">About Us?</span>
              </h2>
            </div>
            <div ref={mobileCardsRef} className="grid w-full max-w-sm grid-cols-2 gap-2">
              {CARDS.map((card, i) => (
                <motion.div
                  key={card.name}
                  initial={{ opacity: 0, x: -40 }}
                  animate={mobileCardsInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-xl border border-[#1e2435] bg-[#0d1117]/90 p-3"
                >
                  <div className="mb-1.5 flex gap-0.5">
                    {Array.from({ length: card.rating }).map((_, si) => (
                      <Star key={si} className="h-2.5 w-2.5 fill-[#f5a623] text-[#f5a623]" />
                    ))}
                  </div>
                  <p className="mb-2 line-clamp-3 text-[9px] leading-relaxed text-[#8b92a5]">
                    &ldquo;{card.text}&rdquo;
                  </p>
                  <p className="text-[10px] font-semibold text-[#cbd5e1]">{card.name}</p>
                  <p className="text-[8px] text-[#8b92a5]">{card.location}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Desktop testimonials — all original effects ── */}
          <motion.div
            style={{ opacity: testiOpacity }}
            className="absolute inset-0 hidden lg:block"
          >
            {/* "What customers say" label — wipes in */}
            <motion.div
              initial={{ clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" }}
              whileInView={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-8 left-8 z-10"
            >
              <p className="text-xs font-semibold tracking-widest text-[#f5a623] uppercase">
                What customers say
              </p>
            </motion.div>

            {/* Big sliding headline lines */}
            <div className="absolute inset-0 flex flex-col items-end justify-center pr-6 md:pr-10 lg:pr-16">
              {TESTI_LINES.map((line, i) => (
                <motion.div key={i} style={{ x: lineX[i] }} className="leading-none">
                  <span
                    className="block font-black tracking-tighter uppercase"
                    style={{
                      fontSize: "clamp(3.5rem, 14vw, 14rem)",
                      color: line.gold ? "#f5a623" : "#ffffff",
                      fontFamily: "var(--font-space-grotesk)",
                      lineHeight: 0.92,
                    }}
                  >
                    {line.text}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Review cards sliding in from left */}
            <div className="absolute top-1/2 left-6 flex -translate-y-1/2 flex-col gap-3 md:left-10 lg:left-16">
              {CARDS.map((card, i) => (
                <motion.div
                  key={card.name}
                  style={{ x: cardMotion[i]?.x, opacity: cardMotion[i]?.opacity }}
                >
                  <TestimonialCard card={card} delay={0} inView={true} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
