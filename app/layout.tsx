import type { Metadata } from "next";
import { Space_Grotesk, Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { Providers } from "./providers";
import { Toaster } from "sonner";
import { GoogleReviewsBadge } from "@/components/GoogleReviewsBadge";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://zenixelectronics.co.ke"),
  title: {
    default: "Zenix Electronics — Buy iPhones, MacBooks & More in Nairobi",
    template: "%s | Zenix Electronics",
  },
  description:
    "Shop brand new and Ex UK electronics in Nairobi. iPhones, Samsung, MacBooks, Starlinks, PlayStation, TVs, AirPods Max and more. Cookie House, Accra Road, Nairobi CBD. Same-day delivery.",
  keywords: [
    "electronics nairobi",
    "iphone nairobi",
    "buy iphone kenya",
    "samsung nairobi",
    "macbook nairobi",
    "ex uk phones nairobi",
    "brand new iphone kenya",
    "starlink kenya",
    "ps5 nairobi",
    "tv nairobi",
    "airpods nairobi",
    "electronics accra road",
    "cookie house nairobi",
    "cheap electronics nairobi",
    "zenix electronics",
    "ex uk macbook",
    "ipad nairobi",
    "gaming nairobi",
    "buy samsung kenya",
    "apple watch nairobi",
    "iphone 16 pro max nairobi",
    "ex uk electronics kenya",
    "online electronics store kenya",
    "same day delivery electronics nairobi",
    "macbook pro m3 nairobi",
    "ipad pro nairobi",
    "airpods nairobi",
    "ps5 kenya",
    "smart tv nairobi",
    "zenix electronics nairobi",
  ],
  openGraph: {
    type: "website",
    locale: "en_KE",
    siteName: "Zenix Electronics",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Zenix Electronics — Buy iPhones, MacBooks & More in Nairobi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image.png"],
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL ?? "https://zenixelectronics.co.ke",
  },
  other: {
    "theme-color": "#f5a623",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html
        lang="en-KE"
        data-scroll-behavior="smooth"
        className={cn(
          "h-full antialiased",
          spaceGrotesk.variable,
          inter.variable,
          geist.variable,
          "font-sans"
        )}
      >
        <head>
          {/* Google tag (gtag.js) */}
          <script async src="https://www.googletagmanager.com/gtag/js?id=GT-KD782FTB" />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'GT-KD782FTB');`,
            }}
          />
        </head>
        <body className="bg-bg-base text-text-primary relative flex min-h-full flex-col">
          <Providers>{children}</Providers>
          {/* Google Customer Reviews badge */}
          <script id="merchantWidgetScript" src="https://www.gstatic.com/shopping/merchant/merchantwidget.js" defer />
          <GoogleReviewsBadge />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#0d1117",
                border: "1px solid #1e2435",
                color: "#ffffff",
              },
            }}
          />
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
