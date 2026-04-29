"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { Star } from "lucide-react";

const LINES = [
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

export function Testimonials() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const cardsInView = useInView(cardsRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 45, damping: 20, mass: 0.6 });

  const xRight0 = useTransform(smooth, [0, 0.28, 1], [900, 0, 140]);
  const xLeft1 = useTransform(smooth, [0, 0.28, 1], [-900, 0, -140]);
  const xLeft2 = useTransform(smooth, [0, 0.28, 1], [-900, 0, -140]);
  const xRight3 = useTransform(smooth, [0, 0.28, 1], [900, 0, 140]);
  const lineX = [xRight0, xLeft1, xLeft2, xRight3];

  const cardX0 = useTransform(smooth, [0.1, 0.4], [-80, 0]);
  const cardX1 = useTransform(smooth, [0.25, 0.55], [-80, 0]);
  const cardX2 = useTransform(smooth, [0.4, 0.7], [-80, 0]);
  const cardX3 = useTransform(smooth, [0.55, 0.85], [-80, 0]);
  const cardOp0 = useTransform(smooth, [0.1, 0.35], [0, 1]);
  const cardOp1 = useTransform(smooth, [0.25, 0.5], [0, 1]);
  const cardOp2 = useTransform(smooth, [0.4, 0.65], [0, 1]);
  const cardOp3 = useTransform(smooth, [0.55, 0.8], [0, 1]);
  const cardMotion = [
    { x: cardX0, opacity: cardOp0 },
    { x: cardX1, opacity: cardOp1 },
    { x: cardX2, opacity: cardOp2 },
    { x: cardX3, opacity: cardOp3 },
  ];

  return (
    <section className="relative z-30 -mt-16 rounded-t-[2.5rem] bg-[#0a0e1a] shadow-[0_-32px_80px_rgba(0,0,0,0.7)]">
      {/* ── Mobile layout — simple stacked cards, no scroll trickery ── */}
      <div className="block px-4 py-14 lg:hidden">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <p className="mb-2 text-xs font-semibold tracking-widest text-[#f5a623] uppercase">
            What customers say
          </p>
          <h2
            className="font-black tracking-tighter text-white uppercase"
            style={{
              fontSize: "clamp(2.2rem, 12vw, 4rem)",
              fontFamily: "var(--font-space-grotesk)",
              lineHeight: 0.95,
            }}
          >
            What&apos;s <span className="text-[#f5a623]">Nairobi</span>
            <br />
            Saying <span className="text-[#f5a623]">About Us?</span>
          </h2>
        </motion.div>
        <div ref={cardsRef} className="flex flex-col gap-3">
          {CARDS.map((card, i) => (
            <TestimonialCard key={card.name} card={card} delay={i * 0.1} inView={cardsInView} />
          ))}
        </div>
      </div>

      {/* ── Desktop layout — original sticky scroll-driven animation ── */}
      <div className="hidden lg:block">
        <div ref={wrapperRef} className="relative" style={{ height: "400vh" }}>
          <div className="sticky top-0 h-screen overflow-hidden">
            <div className="pointer-events-none absolute inset-0">
              <div
                className="absolute top-1/4 right-1/4 h-[600px] w-[600px] rounded-full blur-[180px]"
                style={{ background: "rgba(245,166,35,0.03)" }}
              />
            </div>

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

            <div className="absolute inset-0 flex flex-col items-end justify-center pr-6 md:pr-10 lg:pr-16">
              {LINES.map((line, i) => (
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
          </div>
        </div>
      </div>
    </section>
  );
}
