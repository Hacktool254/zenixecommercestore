"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Spinning SVG text ring — same mechanic as Spylt's circle-text.svg
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

export function VideoExpandSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Pin budget: 200% scroll travel while section is sticky
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // Smooth spring on progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    mass: 0.5,
  });

  // Circle starts at 0 (fully hidden) and expands to 100% on scroll
  const clipSize = useTransform(smoothProgress, [0.05, 0.75], [0, 100]);
  const clipPath = useTransform(clipSize, (s) => `circle(${s}% at 50% 50%)`);

  // Play button + spin ring fade out as circle opens
  const baseOpacity = useTransform(smoothProgress, [0.0, 0.2], [1, 0]);

  // Inner content fades in once circle is large enough
  const contentOpacity = useTransform(smoothProgress, [0.45, 0.75], [0, 1]);
  const contentY = useTransform(smoothProgress, [0.45, 0.75], [30, 0]);

  return (
    // Tall wrapper = pin budget. 300vh gives plenty of scroll to expand fully.
    <div
      ref={wrapperRef}
      className="relative z-10 -mt-16 rounded-t-[2.5rem] bg-[#080c16] shadow-[0_-32px_80px_rgba(0,0,0,0.7)]"
      style={{ height: "300vh" }}
    >
      {/* Sticky viewport — stays visible during scroll */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Layer 1 — always visible base: full image + spin ring + play button */}
        <div className="absolute inset-0">
          <Image src="/circle-vid-bg.png" alt="" fill className="object-cover" priority />
          {/* Darken image slightly so spin ring pops */}
          <div className="absolute inset-0 bg-[#0a0e1a]/40" />
          {/* Spin ring + play button — fade out as circle opens */}
          <motion.div
            style={{ opacity: baseOpacity }}
            className="absolute inset-0 flex items-center justify-center"
          >
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
          </motion.div>
        </div>

        {/* Layer 2 — expanding circle: video fills it, completely covers image when full */}
        <motion.div className="absolute inset-0" style={{ clipPath }}>
          {/* Drop circle-reveal.mp4 into /public to activate */}
          <video
            src="/circle-reveal.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          {/* Bottom scrim so text is readable over video */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,14,26,0.85) 0%, rgba(10,14,26,0.2) 50%, transparent 100%)",
            }}
          />
          {/* Text fades in once circle is wide enough */}
          <motion.div
            style={{ opacity: contentOpacity, y: contentY }}
            className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-5 px-6 pb-20 text-center"
          >
            <p className="text-xs font-semibold tracking-[0.25em] text-[#f5a623] uppercase">
              Now Available
            </p>
            <h2
              className="max-w-2xl text-4xl leading-tight font-bold text-white md:text-6xl lg:text-7xl"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              iPhone 17 <span className="text-[#f5a623]">Pro Max</span>
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-[#8b92a5] md:text-base">
              Desert Titanium · 1TB · From{" "}
              <span className="font-semibold text-[#cbd5e1]">KES 189,999</span>
              <br />
              Cookie House, Accra Road, Nairobi
            </p>
            <Link
              href="/shop/iphones"
              className="inline-flex items-center gap-2 rounded-xl bg-[#f5a623] px-6 py-3 text-sm font-semibold text-[#0a0e1a] transition-all hover:bg-[#ff9f1c] hover:shadow-[0_0_24px_rgba(245,166,35,0.5)] active:scale-95"
            >
              Shop iPhones <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
