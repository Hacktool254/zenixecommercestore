"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

const SHOP_LINKS = [
  { label: "iPhones", href: "/shop/iphones" },
  { label: "Televisions", href: "/shop/televisions" },
  { label: "Audio", href: "/shop/audio" },
  { label: "Gaming", href: "/shop/gaming" },
  { label: "Starlink", href: "/shop/connectivity" },
  { label: "Accessories", href: "/shop/accessories" },
];

const INFO_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Delivery & Shipping", href: "/delivery" },
  { label: "Returns Policy", href: "/returns" },
  { label: "Deals", href: "/deals" },
  { label: "Track Order", href: "/account/orders" },
  { label: "Contact Us", href: "/contact" },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com/zenixelectronics",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com/zenixelectronics",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "https://twitter.com/zenixelectronics",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#1e2435] bg-[#0d1117]">
      {/* Video banner */}
      <div className="relative h-48 overflow-hidden md:h-64">
        <video
          src="/circle-reveal.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#0d1117]/70" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="inline-flex">
              <Image
                src="/logo.png"
                alt="Zenix Electronics"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-[#8b92a5]">
              Premium electronics in Nairobi. Brand new and Ex UK devices — iPhones, TVs, Soundbars,
              Starlinks, PlayStation, and more.
            </p>
            <div className="flex flex-col gap-2.5 text-sm text-[#8b92a5]">
              <a
                href="https://maps.google.com/?q=Cookie+House+Accra+Road+Nairobi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 transition-colors hover:text-white"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#f5a623]" />
                <span>Cookie House, Accra Road, Nairobi</span>
              </a>
              <a
                href="tel:+254703659956"
                className="flex items-center gap-2 transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4 shrink-0 text-[#f5a623]" />
                <span>+254 703 659 956</span>
              </a>
              <a
                href="mailto:info@zenixelectronics.co.ke"
                className="flex items-center gap-2 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4 shrink-0 text-[#f5a623]" />
                <span>info@zenixelectronics.co.ke</span>
              </a>
            </div>
          </div>

          {/* Col 2 — Shop */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-widest text-[#f5a623] uppercase">
              Shop
            </h3>
            <ul className="flex flex-col gap-2.5">
              {SHOP_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-[#8b92a5] transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-widest text-[#f5a623] uppercase">
              Information
            </h3>
            <ul className="flex flex-col gap-2.5">
              {INFO_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-[#8b92a5] transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[#1e2435] pt-6 sm:flex-row">
          <p className="text-xs text-[#8b92a5]">
            © {new Date().getFullYear()} Zenix Electronics. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {SOCIALS.map(({ label, href, svg }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8b92a5] transition-colors hover:bg-[#1a2035] hover:text-white"
              >
                {svg}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
