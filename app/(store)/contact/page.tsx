"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, MessageCircle, CheckCircle, Clock } from "lucide-react";

const WHATSAPP_NUMBER = "254703659956";

function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Hi Zenix Electronics!\n\nName: ${form.name}\nPhone: ${form.phone}\nSubject: ${form.subject}\n\nMessage:\n${form.message}`
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
          Your message is pre-filled. Just hit Send in WhatsApp.
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
            htmlFor="c-name"
            className="text-xs font-semibold tracking-widest text-[#8b92a5] uppercase"
          >
            Your Name
          </label>
          <input
            id="c-name"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="John Doe"
            className="rounded-xl border border-[#1e2435] bg-[#111827] px-3 py-2.5 text-sm text-white transition outline-none placeholder:text-[#4b5563] focus:border-[#f5a623]/50 focus:ring-1 focus:ring-[#f5a623]/20"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="c-phone"
            className="text-xs font-semibold tracking-widest text-[#8b92a5] uppercase"
          >
            Phone / WhatsApp
          </label>
          <input
            id="c-phone"
            required
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="0712 345 678"
            className="rounded-xl border border-[#1e2435] bg-[#111827] px-3 py-2.5 text-sm text-white transition outline-none placeholder:text-[#4b5563] focus:border-[#f5a623]/50 focus:ring-1 focus:ring-[#f5a623]/20"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="c-subject"
          className="text-xs font-semibold tracking-widest text-[#8b92a5] uppercase"
        >
          Subject
        </label>
        <input
          id="c-subject"
          required
          value={form.subject}
          onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
          placeholder="Product inquiry, order status, returns…"
          className="rounded-xl border border-[#1e2435] bg-[#111827] px-3 py-2.5 text-sm text-white transition outline-none placeholder:text-[#4b5563] focus:border-[#f5a623]/50 focus:ring-1 focus:ring-[#f5a623]/20"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="c-message"
          className="text-xs font-semibold tracking-widest text-[#8b92a5] uppercase"
        >
          Message
        </label>
        <textarea
          id="c-message"
          required
          rows={4}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          placeholder="Tell us what you need…"
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

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
      {/* Header */}
      <div className="mb-10">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#f5a623]/30 bg-[#f5a623]/10 px-3 py-1 text-xs font-semibold text-[#f5a623]">
          We&apos;re here to help
        </div>
        <h1
          className="text-3xl font-bold text-white md:text-4xl"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Contact Us
        </h1>
        <p className="mt-3 text-[#8b92a5]">
          Questions about a product, an order, or a return? Reach us directly — we respond fast,
          every day of the week.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Contact info — left */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          {/* Quick contacts */}
          <div className="rounded-2xl border border-[#1e2435] bg-[#0d1117] p-5">
            <h2 className="mb-4 text-sm font-semibold text-white">Quick Contact</h2>
            <div className="flex flex-col gap-4">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-[#8b92a5] transition hover:text-white"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#25D366]/10">
                  <MessageCircle className="h-4 w-4 text-[#25D366]" />
                </div>
                <div>
                  <p className="font-medium text-white">WhatsApp</p>
                  <p className="text-xs">+254 703 659 956</p>
                </div>
              </a>
              <a
                href="tel:+254703659956"
                className="flex items-center gap-3 text-sm text-[#8b92a5] transition hover:text-white"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f5a623]/10">
                  <Phone className="h-4 w-4 text-[#f5a623]" />
                </div>
                <div>
                  <p className="font-medium text-white">Call Us</p>
                  <p className="text-xs">+254 703 659 956</p>
                </div>
              </a>
              <a
                href="mailto:info@zenixelectronics.co.ke"
                className="flex items-center gap-3 text-sm text-[#8b92a5] transition hover:text-white"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#38bdf8]/10">
                  <Mail className="h-4 w-4 text-[#38bdf8]" />
                </div>
                <div>
                  <p className="font-medium text-white">Email</p>
                  <p className="text-xs">info@zenixelectronics.co.ke</p>
                </div>
              </a>
            </div>
          </div>

          {/* Location */}
          <div className="rounded-2xl border border-[#1e2435] bg-[#0d1117] p-5">
            <div className="mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#f5a623]" />
              <h2 className="text-sm font-semibold text-white">Our Store</h2>
            </div>
            <p className="mb-1 text-sm text-white">Cookie House, Accra Road</p>
            <p className="mb-3 text-xs text-[#8b92a5]">Nairobi CBD, Kenya</p>
            <a
              href="https://maps.google.com/?q=Cookie+House+Accra+Road+Nairobi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[#f5a623] hover:underline"
            >
              Get directions →
            </a>
          </div>

          {/* Hours */}
          <div className="rounded-2xl border border-[#1e2435] bg-[#0d1117] p-5">
            <div className="mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#f5a623]" />
              <h2 className="text-sm font-semibold text-white">Opening Hours</h2>
            </div>
            <div className="flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-[#8b92a5]">Mon – Sat</span>
                <span className="font-medium text-white">8:00 AM – 7:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8b92a5]">Sunday</span>
                <span className="font-medium text-white">10:00 AM – 5:00 PM</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-[#1e2435] pt-2">
                <span className="text-[#8b92a5]">WhatsApp Support</span>
                <span className="font-medium text-[#f5a623]">24/7</span>
              </div>
            </div>
          </div>

          {/* Social */}
          <div className="rounded-2xl border border-[#1e2435] bg-[#0d1117] p-5">
            <h2 className="mb-3 text-sm font-semibold text-white">Follow Us</h2>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/zenixelectronics"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1e2435] text-[#8b92a5] transition hover:border-[#f5a623]/40 hover:text-white"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://facebook.com/zenixelectronics"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1e2435] text-[#8b92a5] transition hover:border-[#f5a623]/40 hover:text-white"
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Form — right */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-[#1e2435] bg-[#0d1117] p-6">
            <h2 className="mb-1 font-semibold text-white">Send a Message</h2>
            <p className="mb-5 text-xs text-[#8b92a5]">
              We&apos;ll reply via WhatsApp — usually within minutes.
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
