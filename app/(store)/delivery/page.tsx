import { MapPin, Clock, Truck, Package, Phone } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delivery & Shipping — Zenix Electronics",
  description:
    "Delivery coverage, times, and fees for Zenix Electronics. Same-day delivery across Nairobi. Free pickup at Accra Road, Cookie House.",
};

const NAIROBI_ZONES = [
  { area: "CBD & Surrounding", time: "Same day (2–4 hrs)", fee: "KES 200" },
  { area: "Westlands / Parklands", time: "Same day (2–4 hrs)", fee: "KES 200" },
  { area: "Kilimani / Lavington", time: "Same day (3–5 hrs)", fee: "KES 250" },
  { area: "Kasarani / Roysambu", time: "Same day (3–5 hrs)", fee: "KES 300" },
  { area: "Embakasi / South B / South C", time: "Same day (3–5 hrs)", fee: "KES 300" },
  { area: "Ruaka / Kiambu Road", time: "Next day", fee: "KES 350" },
  { area: "Thika Road (Mirema–Kahawa)", time: "Same day (4–6 hrs)", fee: "KES 300" },
  { area: "Rongai / Syokimau", time: "Next day", fee: "KES 400" },
  { area: "Ngong / Karen", time: "Next day", fee: "KES 400" },
  { area: "Outside Nairobi", time: "2–4 business days", fee: "Quote on request" },
];

export default function DeliveryPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      {/* Header */}
      <div className="mb-10">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#f5a623]/30 bg-[#f5a623]/10 px-3 py-1 text-xs font-semibold text-[#f5a623]">
          <Truck className="h-3.5 w-3.5" />
          Delivery Info
        </div>
        <h1
          className="text-3xl font-bold text-white md:text-4xl"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Delivery & Shipping
        </h1>
        <p className="mt-2 text-[#8b92a5]">
          Fast, reliable delivery across Nairobi — or pick up for free at our store.
        </p>
      </div>

      {/* Highlights */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            icon: Clock,
            title: "Same-Day Delivery",
            body: "Order before 12 PM for same-day delivery within Nairobi.",
          },
          {
            icon: Package,
            title: "Free Pickup",
            body: "Collect your order at our Accra Road store — no delivery fee.",
          },
          {
            icon: Phone,
            title: "Order via WhatsApp",
            body: "Prefer to order by phone? Chat with us on WhatsApp for instant help.",
          },
        ].map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-2xl border border-[#1e2435] bg-[#0d1117] p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5a623]/10">
              <Icon className="h-4.5 w-4.5 text-[#f5a623]" />
            </div>
            <p className="mb-1 font-semibold text-white">{title}</p>
            <p className="text-sm text-[#8b92a5]">{body}</p>
          </div>
        ))}
      </div>

      {/* Coverage & fees table */}
      <div className="mb-10 overflow-hidden rounded-2xl border border-[#1e2435] bg-[#0d1117]">
        <div className="border-b border-[#1e2435] px-5 py-4">
          <h2 className="font-semibold text-white">Coverage Areas & Fees</h2>
          <p className="mt-0.5 text-xs text-[#8b92a5]">Prices are per order, not per item.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e2435] text-left">
                {["Area", "Estimated Time", "Fee"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-xs font-semibold tracking-widest text-[#8b92a5] uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2435]">
              {NAIROBI_ZONES.map((zone) => (
                <tr key={zone.area} className="transition hover:bg-[#111827]">
                  <td className="px-5 py-3 text-white">{zone.area}</td>
                  <td className="px-5 py-3 text-[#8b92a5]">{zone.time}</td>
                  <td className="px-5 py-3 font-semibold text-[#f5a623]">{zone.fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Free pickup */}
      <div className="mb-10 rounded-2xl border border-[#1e2435] bg-[#0d1117] p-6">
        <div className="mb-4 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[#f5a623]" />
          <h2 className="font-semibold text-white">Free In-Store Pickup</h2>
        </div>
        <p className="mb-4 text-sm text-[#8b92a5]">
          Skip the delivery fee entirely — place your order online and collect it from our store
          within the hour. Our team will have it ready and waiting.
        </p>
        <div className="rounded-xl border border-[#1e2435] bg-[#111827] p-4 text-sm">
          <p className="font-semibold text-white">Zenix Electronics</p>
          <p className="mt-1 text-[#8b92a5]">Cookie House, Accra Road</p>
          <p className="text-[#8b92a5]">Nairobi CBD, Kenya</p>
          <p className="mt-2 text-[#8b92a5]">
            Mon – Sat: <span className="text-white">8:00 AM – 7:00 PM</span>
          </p>
          <p className="text-[#8b92a5]">
            Sunday: <span className="text-white">10:00 AM – 5:00 PM</span>
          </p>
        </div>
        <a
          href="https://maps.google.com/?q=Cookie+House+Accra+Road+Nairobi"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#f5a623] hover:underline"
        >
          <MapPin className="h-3.5 w-3.5" />
          View on Google Maps
        </a>
      </div>

      {/* Notes */}
      <div className="rounded-2xl border border-[#1e2435] bg-[#0d1117] p-6">
        <h2 className="mb-3 font-semibold text-white">Important Notes</h2>
        <ul className="flex flex-col gap-2 text-sm text-[#8b92a5]">
          <li className="flex gap-2">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f5a623]" />
            Orders placed after 12 PM on weekdays are delivered the following business day.
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f5a623]" />
            You will receive a WhatsApp confirmation with your rider&apos;s name and contact once
            your order is dispatched.
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f5a623]" />
            For bulk or fragile orders, our team may contact you to arrange special packaging.
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f5a623]" />
            Delivery fees are charged per order — not per item.
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f5a623]" />
            Outside Nairobi? Contact us via WhatsApp for a custom quote.
          </li>
        </ul>
      </div>
    </div>
  );
}
