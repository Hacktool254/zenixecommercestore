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
  const start = index / total;
  const end = Math.min((index + 1.8) / total, 1);
  const color = useTransform(progress, [start, end], ["rgba(255,255,255,0.18)", "#ffffff"]);
  return (
    <motion.span style={{ color }} className="mr-[0.28em] inline-block">
      {word}
    </motion.span>
  );
}

export function MessageSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.5 });

  return (
    <div
      ref={wrapperRef}
      className="relative z-20 -mt-16 rounded-t-[2.5rem] bg-[#0a0e1a] shadow-[0_-32px_80px_rgba(0,0,0,0.7)]"
      style={{ height: "250vh" }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden px-6 md:px-12 lg:px-20">
        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/3 h-[500px] w-[500px] -translate-y-1/2 rounded-full blur-[200px]"
          style={{ background: "rgba(245,166,35,0.05)" }}
        />

        <div className="relative z-10 max-w-5xl">
          {/* Overline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-6 text-xs font-semibold tracking-[0.25em] text-[#f5a623] uppercase"
          >
            Why Zenix
          </motion.p>

          {/* Color-scrub headline — each word lights up as scroll passes through */}
          <h2
            className="mb-8 leading-[1.05] font-black uppercase"
            style={{
              fontSize: "clamp(2.6rem, 6.5vw, 6.5rem)",
              fontFamily: "var(--font-space-grotesk)",
            }}
          >
            {HEADLINE.map((word, i) => (
              <ScrubWord key={i} word={word} index={i} total={HEADLINE.length} progress={smooth} />
            ))}
          </h2>

          {/* Word fly-in with X-axis rotation — triggers once in view */}
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
      </div>
    </div>
  );
}
