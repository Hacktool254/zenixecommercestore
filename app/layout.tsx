import type { Metadata } from "next";
import { Space_Grotesk, Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { Providers } from "./providers";
import { Toaster } from "sonner";

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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://zenixecommercestore.vercel.app"
  ),
  title: {
    default: "Zenix Electronics — Premium Electronics in Nairobi",
    template: "%s | Zenix Electronics",
  },
  description:
    "Shop brand new and Ex UK electronics in Nairobi. iPhones, TVs, Soundbars, Starlinks, PlayStation, MacMini, AirPods Max and more. Located at Accra Road, Cookie House.",
  keywords: ["electronics", "nairobi", "iphone", "tv", "starlink", "ex uk", "brand new", "kenya"],
  openGraph: {
    type: "website",
    locale: "en_KE",
    siteName: "Zenix Electronics",
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
        lang="en"
        className={cn(
          "h-full antialiased",
          spaceGrotesk.variable,
          inter.variable,
          geist.variable,
          "font-sans"
        )}
      >
        <body className="bg-bg-base text-text-primary flex min-h-full flex-col">
          <Providers>{children}</Providers>
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
