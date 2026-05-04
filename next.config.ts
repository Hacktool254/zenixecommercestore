import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // unoptimized: placehold.co and other external hosts block Vercel's server-side image proxy
    unoptimized: true,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co", pathname: "/**" },
      { protocol: "https", hostname: "*.convex.cloud", pathname: "/**" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
    ],
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
