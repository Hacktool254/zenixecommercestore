"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, MessageCircle, CheckCircle } from "lucide-react";

const WHATSAPP_NUMBER = "254703659956";

function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Hi Zenix Electronics!\n\nName: ${form.name}\nPhone: ${form.phone}\n\nMessage:\n${form.message}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <CheckCircle className="h-10 w-10 text-green-400" />
        <p className="font-semibold text-white">WhatsApp opened!</p>
        <p className="text-sm text-[#8b92a5]">
          Your message has been pre-filled. Just hit Send in WhatsApp.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-2 text-sm font-semibold text-[#f5a623] hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="contact-name"
            className="text-xs font-semibold tracking-widest text-[#8b92a5] uppercase"
          >
            Your Name
          </label>
          <input
            id="contact-name"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="John Doe"
            className="w-full rounded-xl border border-[#1e2435] bg-[#111827] px-3 py-2.5 text-sm text-white transition outline-none placeholder:text-[#4b5563] focus:border-[#f5a623]/50 focus:ring-1 focus:ring-[#f5a623]/20"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="contact-phone"
            className="text-xs font-semibold tracking-widest text-[#8b92a5] uppercase"
          >
            Phone / WhatsApp
          </label>
          <input
            id="contact-phone"
            required
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="0712 345 678"
            className="w-full rounded-xl border border-[#1e2435] bg-[#111827] px-3 py-2.5 text-sm text-white transition outline-none placeholder:text-[#4b5563] focus:border-[#f5a623]/50 focus:ring-1 focus:ring-[#f5a623]/20"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="contact-message"
          className="text-xs font-semibold tracking-widest text-[#8b92a5] uppercase"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          required
          rows={4}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          placeholder="Ask us about a product, order, or anything else…"
          className="w-full resize-none rounded-xl border border-[#1e2435] bg-[#111827] px-3 py-2.5 text-sm text-white transition outline-none placeholder:text-[#4b5563] focus:border-[#f5a623]/50 focus:ring-1 focus:ring-[#f5a623]/20"
        />
      </div>
      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1ebe5d]"
      >
        <MessageCircle className="h-4 w-4" />
        Send via WhatsApp
      </button>
    </form>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      {/* Story */}
      <div className="mb-12">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#f5a623]/30 bg-[#f5a623]/10 px-3 py-1 text-xs font-semibold text-[#f5a623]">
          Our Story
        </div>
        <h1
          className="text-3xl font-bold text-white md:text-4xl"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          About Zenix Electronics
        </h1>
        <div className="mt-4 flex flex-col gap-3 text-[#8b92a5]">
          <p>
            Zenix Electronics was founded with a simple mission: make premium technology accessible
            to everyone in Nairobi. What started as a small shop on Accra Road has grown into one of
            Nairobi&apos;s most trusted electronics retailers — stocking everything from the latest
            iPhones to high-end audio equipment and accessories.
          </p>
          <p>
            We specialise in both brand-new and Ex-UK gadgets, giving our customers real choice at
            every price point. Every product we sell is thoroughly tested and verified before it
            reaches your hands.
          </p>
          <p>
            Whether you&apos;re upgrading your smartphone, kitting out a home office, or hunting for
            the perfect gift — our team is here to help you find exactly what you need.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            title: "Quality First",
            body: "Every product is inspected and verified before sale — brand new or Ex-UK.",
          },
          {
            title: "Fair Prices",
            body: "Competitive pricing with regular hot deals and clearance offers.",
          },
          {
            title: "Real Support",
            body: "Talk to a real person on WhatsApp — before, during, and after your purchase.",
          },
        ].map(({ title, body }) => (
          <div key={title} className="rounded-2xl border border-[#1e2435] bg-[#0d1117] p-5">
            <div className="mb-1.5 h-1 w-8 rounded-full bg-[#f5a623]" />
            <p className="mb-1 font-semibold text-white">{title}</p>
            <p className="text-sm text-[#8b92a5]">{body}</p>
          </div>
        ))}
      </div>

      {/* Map + info */}
      <div className="mb-12 overflow-hidden rounded-2xl border border-[#1e2435] bg-[#0d1117]">
        <div className="border-b border-[#1e2435] px-5 py-4">
          <h2 className="font-semibold text-white">Find Us</h2>
        </div>
        {/* Google Maps Platform Locator */}
        <div className="relative h-72 w-full md:h-96">
          <iframe
            src="https://storage.googleapis.com/maps-solutions-u1ah8swhb7/locator-plus/o4yg/locator-plus.html"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Zenix Electronics location"
          />
        </div>
        <div className="flex flex-col gap-3 p-5">
          <div className="flex items-start gap-3 text-sm">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#f5a623]" />
            <div>
              <p className="font-semibold text-white">Cookie House, Accra Road</p>
              <p className="text-[#8b92a5]">Nairobi CBD, Kenya</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="h-4 w-4 shrink-0 text-[#f5a623]" />
            <a href="tel:+254703659956" className="text-[#8b92a5] transition hover:text-white">
              +254 703 659 956
            </a>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 shrink-0 text-[#f5a623]" />
            <a
              href="mailto:info@zenixelectronics.co.ke"
              className="text-[#8b92a5] transition hover:text-white"
            >
              info@zenixelectronics.co.ke
            </a>
          </div>
          <div className="mt-1 rounded-xl border border-[#1e2435] bg-[#111827] p-3 text-sm">
            <p className="text-[#8b92a5]">
              Mon – Sat: <span className="font-medium text-white">8:00 AM – 7:00 PM</span>
            </p>
            <p className="text-[#8b92a5]">
              Sunday: <span className="font-medium text-white">10:00 AM – 5:00 PM</span>
            </p>
          </div>
        </div>
      </div>

      {/* Contact form */}
      <div className="overflow-hidden rounded-2xl border border-[#1e2435] bg-[#0d1117]">
        <div className="border-b border-[#1e2435] px-5 py-4">
          <h2 className="font-semibold text-white">Get in Touch</h2>
          <p className="mt-0.5 text-xs text-[#8b92a5]">
            Fill in the form and we&apos;ll reply via WhatsApp.
          </p>
        </div>
        <div className="p-5">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
