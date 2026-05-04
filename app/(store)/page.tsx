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
  title: "Zenix Electronics — Premium Electronics in Nairobi",
  description:
    "Shop brand new and Ex UK electronics in Nairobi. iPhones, TVs, Soundbars, Starlinks, PlayStation, MacMini, AirPods Max and more. Located at Accra Road, Cookie House.",
  openGraph: {
    title: "Zenix Electronics — Premium Electronics in Nairobi",
    description:
      "Brand new and Ex UK iPhones, TVs, Soundbars, Starlinks & more. Cookie House, Accra Road, Nairobi.",
    images: ["/logo.png"],
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

export default function HomePage() {
  return (
    <>
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
