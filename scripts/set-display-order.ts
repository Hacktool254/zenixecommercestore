/**
 * Set displayOrder on all products so the shop shows:
 *   iPhone 17 Pro Max → Samsung S26 Ultra → iPhone 17 Pro → Samsung S26 → ...
 *   then older iPhones/Samsung, then iPad, Mac, Wearables, Audio, Gaming, Accessories, TVs
 *
 * Usage: npx tsx scripts/set-display-order.ts
 */

import { ConvexHttpClient } from "convex/browser";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env.local") });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setDisplayOrder = "products:setDisplayOrder" as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllProducts = "products:getAllProducts" as any;

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL!;
const client = new ConvexHttpClient(CONVEX_URL);

// Interleaved flagship order: newest iPhone → newest Samsung → next iPhone → next Samsung ...
// then older iPhones alone, then other categories
const SLUG_ORDER: string[] = [
  // Tier 1 — latest flagships interleaved
  "iphone-17-pro-max-brand-new",
  "samsung-s26-ultra-brand-new",
  "iphone-17-pro-brand-new",
  "samsung-s26-brand-new",
  "iphone-17-air-brand-new",
  "samsung-fold-7-brand-new",
  "iphone-17-brand-new",
  "samsung-flip-7-brand-new",

  // Tier 2 — previous gen interleaved
  "iphone-17-pro-ex-usa",
  "samsung-s25-ultra-brand-new",
  "iphone-16-pro-max-ex-usa",
  "samsung-trifold-brand-new",
  "iphone-16-brand-new",
  "samsung-fold-7-ex-uk",
  "iphone-15-pro-max-ex-usa",
  "samsung-fold-6-ex-uk",
  "iphone-15-ex-usa",
  "samsung-s24-ultra-ex-uk",
  "iphone-14-pro-max-ex-usa",
  "samsung-s24-plus-ex-uk",
  "iphone-14-pro-ex-usa",
  "samsung-s23-ultra-ex-uk",
  "iphone-14-ex-usa",
  "iphone-13-pro-max-ex-usa",
  "iphone-13-pro-ex-usa",
  "iphone-13-ex-usa",
  "iphone-12-pro-max-ex-usa",
  "iphone-12-pro-256gb-ex-usa",

  // iPad
  "ipad-pro-13-m5",
  "ipad-pro-11-m5",
  "ipad-air-13-m3",
  "ipad-air-11-m3",
  "ipad-mini-a17-pro",
  "ipad-11th-gen-a16",
  "ipad-10th-gen",

  // Mac
  "macbook-pro-m5",
  "macbook-air-m5",
  "macbook-air-neo",
  "macbook-air-m4",
  "mac-mini-m4",

  // Wearables
  "apple-watch-ultra-3",
  "apple-watch-ultra-2025",
  "apple-watch-ultra-2",
  "apple-watch-series-11",
  "apple-watch-series-10",
  "apple-watch-series-8",
  "apple-watch-se-3",
  "apple-watch-series-7-44mm",
  "apple-watch-series-6-40mm",

  // Audio
  "airpods-max-usbc",
  "airpods-pro-3",
  "airpods-4-anc",
  "airpods-4",

  // Gaming
  "ps5-pro",
  "ps5-slim",
  "xbox-series-x",
  "playstation-vr2",
  "playstation-portal",
  "ps5-disc-drive",
  "ps4-pro",
  "ps4-slim",

  // Accessories
  "apple-pencil-pro",
  "apple-pencil-2nd-gen",
  "apple-pencil-usbc",
  "airtag-4-pack",
  "airtag-1-pack",
  "magic-mouse",
  "magic-trackpad",
  "magic-keyboard",
  "apple-tv-4k",

  // Televisions
  "tcl-c8l-miniled-qled",
  "tcl-c7l-miniled-qled",
  "tcl-c6k-qled",
  "tcl-p8l-premium-qled",
];

console.log("\nFetching all products from Convex...");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const allProducts: any[] = await client.query(getAllProducts, {});
console.log(`Found ${allProducts.length} products\n`);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const knownSlugs = new Set(allProducts.map((p: any) => p.slug));

let ok = 0,
  skipped = 0;

for (let i = 0; i < SLUG_ORDER.length; i++) {
  const slug = SLUG_ORDER[i];
  if (!knownSlugs.has(slug)) {
    console.log(`  ⚠  not found: ${slug}`);
    skipped++;
    continue;
  }
  await client.mutation(setDisplayOrder, { slug, displayOrder: i + 1 });
  console.log(`  ✓  ${String(i + 1).padStart(3)}  ${slug}`);
  ok++;
}

console.log(`\nDone — ${ok} updated, ${skipped} not found\n`);
