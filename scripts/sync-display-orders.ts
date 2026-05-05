/**
 * Sync displayOrder values from dev to prod.
 * Uses the authoritative dev order map captured 2026-05-05.
 */
import { ConvexHttpClient } from "convex/browser";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env.local") });

const urlFlagIdx = process.argv.indexOf("--url");
const urlOverride = urlFlagIdx !== -1 ? process.argv.splice(urlFlagIdx, 2)[1] : undefined;

const CONVEX_URL = urlOverride ?? process.env.NEXT_PUBLIC_CONVEX_URL;
if (!CONVEX_URL) {
  console.error("Missing NEXT_PUBLIC_CONVEX_URL");
  process.exit(1);
}

// Dev-authoritative displayOrder map (slug → order)
const ORDER_MAP: Record<string, number> = {
  "iphone-17-pro-max-brand-new": 1,
  "samsung-s26-ultra-brand-new": 2,
  "iphone-17-pro-brand-new": 3,
  "samsung-s26-brand-new": 4,
  "iphone-17-air-brand-new": 5,
  "samsung-fold-7-brand-new": 6,
  "iphone-17-brand-new": 7,
  "samsung-flip-7-brand-new": 8,
  "iphone-17-pro-ex-usa": 9,
  "samsung-s25-ultra-brand-new": 10,
  "iphone-16-pro-max-ex-usa": 11,
  "samsung-trifold-brand-new": 12,
  "iphone-16-brand-new": 13,
  "samsung-fold-7-ex-uk": 14,
  "iphone-15-pro-max-ex-usa": 15,
  "samsung-fold-6-ex-uk": 16,
  "iphone-15-ex-usa": 17,
  "samsung-s24-ultra-ex-uk": 18,
  "iphone-14-pro-max-ex-usa": 19,
  "samsung-s24-plus-ex-uk": 20,
  "iphone-14-pro-ex-usa": 21,
  "samsung-s23-ultra-ex-uk": 22,
  "iphone-14-ex-usa": 23,
  "iphone-13-pro-max-ex-usa": 24,
  "iphone-13-pro-ex-usa": 25,
  "iphone-13-ex-usa": 26,
  "iphone-12-pro-max-ex-usa": 27,
  "iphone-12-pro-256gb-ex-usa": 28,
  "ipad-pro-13-m5": 29,
  "ipad-pro-11-m5": 30,
  "ipad-air-13-m3": 31,
  "ipad-air-11-m3": 32,
  "ipad-mini-a17-pro": 33,
  "ipad-11th-gen-a16": 34,
  "ipad-10th-gen": 35,
  "macbook-pro-m5": 36,
  "macbook-air-m5": 37,
  "macbook-air-neo": 38,
  "macbook-air-m4": 39,
  "mac-mini-m4": 40,
  "apple-watch-ultra-3": 41,
  "apple-watch-ultra-2025": 42,
  "apple-watch-ultra-2": 43,
  "apple-watch-series-11": 44,
  "apple-watch-series-10": 45,
  "apple-watch-series-8": 46,
  "apple-watch-se-3": 47,
  "apple-watch-series-7-44mm": 48,
  "apple-watch-series-6-40mm": 49,
  "airpods-max-usbc": 50,
  "airpods-pro-3": 51,
  "airpods-4-anc": 52,
  "airpods-4": 53,
  "ps5-pro": 54,
  "ps5-slim": 55,
  "xbox-series-x": 56,
  "playstation-vr2": 57,
  "playstation-portal": 58,
  "ps5-disc-drive": 59,
  "ps4-pro": 60,
  "ps4-slim": 61,
  "apple-pencil-pro": 62,
  "apple-pencil-2nd-gen": 63,
  "apple-pencil-usbc": 64,
  "airtag-4-pack": 65,
  "airtag-1-pack": 66,
  "magic-mouse": 67,
  "magic-trackpad": 68,
  "magic-keyboard": 69,
  "apple-tv-4k": 70,
  "tcl-c8l-miniled-qled": 71,
  "tcl-c7l-miniled-qled": 72,
  "tcl-c6k-qled": 73,
  "tcl-p8l-premium-qled": 74,
};

const client = new ConvexHttpClient(CONVEX_URL);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setDisplayOrder = "products:setDisplayOrder" as any;

console.log(`\nSyncing displayOrder to: ${CONVEX_URL}\n`);

let ok = 0,
  failed = 0;

for (const [slug, displayOrder] of Object.entries(ORDER_MAP)) {
  process.stdout.write(`  ${slug.padEnd(36)} order=${String(displayOrder).padStart(3)}  `);
  try {
    await client.mutation(setDisplayOrder, { slug, displayOrder });
    console.log("✓");
    ok++;
  } catch (e) {
    console.log(`✗  ${(e as Error).message.slice(0, 60)}`);
    failed++;
  }
}

console.log(`\nDone — ${ok} updated, ${failed} failed\n`);
