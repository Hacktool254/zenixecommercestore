import type { Metadata } from "next";
import { Suspense } from "react";
import { Hero } from "@/components/home/Hero";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { NewArrivals } from "@/components/home/NewArrivals";
import { HotDeals } from "@/components/home/HotDeals";
import { VideoExpandSection } from "@/components/home/VideoExpandSection";
import { WhatsAppBanner } from "@/components/home/WhatsAppBanner";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Zenix Electronics — Buy iPhones, MacBooks & More in Nairobi",
  description:
    "Shop brand new and Ex UK electronics in Nairobi. iPhones, Samsung, MacBooks, Starlinks, PlayStation, TVs, AirPods Max and more. Cookie House, Accra Road, Nairobi CBD. Same-day delivery.",
  openGraph: {
    title: "Zenix Electronics — Buy iPhones, MacBooks & More in Nairobi",
    description:
      "Brand new and Ex UK iPhones, MacBooks, TVs, Starlinks & more. Cookie House, Accra Road, Nairobi. Same-day delivery.",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Zenix Electronics" }],
  },
  alternates: {
    canonical: "/",
  },
};

function SectionSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <Skeleton className="mb-8 h-8 w-48" />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-2xl border border-[#1e2435] bg-[#0d1117]"
          >
            <Skeleton className="aspect-square w-full" />
            <div className="flex flex-col gap-2 p-3">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-2 h-5 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "ElectronicsStore",
  name: "Zenix Electronics",
  description:
    "Nairobi's trusted electronics store. Brand new and Ex UK iPhones, MacBooks, Samsung, Starlinks, PlayStation, TVs and more.",
  url: "https://zenixelectronics.co.ke",
  telephone: "+254703659956",
  email: "info@zenixelectronics.co.ke",
  image: "https://zenixelectronics.co.ke/opengraph-image.png",
  logo: "https://zenixelectronics.co.ke/logo.png",
  priceRange: "KES",
  currenciesAccepted: "KES",
  paymentAccepted: "Cash, M-Pesa, Card",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Cookie House, Accra Road",
    addressLocality: "Nairobi",
    addressRegion: "Nairobi County",
    postalCode: "00100",
    addressCountry: "KE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -1.2836,
    longitude: 36.8222,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "08:00",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Sunday"],
      opens: "10:00",
      closes: "17:00",
    },
  ],
  sameAs: ["https://wa.me/254703659956"],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <Hero />
      <CategoryStrip />
      <Suspense fallback={<SectionSkeleton />}>
        <NewArrivals />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <HotDeals />
      </Suspense>
      <VideoExpandSection />
      <WhatsAppBanner />
    </>
  );
}
