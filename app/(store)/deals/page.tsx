import type { Metadata } from "next";
import { DealsClient } from "./DealsClient";

export const metadata: Metadata = {
  title: "Hot Deals — Zenix Electronics",
  description:
    "Best deals on iPhones, Samsung, TVs, PlayStation and more. Limited time prices at Zenix Electronics, Accra Road, Nairobi.",
  openGraph: {
    title: "Hot Deals — Zenix Electronics",
    description: "Limited time deals on premium electronics in Nairobi.",
    images: ["/logo.png"],
  },
};

export default function DealsPage() {
  return <DealsClient />;
}
