import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Zenix Electronics",
  description:
    "Get in touch with Zenix Electronics in Nairobi. WhatsApp, call, or email us about products, orders, and returns. Cookie House, Accra Road, Nairobi CBD.",
  openGraph: {
    title: "Contact Us — Zenix Electronics",
    description:
      "Get in touch with Zenix Electronics in Nairobi. WhatsApp, call, or email us about products, orders, and returns.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
