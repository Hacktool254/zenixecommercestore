/**
 * Product image scraper — downloads one best-match image per product slug.
 *
 * Uses DuckDuckGo image search (no API key required).
 * Saves to scripts/product-images/<category>/<slug>.jpg
 * After running, batch-process through remove.bg, then upload to Convex/Cloudinary.
 *
 * Usage:
 *   npx tsx scripts/scrape-images.ts               # all products
 *   npx tsx scripts/scrape-images.ts iphones        # single category
 *   npx tsx scripts/scrape-images.ts --skip-existing # skip already-downloaded
 */

import { createWriteStream, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { pipeline } from "stream/promises";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "product-images");

// ─── Product list extracted from convex/seed.ts ──────────────────────────────

interface Product {
  slug: string;
  name: string;
  category: string;
  /** Extra search terms to sharpen the DDG query */
  searchHint?: string;
}

const PRODUCTS: Product[] = [
  // iPhones
  { slug: "iphone-12-pro-256gb-ex-usa", name: "iPhone 12 Pro", category: "iphones" },
  { slug: "iphone-12-pro-max-ex-usa", name: "iPhone 12 Pro Max", category: "iphones" },
  { slug: "iphone-13-ex-usa", name: "iPhone 13", category: "iphones" },
  { slug: "iphone-13-pro-ex-usa", name: "iPhone 13 Pro", category: "iphones" },
  { slug: "iphone-13-pro-max-ex-usa", name: "iPhone 13 Pro Max", category: "iphones" },
  { slug: "iphone-14-ex-usa", name: "iPhone 14", category: "iphones" },
  { slug: "iphone-14-pro-ex-usa", name: "iPhone 14 Pro", category: "iphones" },
  { slug: "iphone-14-pro-max-ex-usa", name: "iPhone 14 Pro Max", category: "iphones" },
  { slug: "iphone-15-ex-usa", name: "iPhone 15", category: "iphones" },
  { slug: "iphone-15-pro-max-ex-usa", name: "iPhone 15 Pro Max", category: "iphones" },
  { slug: "iphone-16-pro-max-ex-usa", name: "iPhone 16 Pro Max", category: "iphones" },
  { slug: "iphone-17-pro-ex-usa", name: "iPhone 17 Pro", category: "iphones" },
  { slug: "iphone-16-brand-new", name: "iPhone 16", category: "iphones" },
  { slug: "iphone-17-brand-new", name: "iPhone 17", category: "iphones" },
  { slug: "iphone-17-pro-brand-new", name: "iPhone 17 Pro", category: "iphones" },
  { slug: "iphone-17-pro-max-brand-new", name: "iPhone 17 Pro Max", category: "iphones" },
  { slug: "iphone-17-air-brand-new", name: "iPhone 17 Air", category: "iphones" },

  // Samsung
  { slug: "samsung-s23-ultra-ex-uk", name: "Samsung Galaxy S23 Ultra", category: "samsung" },
  { slug: "samsung-s24-plus-ex-uk", name: "Samsung Galaxy S24+", category: "samsung" },
  { slug: "samsung-s24-ultra-ex-uk", name: "Samsung Galaxy S24 Ultra", category: "samsung" },
  { slug: "samsung-fold-6-ex-uk", name: "Samsung Galaxy Z Fold 6", category: "samsung" },
  { slug: "samsung-fold-7-ex-uk", name: "Samsung Galaxy Z Fold 7", category: "samsung" },
  { slug: "samsung-s25-ultra-brand-new", name: "Samsung Galaxy S25 Ultra", category: "samsung" },
  { slug: "samsung-s26-brand-new", name: "Samsung Galaxy S26", category: "samsung" },
  { slug: "samsung-s26-ultra-brand-new", name: "Samsung Galaxy S26 Ultra", category: "samsung" },
  { slug: "samsung-flip-7-brand-new", name: "Samsung Galaxy Z Flip 7", category: "samsung" },
  { slug: "samsung-fold-7-brand-new", name: "Samsung Galaxy Z Fold 7", category: "samsung" },
  { slug: "samsung-trifold-brand-new", name: "Samsung Galaxy Z Trifold", category: "samsung" },

  // Wearables
  { slug: "apple-watch-series-10", name: "Apple Watch Series 10", category: "wearables" },
  { slug: "apple-watch-series-11", name: "Apple Watch Series 11", category: "wearables" },
  { slug: "apple-watch-se-3", name: "Apple Watch SE 3", category: "wearables" },
  { slug: "apple-watch-ultra-2", name: "Apple Watch Ultra 2", category: "wearables" },
  { slug: "apple-watch-ultra-3", name: "Apple Watch Ultra 3", category: "wearables" },
  { slug: "apple-watch-ultra-2025", name: "Apple Watch Ultra 2025", category: "wearables" },
  { slug: "apple-watch-series-6-40mm", name: "Apple Watch Series 6", category: "wearables" },
  { slug: "apple-watch-series-7-44mm", name: "Apple Watch Series 7", category: "wearables" },
  { slug: "apple-watch-series-8", name: "Apple Watch Series 8", category: "wearables" },

  // Mac
  { slug: "macbook-air-neo", name: "MacBook Air Neo", category: "mac" },
  { slug: "macbook-air-m4", name: "MacBook Air M4", category: "mac" },
  { slug: "macbook-air-m5", name: "MacBook Air M5", category: "mac" },
  { slug: "macbook-pro-m5", name: "MacBook Pro M5", category: "mac" },
  { slug: "mac-mini-m4", name: "Mac Mini M4", category: "mac" },

  // iPad
  { slug: "ipad-10th-gen", name: "iPad 10th Generation", category: "ipad" },
  { slug: "ipad-11th-gen-a16", name: "iPad 11th Gen A16", category: "ipad" },
  { slug: "ipad-air-13-m3", name: "iPad Air 13 M3", category: "ipad" },
  { slug: "ipad-air-11-m3", name: "iPad Air 11 M3", category: "ipad" },
  { slug: "ipad-mini-a17-pro", name: "iPad Mini A17 Pro", category: "ipad" },
  { slug: "ipad-pro-11-m5", name: "iPad Pro 11 M5", category: "ipad" },
  { slug: "ipad-pro-13-m5", name: "iPad Pro 13 M5", category: "ipad" },

  // Accessories
  { slug: "apple-pencil-pro", name: "Apple Pencil Pro", category: "accessories" },
  { slug: "apple-pencil-2nd-gen", name: "Apple Pencil 2nd Generation", category: "accessories" },
  { slug: "apple-pencil-usbc", name: "Apple Pencil USB-C", category: "accessories" },
  { slug: "airtag-1-pack", name: "AirTag", category: "accessories" },
  { slug: "airtag-4-pack", name: "AirTag 4-Pack", category: "accessories" },
  { slug: "magic-mouse", name: "Apple Magic Mouse", category: "accessories" },
  { slug: "magic-trackpad", name: "Apple Magic Trackpad", category: "accessories" },
  { slug: "magic-keyboard", name: "Apple Magic Keyboard", category: "accessories" },
  { slug: "apple-tv-4k", name: "Apple TV 4K", category: "accessories" },

  // Audio
  { slug: "airpods-max-usbc", name: "AirPods Max USB-C", category: "audio" },
  { slug: "airpods-pro-3", name: "AirPods Pro 3", category: "audio" },
  { slug: "airpods-4-anc", name: "AirPods 4 ANC", category: "audio" },
  { slug: "airpods-4", name: "AirPods 4", category: "audio" },

  // Gaming
  { slug: "ps5-slim", name: "PlayStation 5 Slim", category: "gaming", searchHint: "console" },
  { slug: "ps5-pro", name: "PlayStation 5 Pro", category: "gaming", searchHint: "console" },
  { slug: "ps4-slim", name: "PlayStation 4 Slim", category: "gaming", searchHint: "console" },
  { slug: "ps4-pro", name: "PlayStation 4 Pro", category: "gaming", searchHint: "console" },
  { slug: "playstation-portal", name: "PlayStation Portal", category: "gaming" },
  { slug: "ps5-disc-drive", name: "PS5 Disc Drive", category: "gaming" },
  { slug: "playstation-vr2", name: "PlayStation VR2", category: "gaming" },
  { slug: "xbox-series-x", name: "Xbox Series X", category: "gaming", searchHint: "console" },

  // Televisions
  { slug: "tcl-p8l-premium-qled", name: "TCL P8L QLED TV", category: "televisions" },
  { slug: "tcl-c6k-qled", name: "TCL C6K QLED TV", category: "televisions" },
  { slug: "tcl-c7l-miniled-qled", name: "TCL C7L Mini-LED QLED TV", category: "televisions" },
  { slug: "tcl-c8l-miniled-qled", name: "TCL C8L Mini-LED QLED TV", category: "televisions" },
];

// ─── DDG image search ─────────────────────────────────────────────────────────

const DDG_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://duckduckgo.com/",
};

async function getDdgVqd(query: string): Promise<string> {
  const url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`;
  const res = await fetch(url, { headers: DDG_HEADERS });
  const html = await res.text();
  const m = html.match(/vqd=([\d-]+)/);
  if (!m) throw new Error("Could not extract vqd from DDG page");
  return m[1]!;
}

interface DdgImageResult {
  image: string;
  thumbnail: string;
  width: number;
  height: number;
}

async function searchImages(query: string, count = 5): Promise<DdgImageResult[]> {
  const vqd = await getDdgVqd(query);
  const params = new URLSearchParams({
    l: "us-en",
    o: "json",
    q: query,
    vqd,
    f: ",,,,,",
    p: "1",
  });
  const url = `https://duckduckgo.com/i.js?${params}`;
  const res = await fetch(url, { headers: DDG_HEADERS });
  if (!res.ok) throw new Error(`DDG image API returned ${res.status}`);
  const data = (await res.json()) as { results: DdgImageResult[] };
  return (data.results ?? []).slice(0, count);
}

// ─── Scoring — prefer larger, square-ish images (product shots) ──────────────

function scoreImage(img: DdgImageResult): number {
  const area = img.width * img.height;
  const ratio = img.width / Math.max(img.height, 1);
  // Ideal product shots are roughly square (0.8–1.4) and at least 400px
  const ratioScore = ratio >= 0.8 && ratio <= 1.4 ? 1 : 0.5;
  const sizeScore = Math.min(area / (1200 * 1200), 1);
  return ratioScore * 0.6 + sizeScore * 0.4;
}

// ─── Download helper ──────────────────────────────────────────────────────────

async function downloadImage(url: string, destPath: string): Promise<boolean> {
  const res = await fetch(url, { headers: DDG_HEADERS, signal: AbortSignal.timeout(12000) });
  if (!res.ok || !res.body) return false;
  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.startsWith("image/")) return false;
  mkdirSync(dirname(destPath), { recursive: true });
  const ws = createWriteStream(destPath);
  await pipeline(res.body as unknown as NodeJS.ReadableStream, ws);
  return true;
}

function ext(url: string): string {
  const m = (url.split("?")[0] ?? "").match(/\.(jpe?g|png|webp)$/i);
  return m ? m[0].toLowerCase().replace("jpeg", "jpg") : ".jpg";
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const filterCategory = args.find((a) => !a.startsWith("--"));
const skipExisting = args.includes("--skip-existing");

const products = filterCategory ? PRODUCTS.filter((p) => p.category === filterCategory) : PRODUCTS;

if (products.length === 0) {
  console.error(`No products found for category "${filterCategory}"`);
  process.exit(1);
}

console.log(`\nScraping ${products.length} products → ${OUT_DIR}\n`);

let ok = 0;
let skipped = 0;
let failed = 0;

for (const product of products) {
  const destBase = join(OUT_DIR, product.category, product.slug);

  // Check if already downloaded (any extension)
  if (skipExisting) {
    const alreadyExists = [".jpg", ".png", ".webp"].some((e) => existsSync(destBase + e));
    if (alreadyExists) {
      console.log(`  ⏭  [skip] ${product.slug}`);
      skipped++;
      continue;
    }
  }

  const query = `${product.name}${product.searchHint ? " " + product.searchHint : ""} official product transparent background`;

  process.stdout.write(`  ↓  ${product.slug.padEnd(40)} `);

  try {
    const results = await searchImages(query, 8);
    const sorted = results
      .filter((r) => r.image && r.width > 200 && r.height > 200)
      .sort((a, b) => scoreImage(b) - scoreImage(a));

    let downloaded = false;
    for (const img of sorted) {
      const destPath = destBase + ext(img.image);
      try {
        const success = await downloadImage(img.image, destPath);
        if (success) {
          console.log(`✓  ${img.width}×${img.height}`);
          downloaded = true;
          ok++;
          break;
        }
      } catch {
        // try next result
      }
    }

    if (!downloaded) {
      console.log("✗  no downloadable image found");
      failed++;
    }
  } catch (err) {
    console.log(`✗  ${(err as Error).message}`);
    failed++;
  }

  // Polite delay — DDG rate-limits aggressive scrapers
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 400));
}

console.log(`\nDone — ${ok} downloaded, ${skipped} skipped, ${failed} failed\n`);
console.log(`Images saved to: ${OUT_DIR}`);
console.log(`Next: run remove.bg on the folder, then upload to Cloudinary/Convex.\n`);
