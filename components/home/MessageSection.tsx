"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import type { MotionValue } from "framer-motion";

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

// Word scrub mapped to the first 60% of scroll progress (before the split kicks in)
function ScrubWord({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const base = (index / total) * 0.6;
  const end = Math.min(((index + 1.8) / total) * 0.6, 0.6);
  const color = useTransform(progress, [base, end], ["rgba(255,255,255,0.18)", "#ffffff"]);
  return (
    <motion.span style={{ color }} className="mr-[0.28em] inline-block">
      {word}
    </motion.span>
  );
}

// The actual text content — rendered inside BOTH curtain halves
function Content({ progress }: { progress: MotionValue<number> }) {
  return (
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
        {HEADLINE.map((word, i) => (
          <ScrubWord key={i} word={word} index={i} total={HEADLINE.length} progress={progress} />
        ))}
      </h2>

      <p className="flex max-w-2xl flex-wrap gap-y-1" style={{ perspective: "600px" }}>
        {SUBTITLE.map((word, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 30, rotateX: 22 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.55,
              delay: i * 0.045,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mr-[0.28em] inline-block text-base text-[#8b92a5] md:text-xl"
            style={{ transformOrigin: "bottom center" }}
          >
            {word}
          </motion.span>
        ))}
      </p>
    </div>
  );
}

export function MessageSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.5 });

  // Split curtain — triggers after text reveal (progress 0.65 → 1.0)
  // Top half slides up, bottom half slides down
  const topY = useTransform(smooth, [0.65, 1.0], ["0vh", "-52vh"]);
  const botY = useTransform(smooth, [0.65, 1.0], ["0vh", "52vh"]);

  return (
    <div
      ref={wrapperRef}
      className="relative z-20 -mt-16 rounded-t-[2.5rem] shadow-[0_-32px_80px_rgba(0,0,0,0.7)]"
      style={{ height: "400vh" }}
    >
      {/* Ambient glow behind the curtains — visible once they split */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[#0a0e1a]">
        <div
          className="absolute top-1/2 left-1/3 h-[500px] w-[500px] -translate-y-1/2 rounded-full blur-[200px]"
          style={{ background: "rgba(245,166,35,0.05)" }}
        />
      </div>

      {/* ── TOP CURTAIN — shows top half of the content ── */}
      <motion.div
        style={{ y: topY }}
        className="sticky top-0 z-10 h-[50vh] overflow-hidden bg-[#0a0e1a] px-6 md:px-12 lg:px-20"
      >
        {/* Inner is full-viewport height, centered — only top 50vh visible */}
        <div className="flex h-screen items-center">
          <Content progress={smooth} />
        </div>
      </motion.div>

      {/* ── BOTTOM CURTAIN — shows bottom half of the content ── */}
      <motion.div
        style={{ y: botY }}
        className="sticky top-[50vh] z-10 h-[50vh] overflow-hidden bg-[#0a0e1a] px-6 md:px-12 lg:px-20"
      >
        {/* Inner offset up by 50vh so the bottom half of the centered content shows */}
        <div className="flex h-screen items-center" style={{ marginTop: "-50vh" }}>
          <Content progress={smooth} />
        </div>
      </motion.div>
    </div>
  );
}
