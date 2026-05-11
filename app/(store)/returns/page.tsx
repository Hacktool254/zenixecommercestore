import type { Metadata } from "next";
import { ShieldCheck, RefreshCw, AlertCircle, Clock, Phone, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Returns & Refunds Policy — Zenix Electronics",
  description:
    "Zenix Electronics returns and refunds policy. 90-day quality guarantee on all devices. Find out how to return a product or claim your warranty in Nairobi.",
  openGraph: {
    title: "Returns & Refunds Policy — Zenix Electronics",
    description:
      "Zenix Electronics returns and refunds policy. 90-day quality guarantee on all devices.",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://zenixelectronics.co.ke"}/returns`,
  },
};

const STEPS = [
  {
    step: "01",
    title: "Contact Us",
    body: "Reach out via WhatsApp (+254 703 659 956) or visit us at Cookie House, Accra Road. Describe the issue and share your order number.",
  },
  {
    step: "02",
    title: "Device Assessment",
    body: "We assess the device in-store or via photos/video sent on WhatsApp. Most issues are diagnosed within 24 hours.",
  },
  {
    step: "03",
    title: "Resolution",
    body: "Depending on the issue we offer a replacement, repair, or full refund. We'll confirm the resolution type before proceeding.",
  },
];

const COVERED = [
  "Dead-on-arrival (DOA) devices — reported within 48 hours",
  "Hardware defects not caused by physical damage",
  "Wrong item delivered",
  "Device that fails within the 90-day quality guarantee period",
  "Sealed box opened and found to be defective",
];

const NOT_COVERED = [
  "Physical damage (cracked screen, liquid damage, dents)",
  "Software issues caused by user modifications (jailbreak, root)",
  "Normal wear and tear",
  "Lost or stolen devices",
  "Damage caused by third-party accessories or repairs",
  "Change of mind after opening a sealed product",
];

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      {/* Header */}
      <div className="mb-10">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#f5a623]/30 bg-[#f5a623]/10 px-3 py-1 text-xs font-semibold text-[#f5a623]">
          <ShieldCheck className="h-3 w-3" />
          90-Day Quality Guarantee
        </div>
        <h1
          className="text-3xl font-bold text-white md:text-4xl"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Returns &amp; Refunds Policy
        </h1>
        <p className="mt-3 text-[#8b92a5]">
          Every device sold at Zenix Electronics is verified and backed by our quality guarantee. If
          something&apos;s wrong, we make it right — no runaround, no hidden clauses.
        </p>
      </div>

      {/* 90-day badge */}
      <div className="mb-10 flex items-center gap-4 rounded-2xl border border-[#f5a623]/20 bg-[#f5a623]/5 p-5">
        <Clock className="h-8 w-8 shrink-0 text-[#f5a623]" />
        <div>
          <p className="font-semibold text-white">90-Day Quality Guarantee</p>
          <p className="text-sm text-[#8b92a5]">
            All devices sold at Zenix Electronics carry a 90-day quality guarantee from the date of
            purchase. If your device develops a fault within this period, we cover it.
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="mb-10">
        <h2 className="mb-5 text-lg font-bold text-white">How to Make a Return</h2>
        <div className="flex flex-col gap-4">
          {STEPS.map(({ step, title, body }) => (
            <div
              key={step}
              className="flex gap-4 rounded-2xl border border-[#1e2435] bg-[#0d1117] p-5"
            >
              <span
                className="shrink-0 text-2xl font-black text-[#f5a623]/30"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {step}
              </span>
              <div>
                <p className="mb-1 font-semibold text-white">{title}</p>
                <p className="text-sm text-[#8b92a5]">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What's covered / not covered */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#1e2435] bg-[#0d1117] p-5">
          <div className="mb-3 flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-green-400" />
            <h3 className="font-semibold text-white">What&apos;s Covered</h3>
          </div>
          <ul className="flex flex-col gap-2">
            {COVERED.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-[#8b92a5]">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-green-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-[#1e2435] bg-[#0d1117] p-5">
          <div className="mb-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <h3 className="font-semibold text-white">What&apos;s Not Covered</h3>
          </div>
          <ul className="flex flex-col gap-2">
            {NOT_COVERED.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-[#8b92a5]">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-red-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Timeframes */}
      <div className="mb-10 overflow-hidden rounded-2xl border border-[#1e2435] bg-[#0d1117]">
        <div className="border-b border-[#1e2435] px-5 py-4">
          <h2 className="font-semibold text-white">Return Timeframes</h2>
        </div>
        <div className="divide-y divide-[#1e2435]">
          {[
            { label: "DOA / Wrong item", value: "Report within 48 hours of delivery" },
            { label: "Hardware defect", value: "Within 90 days of purchase" },
            { label: "Assessment turnaround", value: "24–48 hours" },
            { label: "Refund processing", value: "3–5 business days after approval" },
            { label: "Replacement dispatch", value: "Same day or next day (stock permitting)" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
              <span className="text-[#8b92a5]">{label}</span>
              <span className="text-right font-medium text-white">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl border border-[#1e2435] bg-[#0d1117] p-6 text-center">
        <p className="mb-1 font-semibold text-white">Need to start a return?</p>
        <p className="mb-4 text-sm text-[#8b92a5]">
          Contact us on WhatsApp or call us — we&apos;re available 7 days a week.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="https://wa.me/254703659956?text=Hi%20Zenix%2C%20I%20want%20to%20start%20a%20return"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1ebe5d]"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp Us
          </a>
          <a
            href="tel:+254703659956"
            className="inline-flex items-center gap-2 rounded-xl border border-[#1e2435] px-5 py-2.5 text-sm font-semibold text-white transition hover:border-[#f5a623]/40"
          >
            <Phone className="h-4 w-4" />
            +254 703 659 956
          </a>
        </div>
      </div>
    </div>
  );
}
