"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";

const HEADLINE_WORDS = ["Premium", "Electronics,", "Nairobi's", "Best."];

const circuitPath =
  "M10 10 L50 10 L50 30 L90 30 M30 10 L30 50 L70 50 L70 70 L110 70 M70 30 L70 10 M90 70 L130 70 L130 50 M110 10 L110 50";

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-72px)] items-center overflow-hidden bg-[#0a0e1a]">
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
        {/* Radial gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, #0a0e1a 70%)",
          }}
        />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
        {/* Left — text */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
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

          {/* Animated headline */}
          <h1
            className="mb-5 text-4xl leading-tight font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
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
            className="mb-8 max-w-md text-base leading-relaxed text-[#8b92a5] sm:text-lg"
          >
            iPhones, TVs, Soundbars, Starlinks, PlayStation &amp; more. Located at{" "}
            <span className="text-[#cbd5e1]">Cookie House, Accra Road</span>.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-3 md:justify-start"
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

        {/* Right — floating image */}
        <div className="relative flex items-center justify-center">
          {/* Glow */}
          <div
            className="absolute h-72 w-72 rounded-full blur-3xl"
            style={{
              background: "radial-gradient(circle, rgba(245,166,35,0.15) 0%, transparent 70%)",
            }}
          />
          <motion.div
            animate={{ y: [-12, 12, -12] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10"
          >
            <div className="relative h-72 w-72 sm:h-80 sm:w-80 lg:h-96 lg:w-96">
              <Image
                src="/logo.png"
                alt="Zenix Electronics"
                fill
                sizes="(max-width: 640px) 288px, (max-width: 1024px) 320px, 384px"
                className="rounded-full object-cover shadow-[0_0_60px_rgba(245,166,35,0.2)]"
                priority
              />
            </div>
          </motion.div>
          {/* Orbit ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute h-[340px] w-[340px] rounded-full border border-dashed border-[#f5a623]/15 sm:h-[380px] sm:w-[380px] lg:h-[440px] lg:w-[440px]"
          />
        </div>
      </div>
    </section>
  );
}
