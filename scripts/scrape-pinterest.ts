/**
 * Pinterest product image scraper
 *
 * Saves 3 images per product to: scripts/product-images/<category>/<slug>/1.jpg|2.jpg|3.jpg
 *
 * Usage:
 *   npx tsx scripts/scrape-pinterest.ts iphones            # one category
 *   npx tsx scripts/scrape-pinterest.ts gaming             # another category
 *   npx tsx scripts/scrape-pinterest.ts --skip-existing    # skip done slugs
 *   HEADLESS=false npx tsx scripts/scrape-pinterest.ts iphones  # watch browser
 *
 * Categories: iphones, samsung, wearables, mac, ipad, accessories, audio, gaming, televisions
 */

import { chromium, type Page } from "playwright";
import { createWriteStream, mkdirSync, existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { pipeline } from "stream/promises";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "product-images");
const CHROMIUM_PATH = "/home/dalestroy/.playwright/chromium-1217/chrome-linux64/chrome";
const HEADLESS = process.env.HEADLESS !== "false";
const IMAGES_PER_PRODUCT = 3;

const EMAIL = "theophydake@gmail.com";
const PASSWORD = "MH#26r$3#x5kV3c";

// ─── Product list ─────────────────────────────────────────────────────────────

interface Product {
  slug: string;
  category: string;
  query: string;
}

const PRODUCTS: Product[] = [
  // iPhones — search for clean press/render shots, exclude accessories/cases
  {
    slug: "iphone-12-pro-256gb-ex-usa",
    category: "iphones",
    query: "iPhone 12 Pro apple press render product photo clean background",
  },
  {
    slug: "iphone-12-pro-max-ex-usa",
    category: "iphones",
    query: "iPhone 12 Pro Max apple official render clean background",
  },
  {
    slug: "iphone-13-ex-usa",
    category: "iphones",
    query: "iPhone 13 apple press render product photo clean background",
  },
  {
    slug: "iphone-13-pro-ex-usa",
    category: "iphones",
    query: "iPhone 13 Pro apple official render clean background",
  },
  {
    slug: "iphone-13-pro-max-ex-usa",
    category: "iphones",
    query: "iPhone 13 Pro Max apple official product render",
  },
  {
    slug: "iphone-14-ex-usa",
    category: "iphones",
    query: "iPhone 14 apple press render product photo clean",
  },
  {
    slug: "iphone-14-pro-ex-usa",
    category: "iphones",
    query: "iPhone 14 Pro apple official render clean background",
  },
  {
    slug: "iphone-14-pro-max-ex-usa",
    category: "iphones",
    query: "iPhone 14 Pro Max apple official product render clean",
  },
  {
    slug: "iphone-15-ex-usa",
    category: "iphones",
    query: "iPhone 15 apple press render product photo",
  },
  {
    slug: "iphone-15-pro-max-ex-usa",
    category: "iphones",
    query: "iPhone 15 Pro Max apple official render clean background",
  },
  {
    slug: "iphone-16-pro-max-ex-usa",
    category: "iphones",
    query: "iPhone 16 Pro Max apple official product render clean",
  },
  {
    slug: "iphone-17-pro-ex-usa",
    category: "iphones",
    query: "iPhone 17 Pro apple official render product photo",
  },
  {
    slug: "iphone-16-brand-new",
    category: "iphones",
    query: "iPhone 16 apple official render clean background",
  },
  {
    slug: "iphone-17-brand-new",
    category: "iphones",
    query: "iPhone 17 apple official product render clean",
  },
  {
    slug: "iphone-17-pro-brand-new",
    category: "iphones",
    query: "iPhone 17 Pro apple official render product photo",
  },
  {
    slug: "iphone-17-pro-max-brand-new",
    category: "iphones",
    query: "iPhone 17 Pro Max apple official render clean background",
  },
  {
    slug: "iphone-17-air-brand-new",
    category: "iphones",
    query: "iPhone 17 Air apple official product render",
  },

  // Samsung — samsung.com press renders
  {
    slug: "samsung-s23-ultra-ex-uk",
    category: "samsung",
    query: "Samsung Galaxy S23 Ultra official press render clean background",
  },
  {
    slug: "samsung-s24-plus-ex-uk",
    category: "samsung",
    query: "Samsung Galaxy S24 Plus official press render clean",
  },
  {
    slug: "samsung-s24-ultra-ex-uk",
    category: "samsung",
    query: "Samsung Galaxy S24 Ultra official press render clean background",
  },
  {
    slug: "samsung-fold-6-ex-uk",
    category: "samsung",
    query: "Samsung Galaxy Z Fold 6 official render unfolded clean background",
  },
  {
    slug: "samsung-fold-7-ex-uk",
    category: "samsung",
    query: "Samsung Galaxy Z Fold 7 official render unfolded clean",
  },
  {
    slug: "samsung-s25-ultra-brand-new",
    category: "samsung",
    query: "Samsung Galaxy S25 Ultra official press render clean background",
  },
  {
    slug: "samsung-s26-brand-new",
    category: "samsung",
    query: "Samsung Galaxy S26 official render clean background",
  },
  {
    slug: "samsung-s26-ultra-brand-new",
    category: "samsung",
    query: "Samsung Galaxy S26 Ultra official press render clean",
  },
  {
    slug: "samsung-flip-7-brand-new",
    category: "samsung",
    query: "Samsung Galaxy Z Flip 7 official render clean background",
  },
  {
    slug: "samsung-fold-7-brand-new",
    category: "samsung",
    query: "Samsung Galaxy Z Fold 7 open official render clean",
  },
  {
    slug: "samsung-trifold-brand-new",
    category: "samsung",
    query: "Samsung Galaxy Z Trifold official render press photo",
  },

  // Wearables — apple watch face-on renders
  {
    slug: "apple-watch-series-10",
    category: "wearables",
    query: "Apple Watch Series 10 official apple render face on clean",
  },
  {
    slug: "apple-watch-series-11",
    category: "wearables",
    query: "Apple Watch Series 11 official apple render clean background",
  },
  {
    slug: "apple-watch-se-3",
    category: "wearables",
    query: "Apple Watch SE 3 official apple render clean",
  },
  {
    slug: "apple-watch-ultra-2",
    category: "wearables",
    query: "Apple Watch Ultra 2 official apple render clean background",
  },
  {
    slug: "apple-watch-ultra-3",
    category: "wearables",
    query: "Apple Watch Ultra 3 official apple render clean",
  },
  {
    slug: "apple-watch-ultra-2025",
    category: "wearables",
    query: "Apple Watch Ultra 2025 official apple render product photo",
  },
  {
    slug: "apple-watch-series-6-40mm",
    category: "wearables",
    query: "Apple Watch Series 6 official apple render clean background",
  },
  {
    slug: "apple-watch-series-7-44mm",
    category: "wearables",
    query: "Apple Watch Series 7 official apple render clean",
  },
  {
    slug: "apple-watch-series-8",
    category: "wearables",
    query: "Apple Watch Series 8 official apple render clean background",
  },

  // Mac — apple.com product renders top-down or 3/4 view
  {
    slug: "macbook-air-neo",
    category: "mac",
    query: "MacBook Air Neo official apple render product photo clean",
  },
  {
    slug: "macbook-air-m4",
    category: "mac",
    query: "MacBook Air M4 official apple render open clean background",
  },
  {
    slug: "macbook-air-m5",
    category: "mac",
    query: "MacBook Air M5 official apple render open product photo",
  },
  {
    slug: "macbook-pro-m5",
    category: "mac",
    query: "MacBook Pro M5 official apple render open clean background",
  },
  {
    slug: "mac-mini-m4",
    category: "mac",
    query: "Mac Mini M4 official apple render clean background top view",
  },

  // iPad — apple.com renders
  {
    slug: "ipad-10th-gen",
    category: "ipad",
    query: "iPad 10th generation official apple render clean background",
  },
  {
    slug: "ipad-11th-gen-a16",
    category: "ipad",
    query: "iPad 11th generation A16 official apple render clean",
  },
  {
    slug: "ipad-air-13-m3",
    category: "ipad",
    query: "iPad Air 13 M3 official apple render clean background",
  },
  { slug: "ipad-air-11-m3", category: "ipad", query: "iPad Air 11 M3 official apple render clean" },
  {
    slug: "ipad-mini-a17-pro",
    category: "ipad",
    query: "iPad Mini A17 Pro official apple render clean background",
  },
  {
    slug: "ipad-pro-11-m5",
    category: "ipad",
    query: "iPad Pro 11 M5 official apple render clean background",
  },
  {
    slug: "ipad-pro-13-m5",
    category: "ipad",
    query: "iPad Pro 13 M5 official apple render clean background",
  },

  // Accessories — clean product renders, no third-party accessories/cases
  {
    slug: "apple-pencil-pro",
    category: "accessories",
    query: "Apple Pencil Pro official apple render clean white background",
  },
  {
    slug: "apple-pencil-2nd-gen",
    category: "accessories",
    query: "Apple Pencil 2nd generation official apple render clean",
  },
  {
    slug: "apple-pencil-usbc",
    category: "accessories",
    query: "Apple Pencil USB-C official apple render clean background",
  },
  {
    slug: "airtag-1-pack",
    category: "accessories",
    query: "Apple AirTag official apple product render clean background",
  },
  {
    slug: "airtag-4-pack",
    category: "accessories",
    query: "Apple AirTag 4 pack official apple render clean background",
  },
  {
    slug: "magic-mouse",
    category: "accessories",
    query: "Apple Magic Mouse official apple product render clean white",
  },
  {
    slug: "magic-trackpad",
    category: "accessories",
    query: "Apple Magic Trackpad official apple render clean background",
  },
  {
    slug: "magic-keyboard",
    category: "accessories",
    query: "Apple Magic Keyboard official apple product render clean",
  },
  {
    slug: "apple-tv-4k",
    category: "accessories",
    query: "Apple TV 4K official apple product render clean background",
  },

  // Audio — official renders NOT cases or accessories
  {
    slug: "airpods-max-usbc",
    category: "audio",
    query: "AirPods Max USB-C apple official product render headphones",
  },
  {
    slug: "airpods-pro-3",
    category: "audio",
    query: "AirPods Pro 3 apple official product render earbuds case",
  },
  {
    slug: "airpods-4-anc",
    category: "audio",
    query: "AirPods 4 ANC apple official product render earbuds",
  },
  {
    slug: "airpods-4",
    category: "audio",
    query: "AirPods 4 apple official product render earbuds clean",
  },

  // Gaming — official console product renders
  {
    slug: "ps5-slim",
    category: "gaming",
    query: "PlayStation 5 Slim console sony official product render clean",
  },
  {
    slug: "ps5-pro",
    category: "gaming",
    query: "PlayStation 5 Pro console sony official product render clean",
  },
  {
    slug: "ps4-slim",
    category: "gaming",
    query: "PlayStation 4 Slim console sony official product render clean",
  },
  {
    slug: "ps4-pro",
    category: "gaming",
    query: "PlayStation 4 Pro console sony official product render",
  },
  {
    slug: "playstation-portal",
    category: "gaming",
    query: "PlayStation Portal sony official product render clean background",
  },
  {
    slug: "ps5-disc-drive",
    category: "gaming",
    query: "PS5 disc drive attachment sony official product render",
  },
  {
    slug: "playstation-vr2",
    category: "gaming",
    query: "PlayStation VR2 headset sony official product render clean",
  },
  {
    slug: "xbox-series-x",
    category: "gaming",
    query: "Xbox Series X microsoft official product render console clean",
  },

  // Televisions — manufacturer press renders
  {
    slug: "tcl-p8l-premium-qled",
    category: "televisions",
    query: "TCL P8L QLED TV official press product render clean",
  },
  {
    slug: "tcl-c6k-qled",
    category: "televisions",
    query: "TCL C6K QLED TV official press product render clean",
  },
  {
    slug: "tcl-c7l-miniled-qled",
    category: "televisions",
    query: "TCL C7L Mini-LED QLED TV official product render clean",
  },
  {
    slug: "tcl-c8l-miniled-qled",
    category: "televisions",
    query: "TCL C8L Mini-LED QLED TV official product render clean",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ext(url: string): string {
  const clean = url.split("?")[0];
  const m = clean.match(/\.(jpe?g|png|webp)$/i);
  return m ? m[0].toLowerCase().replace("jpeg", ".jpg") : ".jpg";
}

async function downloadImage(url: string, destPath: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok || !res.body) return false;
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.startsWith("image/")) return false;
    mkdirSync(dirname(destPath), { recursive: true });
    const ws = createWriteStream(destPath);
    await pipeline(res.body as unknown as NodeJS.ReadableStream, ws);
    return true;
  } catch {
    return false;
  }
}

function listImages(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => /\.(jpg|png|webp)$/i.test(f))
    .sort();
}

function countExisting(dir: string): number {
  return listImages(dir).length;
}

function isUsableUrl(url: string): boolean {
  if (!url || !url.includes("pinimg.com")) return false;
  const l = url.toLowerCase();
  return (
    !l.includes("avatar") &&
    !l.includes("profile") &&
    !l.includes("75x75") &&
    !l.includes("30x30") &&
    !l.includes("icon")
  );
}

// ─── Pinterest login ──────────────────────────────────────────────────────────

async function login(page: Page): Promise<void> {
  process.stdout.write("  Logging into Pinterest... ");
  await page.goto("https://www.pinterest.com/login/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  await page.fill('input[name="id"]', EMAIL);
  await page.waitForTimeout(400);
  await page.fill('input[name="password"]', PASSWORD);
  await page.waitForTimeout(400);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(5000);

  const loggedIn = await page
    .waitForSelector('[data-test-id="search-box-input"], input[placeholder*="Search"]', {
      timeout: 12000,
    })
    .then(() => true)
    .catch(() => false);

  console.log(loggedIn ? "✓" : "(continuing anyway)");
}

// ─── Scrape images for one product ───────────────────────────────────────────

async function scrapeProduct(page: Page, product: Product): Promise<number> {
  const destDir = join(OUT_DIR, product.category, product.slug);

  const encoded = encodeURIComponent(product.query);
  await page.goto(`https://www.pinterest.com/search/pins/?q=${encoded}&rs=typed`, {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });
  await page.waitForTimeout(2500);
  // Scroll to load more pins
  await page.evaluate(() => window.scrollBy(0, 1200));
  await page.waitForTimeout(1500);

  const rawUrls: string[] = await page.evaluate(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    document.querySelectorAll("img[src]").forEach((el) => {
      const src = (el as HTMLImageElement).src;
      if (!src.includes("pinimg.com")) return;
      // Upgrade to highest resolution
      const hi = src.replace(/\/\d+x(?:\/|$)/, "/originals/");
      if (!seen.has(hi)) {
        seen.add(hi);
        out.push(hi);
      }
    });
    return out;
  });

  const candidates = rawUrls.filter(isUsableUrl);

  mkdirSync(destDir, { recursive: true });
  let saved = 0;

  for (const url of candidates) {
    if (saved >= IMAGES_PER_PRODUCT) break;
    const suffix = saved === 0 ? "" : `-${saved}`;
    const filename = `${product.slug}${suffix}${ext(url)}`;
    const ok = await downloadImage(url, join(destDir, filename));
    if (ok) saved++;
  }

  return saved;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const cliArgs = process.argv.slice(2);
const filterCategory = cliArgs.find((a) => !a.startsWith("--"));
const skipExisting = cliArgs.includes("--skip-existing");

const products = filterCategory ? PRODUCTS.filter((p) => p.category === filterCategory) : PRODUCTS;

if (products.length === 0) {
  console.error(`No products found for category "${filterCategory}"`);
  console.error(`Valid: ${[...new Set(PRODUCTS.map((p) => p.category))].join(", ")}`);
  process.exit(1);
}

console.log(`\nPinterest scraper — ${products.length} products, ${IMAGES_PER_PRODUCT} each`);
console.log(`Output: ${OUT_DIR}`);
if (filterCategory) console.log(`Category: ${filterCategory}`);
console.log();

const browser = await chromium.launch({
  headless: HEADLESS,
  executablePath: CHROMIUM_PATH,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
});

const context = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
});

const page = await context.newPage();
await login(page);
console.log();

let ok = 0,
  skipped = 0,
  failed = 0;

for (const product of products) {
  const destDir = join(OUT_DIR, product.category, product.slug);

  if (skipExisting && countExisting(destDir) >= IMAGES_PER_PRODUCT) {
    console.log(`  ⏭  [skip] ${product.slug}`);
    skipped++;
    continue;
  }

  process.stdout.write(`  ↓  ${product.slug.padEnd(44)} `);

  try {
    const saved = await scrapeProduct(page, product);
    if (saved >= IMAGES_PER_PRODUCT) {
      console.log(`✓  ${saved} images`);
      ok++;
    } else if (saved > 0) {
      console.log(`~  ${saved}/${IMAGES_PER_PRODUCT} images`);
      ok++;
    } else {
      console.log("✗  0 images");
      failed++;
    }
  } catch (err) {
    console.log(`✗  ${(err as Error).message.slice(0, 70)}`);
    failed++;
  }

  await page.waitForTimeout(1000 + Math.random() * 500);
}

await browser.close();

console.log(`\nDone — ${ok} OK, ${skipped} skipped, ${failed} failed`);
console.log(`Images: ${OUT_DIR}`);
console.log(`\nNext: review images, run remove.bg, upload to Cloudinary.\n`);
