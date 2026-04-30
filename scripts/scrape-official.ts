/**
 * Official product image scraper
 *
 * Sources:
 *   Apple products  → apple.com/shop product pages (official renders, often pre-transparent)
 *   Samsung Ex-UK   → amazon.co.uk product pages
 *   Gaming          → playstation.com / xbox.com
 *   TCL TV          → tcl.com
 *   Other           → manufacturer sites
 *
 * Saves 3 images per product to: scripts/product-images/<category>/<slug>/1.jpg|2.jpg|3.jpg
 *
 * Usage:
 *   npx tsx scripts/scrape-official.ts                # all products
 *   npx tsx scripts/scrape-official.ts iphones        # one category
 *   npx tsx scripts/scrape-official.ts --skip-existing
 *   HEADLESS=false npx tsx scripts/scrape-official.ts iphones
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

// ─── Product definitions ──────────────────────────────────────────────────────

type Source = "apple" | "amazon-uk" | "playstation" | "xbox" | "tcl" | "samsung-global";

interface Product {
  slug: string;
  category: string;
  source: Source;
  /** Direct product page URL */
  url: string;
  /**
   * Substring to match against CDN image URLs (case-insensitive).
   * Used on multi-model pages (e.g. /shop/buy-iphone) to pick only
   * images belonging to this specific model.
   */
  modelFilter?: string;
}

const PRODUCTS: Product[] = [
  // ── iPhones — /shop/buy-iphone/<model> sub-pages; network interception
  // captures gallery images loaded by JS. modelFilter used when pro/pro-max
  // share the same sub-page (they have different CDN image names).
  // Pro and Pro Max share the same buy page and the same gallery image names (iphone-17-pro-...)
  {
    slug: "iphone-17-pro-max-brand-new",
    category: "iphones",
    source: "apple",
    url: "https://www.apple.com/shop/buy-iphone/iphone-17-pro",
    modelFilter: "iphone-17-pro-",
  },
  {
    slug: "iphone-17-pro-brand-new",
    category: "iphones",
    source: "apple",
    url: "https://www.apple.com/shop/buy-iphone/iphone-17-pro",
    modelFilter: "iphone-17-pro-",
  },
  {
    slug: "iphone-17-pro-ex-usa",
    category: "iphones",
    source: "apple",
    url: "https://www.apple.com/shop/buy-iphone/iphone-17-pro",
    modelFilter: "iphone-17-pro-",
  },
  {
    slug: "iphone-17-air-brand-new",
    category: "iphones",
    source: "apple",
    url: "https://www.apple.com/shop/buy-iphone/iphone-air",
    modelFilter: "iphone-air",
  },
  {
    slug: "iphone-17-brand-new",
    category: "iphones",
    source: "apple",
    url: "https://www.apple.com/shop/buy-iphone/iphone-17",
  },
  // Discontinued from Apple Store — fall back to Amazon UK product pages
  {
    slug: "iphone-16-pro-max-ex-usa",
    category: "iphones",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Apple+iPhone+16+Pro+Max+256GB&i=electronics",
  },
  {
    slug: "iphone-16-brand-new",
    category: "iphones",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Apple+iPhone+16+128GB+unlocked",
  },
  {
    slug: "iphone-15-pro-max-ex-usa",
    category: "iphones",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Apple+iPhone+15+Pro+Max+256GB+unlocked",
  },
  {
    slug: "iphone-15-ex-usa",
    category: "iphones",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Apple+iPhone+15+128GB+unlocked",
  },
  {
    slug: "iphone-14-pro-max-ex-usa",
    category: "iphones",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Apple+iPhone+14+Pro+Max+256GB&i=electronics",
  },
  {
    slug: "iphone-14-pro-ex-usa",
    category: "iphones",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Apple+iPhone+14+Pro+256GB&i=electronics",
  },
  {
    slug: "iphone-14-ex-usa",
    category: "iphones",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Apple+iPhone+14+128GB&i=electronics",
  },
  {
    slug: "iphone-13-pro-max-ex-usa",
    category: "iphones",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Apple+iPhone+13+Pro+Max&i=electronics&rh=n%3A1478267031",
  },
  {
    slug: "iphone-13-pro-ex-usa",
    category: "iphones",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Apple+iPhone+13+Pro&i=electronics&rh=n%3A1478267031",
  },
  {
    slug: "iphone-13-ex-usa",
    category: "iphones",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Apple+iPhone+13+128GB&i=electronics&rh=n%3A1478267031",
  },
  {
    slug: "iphone-12-pro-256gb-ex-usa",
    category: "iphones",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Apple+iPhone+12+Pro+256GB&i=electronics&rh=n%3A1478267031",
  },
  {
    slug: "iphone-12-pro-max-ex-usa",
    category: "iphones",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Apple+iPhone+12+Pro+Max&i=electronics&rh=n%3A1478267031",
  },

  // ── Samsung Ex-UK — amazon.co.uk search pages ─────────────────────────────
  // Ex-UK Samsung — Amazon UK
  {
    slug: "samsung-s23-ultra-ex-uk",
    category: "samsung",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Samsung+Galaxy+S23+Ultra+256GB",
  },
  {
    slug: "samsung-s24-plus-ex-uk",
    category: "samsung",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Samsung+Galaxy+S24+Plus+256GB",
  },
  {
    slug: "samsung-s24-ultra-ex-uk",
    category: "samsung",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Samsung+Galaxy+S24+Ultra+256GB",
  },
  {
    slug: "samsung-fold-6-ex-uk",
    category: "samsung",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Samsung+Galaxy+Z+Fold+6+256GB",
  },
  {
    slug: "samsung-fold-7-ex-uk",
    category: "samsung",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Samsung+Galaxy+Z+Fold7",
  },
  // Brand-new Samsung — Amazon UK (samsung.com only gives 1-2 KV/lifestyle shots)
  {
    slug: "samsung-s25-ultra-brand-new",
    category: "samsung",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Samsung+Galaxy+S25+Ultra+256GB",
  },
  {
    slug: "samsung-s26-brand-new",
    category: "samsung",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Samsung+Galaxy+S26+256GB",
  },
  {
    slug: "samsung-s26-ultra-brand-new",
    category: "samsung",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Samsung+Galaxy+S26+Ultra+256GB",
  },
  {
    slug: "samsung-flip-7-brand-new",
    category: "samsung",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Samsung+Galaxy+Z+Flip7",
  },
  {
    slug: "samsung-fold-7-brand-new",
    category: "samsung",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Samsung+Galaxy+Z+Fold7",
  },
  {
    slug: "samsung-trifold-brand-new",
    category: "samsung",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Samsung+Galaxy+Z+Fold+Special+Edition",
  },

  // ── Wearables — all via Amazon UK for consistency ───────────────────────────
  {
    slug: "apple-watch-series-11",
    category: "wearables",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Apple+Watch+Series+11",
  },
  {
    slug: "apple-watch-series-10",
    category: "wearables",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Apple+Watch+Series+10",
  },
  {
    slug: "apple-watch-se-3",
    category: "wearables",
    source: "apple",
    url: "https://www.apple.com/shop/buy-watch/apple-watch-se",
    modelFilter: "se-",
  },
  {
    slug: "apple-watch-ultra-3",
    category: "wearables",
    source: "apple",
    url: "https://www.apple.com/shop/buy-watch/apple-watch-ultra",
    modelFilter: "ultra-",
  },
  {
    slug: "apple-watch-ultra-2",
    category: "wearables",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Apple+Watch+Ultra+2",
  },
  {
    slug: "apple-watch-ultra-2025",
    category: "wearables",
    source: "apple",
    url: "https://www.apple.com/shop/buy-watch/apple-watch-ultra",
    modelFilter: "ultra-",
  },
  {
    slug: "apple-watch-series-8",
    category: "wearables",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Apple+Watch+Series+8",
  },
  {
    slug: "apple-watch-series-7-44mm",
    category: "wearables",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Apple+Watch+Series+7+44mm",
  },
  {
    slug: "apple-watch-series-6-40mm",
    category: "wearables",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Apple+Watch+Series+6+40mm",
  },

  // ── Mac — apple.com ───────────────────────────────────────────────────────
  {
    slug: "macbook-air-m4",
    category: "mac",
    source: "apple",
    url: "https://www.apple.com/shop/buy-mac/macbook-air",
  },
  {
    slug: "macbook-air-m5",
    category: "mac",
    source: "apple",
    url: "https://www.apple.com/shop/buy-mac/macbook-air",
  },
  {
    slug: "macbook-air-neo",
    category: "mac",
    source: "apple",
    url: "https://www.apple.com/shop/buy-mac/macbook-air",
  },
  {
    slug: "macbook-pro-m5",
    category: "mac",
    source: "apple",
    url: "https://www.apple.com/shop/buy-mac/macbook-pro",
  },
  {
    slug: "mac-mini-m4",
    category: "mac",
    source: "apple",
    url: "https://www.apple.com/shop/buy-mac/mac-mini",
  },

  // ── iPad — apple.com ──────────────────────────────────────────────────────
  {
    slug: "ipad-10th-gen",
    category: "ipad",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Apple+iPad+10th+generation",
  },
  {
    slug: "ipad-11th-gen-a16",
    category: "ipad",
    source: "apple",
    url: "https://www.apple.com/shop/buy-ipad/ipad",
  },
  {
    slug: "ipad-air-13-m3",
    category: "ipad",
    source: "apple",
    url: "https://www.apple.com/shop/buy-ipad/ipad-air",
  },
  {
    slug: "ipad-air-11-m3",
    category: "ipad",
    source: "apple",
    url: "https://www.apple.com/shop/buy-ipad/ipad-air",
  },
  {
    slug: "ipad-mini-a17-pro",
    category: "ipad",
    source: "apple",
    url: "https://www.apple.com/shop/buy-ipad/ipad-mini",
  },
  {
    slug: "ipad-pro-11-m5",
    category: "ipad",
    source: "apple",
    url: "https://www.apple.com/shop/buy-ipad/ipad-pro",
  },
  {
    slug: "ipad-pro-13-m5",
    category: "ipad",
    source: "apple",
    url: "https://www.apple.com/shop/buy-ipad/ipad-pro",
  },

  // ── Accessories — Amazon UK ───────────────────────────────────────────────
  {
    slug: "apple-pencil-pro",
    category: "accessories",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Apple+Pencil+Pro",
  },
  {
    slug: "apple-pencil-2nd-gen",
    category: "accessories",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Apple+Pencil+2nd+generation",
  },
  {
    slug: "apple-pencil-usbc",
    category: "accessories",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Apple+Pencil+USB-C+MUWA3ZM",
  },
  {
    slug: "airtag-1-pack",
    category: "accessories",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Apple+AirTag+MX532",
  },
  {
    slug: "airtag-4-pack",
    category: "accessories",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Apple+AirTag+4+pack+B09312LV7B",
  },
  {
    slug: "magic-mouse",
    category: "accessories",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Apple+Magic+Mouse+MXK53",
  },
  {
    slug: "magic-trackpad",
    category: "accessories",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Apple+Magic+Trackpad+Multi-Touch+Surface",
  },
  {
    slug: "magic-keyboard",
    category: "accessories",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Apple+Magic+Keyboard",
  },
  {
    slug: "apple-tv-4k",
    category: "accessories",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Apple+TV+4K",
  },

  // ── Audio — Amazon UK ─────────────────────────────────────────────────────
  {
    slug: "airpods-max-usbc",
    category: "audio",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Apple+AirPods+Max+USB-C",
  },
  {
    slug: "airpods-pro-3",
    category: "audio",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Apple+AirPods+Pro+3rd+generation",
  },
  {
    slug: "airpods-4-anc",
    category: "audio",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Apple+AirPods+4+Active+Noise+Cancellation",
  },
  {
    slug: "airpods-4",
    category: "audio",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Apple+AirPods+4+MXP93",
  },

  // ── Gaming — Amazon UK ────────────────────────────────────────────────────
  {
    slug: "ps5-slim",
    category: "gaming",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=PlayStation+5+Slim+console",
  },
  {
    slug: "ps5-pro",
    category: "gaming",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=PlayStation+5+Pro+console+Sony",
  },
  {
    slug: "ps4-slim",
    category: "gaming",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=PlayStation+4+Slim+console+Sony",
  },
  {
    slug: "ps4-pro",
    category: "gaming",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=PlayStation+4+Pro+console+Sony",
  },
  {
    slug: "playstation-portal",
    category: "gaming",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=PlayStation+Portal+Remote+Player",
  },
  {
    slug: "ps5-disc-drive",
    category: "gaming",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=PS5+Ultra+HD+Blu-ray+Disc+Drive",
  },
  {
    slug: "playstation-vr2",
    category: "gaming",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=PlayStation+VR2+headset+Sony",
  },
  {
    slug: "xbox-series-x",
    category: "gaming",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=Xbox+Series+X+console+Microsoft",
  },

  // ── Televisions — Amazon UK ───────────────────────────────────────────────
  {
    slug: "tcl-p8l-premium-qled",
    category: "televisions",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=TCL+P8L+QLED+TV",
  },
  {
    slug: "tcl-c6k-qled",
    category: "televisions",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=TCL+C6K+QLED+TV",
  },
  {
    slug: "tcl-c7l-miniled-qled",
    category: "televisions",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=TCL+C7L+Mini+LED+QLED+TV",
  },
  {
    slug: "tcl-c8l-miniled-qled",
    category: "televisions",
    source: "amazon-uk",
    url: "https://www.amazon.co.uk/s?k=TCL+C8L+Mini+LED+QLED+TV",
  },
];

// ─── Image extraction strategies ─────────────────────────────────────────────

async function extractAppleImages(
  page: Page,
  modelFilter?: string,
  intercepted: Map<string, string> = new Map()
): Promise<string[]> {
  // Scroll in steps to trigger lazy-loaded images
  await page.waitForTimeout(2500);
  await page.evaluate(() => window.scrollBy(0, 1800));
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollBy(0, 1800));
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollBy(0, 1800));
  await page.waitForTimeout(1000);

  const BAD = [
    "swatch",
    "compare",
    "beacon",
    "icon",
    "logo",
    "sprite",
    "pixel",
    "selector",
    "step1",
    "bugatti",
    "services-",
    "thumbnail",
    "witb",
    "trade-in",
    "apple-care",
    "chat",
    "specialist",
    "banner",
  ];

  const hero: string[] = [];
  const finishSelect: string[] = [];
  const rest: string[] = [];

  for (const [name, url] of intercepted) {
    const l = name.toLowerCase();
    if (BAD.some((b) => l.includes(b))) continue;
    if (modelFilter && !l.includes(modelFilter.toLowerCase())) continue;
    const widMatch = url.match(/[?&]wid=(\d+)/);
    const wid = widMatch ? parseInt(widMatch[1], 10) : 9999;
    if (wid <= 100) continue;

    // Skip iPhone-style lifestyle shots (two hands holding phones) but keep
    // Apple Watch "case-unselect-gallery" which are clean product renders
    if (l.includes("model-unselect") && !l.includes("case-unselect")) continue;
    if (l.includes("gallery") || l.includes("hero") || l.includes("unselect")) hero.push(url);
    else if (l.includes("finish") && l.includes("select")) finishSelect.push(url);
    else rest.push(url);
  }

  return [...hero, ...finishSelect, ...rest].slice(0, 20);
}

async function extractAmazonUKImages(page: Page, slug: string): Promise<string[]> {
  await page.waitForTimeout(3000);

  // Build keyword terms from the slug to verify on the product page
  // Strip condition suffixes and common filler words
  const normalizedSlug = slug
    .replace(/-ex-usa|-ex-uk|-brand-new|-256gb|-128gb/g, "")
    .replace(/-usbc|-anc|-miniled/g, "")
    .replace(/\bps5\b/g, "playstation-5")
    .replace(/\bps4\b/g, "playstation-4")
    .replace(/\bvr2\b/g, "vr")
    .replace(/\bm[345]\b/g, "") // strip chip suffixes — "macbook air m4" often missing from title
    .replace(/--+/g, "-");

  const slugTerms = normalizedSlug
    .split("-")
    .filter((t) => t.length > 1)
    .filter((t) => !["the", "and", "for", "with", "gen"].includes(t));

  // BAD product page title keywords — skip cases, accessories, cables
  const BAD_TITLE = [
    "case",
    "cover",
    "screen protector",
    "charger",
    "cable",
    "wallet",
    "pouch",
    "bumper",
    "tempered glass",
    "grip",
    "skin",
    "lens",
    "fitbag",
    "lensun",
    "idiskk",
    "atomos",
    "head case",
  ];

  // Collect all /dp/ links from the search results page
  // Amazon renders titles dynamically so we can't filter by title here —
  // instead we click each result and validate the product page title
  const hrefs: string[] = await page.evaluate(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    document.querySelectorAll('a[href*="/dp/"]').forEach((a) => {
      const href = (a as HTMLAnchorElement).href;
      const m = href.match(/\/dp\/([A-Z0-9]{10})/);
      if (m && !seen.has(m[1])) {
        seen.add(m[1]);
        out.push(`https://www.amazon.co.uk/dp/${m[1]}`);
      }
    });
    return out.slice(0, 12);
  });

  let productUrl = "";
  for (const href of hrefs) {
    await page.goto(href, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(2000);
    const pageTitle = await page.title().catch(() => "");
    const tl = pageTitle.toLowerCase();
    if (BAD_TITLE.some((b) => tl.includes(b))) continue;
    const matches = slugTerms.filter((t) => tl.includes(t.toLowerCase())).length;
    if (matches >= Math.ceil(slugTerms.length * 0.6)) {
      productUrl = href;
      break;
    }
  }

  if (!productUrl) return [];

  return page.evaluate(() => {
    const urls: string[] = [];
    // Primary image block
    document
      .querySelectorAll("#altImages img, #imgTagWrapperId img, #main-image-container img")
      .forEach((el) => {
        const src = (el as HTMLImageElement).src || el.getAttribute("data-old-hires") || "";
        if (!src.includes("amazon") && !src.includes("media-amazon")) return;
        // Strip Amazon thumbnail suffix to get full-res URL
        urls.push(src.replace(/\._[A-Z0-9_,]+_\./, "."));
      });
    // High-res image map from data attribute
    const imageData = document
      .querySelector("#imageBlock, #imgTagWrapperId")
      ?.getAttribute("data-a-dynamic-image");
    if (imageData) {
      try {
        const map: Record<string, [number, number]> = JSON.parse(imageData);
        const sorted = Object.entries(map).sort(([, a], [, b]) => b[0] * b[1] - a[0] * a[1]);
        for (const [url] of sorted.slice(0, 5)) urls.push(url);
      } catch {
        /* ignore */
      }
    }
    return [...new Set(urls)].slice(0, 15);
  });
}

async function extractPlayStationImages(page: Page): Promise<string[]> {
  await page.waitForTimeout(3000);
  return page.evaluate(() => {
    const urls = new Set<string>();
    document.querySelectorAll("img[src]").forEach((el) => {
      const src = (el as HTMLImageElement).src;
      if (
        src.includes("playstation.com") &&
        (src.includes("hero") ||
          src.includes("product") ||
          src.includes("console") ||
          src.includes("media") ||
          src.includes("cmsassets")) &&
        !src.includes("icon") &&
        !src.includes("logo") &&
        !src.includes("banner-bg")
      ) {
        urls.add(src);
      }
    });
    // picture sources
    document.querySelectorAll("picture source").forEach((el) => {
      const srcset = el.getAttribute("srcset") || "";
      const first = srcset.trim().split(/,?\s+/)[0];
      if (first?.includes("playstation.com")) urls.add(first);
    });
    return [...urls].slice(0, 15);
  });
}

async function extractXboxImages(page: Page): Promise<string[]> {
  await page.waitForTimeout(3000);
  return page.evaluate(() => {
    const urls = new Set<string>();
    document.querySelectorAll("img[src], picture source[srcset]").forEach((el) => {
      const src = (el as HTMLImageElement).src || el.getAttribute("srcset") || "";
      const first = src.trim().split(/,?\s+/)[0];
      if (
        first?.includes("xbox") ||
        first?.includes("microsoft") ||
        first?.includes("xboxassets")
      ) {
        if (!first.includes("icon") && !first.includes("logo") && !first.includes("avatar")) {
          urls.add(first);
        }
      }
    });
    return [...urls].slice(0, 15);
  });
}

async function extractTCLImages(page: Page): Promise<string[]> {
  await page.waitForTimeout(3000);
  return page.evaluate(() => {
    const urls = new Set<string>();
    document.querySelectorAll("img[src], picture source[srcset]").forEach((el) => {
      const src = (el as HTMLImageElement).src || el.getAttribute("srcset") || "";
      const first = src.trim().split(/,?\s+/)[0];
      if (first && (first.includes("tcl.com") || first.includes("tclusa"))) {
        if (!first.includes("icon") && !first.includes("logo")) {
          urls.add(first);
        }
      }
    });
    return [...urls].slice(0, 15);
  });
}

async function extractSamsungGlobalImages(page: Page): Promise<string[]> {
  await page.waitForTimeout(3000);
  return page.evaluate(() => {
    const urls = new Set<string>();
    document.querySelectorAll("img[src], picture source[srcset]").forEach((el) => {
      const src = (el as HTMLImageElement).src || el.getAttribute("srcset") || "";
      const parts = src.split(",").map((s) => s.trim().split(/\s+/)[0]);
      for (const url of parts) {
        if (
          url?.includes("samsung.com") &&
          !url.includes("icon") &&
          !url.includes("logo") &&
          !url.includes("banner-bg") &&
          (url.includes("product") ||
            url.includes("galaxy") ||
            url.includes("smartphone") ||
            url.includes("_front") ||
            url.includes("_side") ||
            url.includes("kv_") ||
            url.endsWith(".jpg") ||
            url.endsWith(".png") ||
            url.endsWith(".webp"))
        ) {
          urls.add(url);
        }
      }
    });
    return [...urls].slice(0, 20);
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ext(url: string): string {
  const clean = url.split("?")[0];
  const m = clean.match(/\.(jpe?g|png|webp)$/i);
  return m ? m[0].toLowerCase().replace("jpeg", ".jpg") : ".jpg";
}

async function downloadImage(url: string, destPath: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        Referer: url.includes("amazon") ? "https://www.amazon.co.uk/" : "https://www.apple.com/",
      },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok || !res.body) return false;
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.startsWith("image/")) return false;
    const size = parseInt(res.headers.get("content-length") ?? "0", 10);
    if (size > 0 && size < 5000) return false; // skip tiny images (icons/placeholders)
    mkdirSync(dirname(destPath), { recursive: true });
    const ws = createWriteStream(destPath);
    await pipeline(res.body as unknown as NodeJS.ReadableStream, ws);
    return true;
  } catch {
    return false;
  }
}

function isLikelyProductImage(url: string, source: Source): boolean {
  const l = url.toLowerCase();
  // Universal rejects
  if (
    l.includes("icon") ||
    l.includes("logo") ||
    l.includes("avatar") ||
    l.includes("sprite") ||
    l.includes("favicon") ||
    l.includes("pixel") ||
    l.includes("1x1") ||
    l.includes("blank") ||
    l.includes("placeholder") ||
    l.includes("badge") ||
    l.includes("flag") ||
    l.includes("star") ||
    l.includes("arrow") ||
    l.includes("cart") ||
    l.includes("checkout") ||
    l.includes("/ui/") ||
    l.includes("/icons/")
  )
    return false;

  // Source-specific accepts
  if (source === "apple") return l.includes("apple.com") || l.includes("cdn-apple.com");
  if (source === "amazon-uk") return l.includes("amazon") || l.includes("media-amazon");
  if (source === "playstation") return l.includes("playstation");
  if (source === "xbox") return l.includes("xbox") || l.includes("microsoft");
  if (source === "tcl") return l.includes("tcl");
  if (source === "samsung-global") return l.includes("samsung");
  return false;
}

function countExisting(dir: string): number {
  if (!existsSync(dir)) return 0;
  return readdirSync(dir).filter((f) => /\.(jpg|png|webp)$/i.test(f)).length;
}

// ─── Per-source scraping ──────────────────────────────────────────────────────

async function getImageUrls(page: Page, product: Product): Promise<string[]> {
  // For Apple: attach request listener BEFORE navigation so we catch all CDN requests
  const appleIntercepted = new Map<string, string>();
  if (product.source === "apple") {
    page.on("request", (req) => {
      const u = req.url();
      if (!u.includes("storeimages.cdn-apple.com") || !u.includes("as-images")) return;
      const m = u.match(/as-images\.apple\.com\/is\/([^?]+)/);
      if (m && !appleIntercepted.has(m[1])) appleIntercepted.set(m[1], u);
    });
  }

  await page.goto(product.url, { waitUntil: "domcontentloaded", timeout: 40000 });

  let raw: string[] = [];
  switch (product.source) {
    case "apple":
      raw = await extractAppleImages(page, product.modelFilter, appleIntercepted);
      break;
    case "amazon-uk":
      raw = await extractAmazonUKImages(page, product.slug);
      break;
    case "playstation":
      raw = await extractPlayStationImages(page);
      break;
    case "xbox":
      raw = await extractXboxImages(page);
      break;
    case "tcl":
      raw = await extractTCLImages(page);
      break;
    case "samsung-global":
      raw = await extractSamsungGlobalImages(page);
      break;
  }

  return raw.filter((u) => isLikelyProductImage(u, product.source));
}

async function scrapeProduct(page: Page, product: Product): Promise<number> {
  const destDir = join(OUT_DIR, product.category, product.slug);
  mkdirSync(destDir, { recursive: true });

  let candidates: string[];
  try {
    candidates = await getImageUrls(page, product);
  } catch (err) {
    throw new Error(`Navigation failed: ${(err as Error).message.slice(0, 80)}`);
  }

  let saved = 0;
  for (const url of candidates) {
    if (saved >= IMAGES_PER_PRODUCT) break;
    // Naming: slug.jpg, slug-1.jpg, slug-2.jpg
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
  console.error(`No products for category "${filterCategory}"`);
  console.error(`Valid: ${[...new Set(PRODUCTS.map((p) => p.category))].join(", ")}`);
  process.exit(1);
}

console.log(`\nOfficial scraper — ${products.length} products, ${IMAGES_PER_PRODUCT} each`);
console.log(`Output: ${OUT_DIR}`);
if (filterCategory) console.log(`Category: ${filterCategory}`);
console.log();

const browser = await chromium.launch({
  headless: HEADLESS,
  executablePath: CHROMIUM_PATH,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
});

const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  locale: "en-GB",
  extraHTTPHeaders: {
    "Accept-Language": "en-GB,en;q=0.9",
  },
});

const page = await context.newPage();

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

  process.stdout.write(`  ↓  ${product.slug.padEnd(44)} [${product.source}] `);

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
    console.log(`✗  ${(err as Error).message.slice(0, 80)}`);
    failed++;
  }

  await page.waitForTimeout(800 + Math.random() * 600);
}

await browser.close();

console.log(`\nDone — ${ok} OK, ${skipped} skipped, ${failed} failed`);
console.log(`Images: ${OUT_DIR}`);
console.log(`\nNext: review images, run remove.bg, upload to Cloudinary.\n`);
