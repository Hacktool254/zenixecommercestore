/**
 * Update Convex product images from public/products folder.
 *
 * Reads public/products/<category>/<slug>/ and patches each product's
 * images array with the corresponding public URL paths.
 *
 * Usage:
 *   npx tsx scripts/update-product-images.ts             # all products
 *   npx tsx scripts/update-product-images.ts iphones     # one category
 */

import { ConvexHttpClient } from "convex/browser";
import { readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateProductImages = "products:updateProductImages" as any;

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env.local") });

// Allow overriding the URL via --url flag, e.g. --url https://reliable-salamander-205.convex.cloud
const urlFlagIdx = process.argv.indexOf("--url");
const urlOverride = urlFlagIdx !== -1 ? process.argv.splice(urlFlagIdx, 2)[1] : undefined;

const CONVEX_URL = urlOverride ?? process.env.NEXT_PUBLIC_CONVEX_URL;
if (!CONVEX_URL) {
  console.error("Missing NEXT_PUBLIC_CONVEX_URL in .env.local");
  process.exit(1);
}

const PUBLIC_PRODUCTS = join(__dirname, "../public/products");
const client = new ConvexHttpClient(CONVEX_URL);

const filterCategory = process.argv[2];

// Walk public/products to build a map of slug → ["/products/...jpg", ...]
const imageMap: Record<string, string[]> = {};

const categories = readdirSync(PUBLIC_PRODUCTS).filter((f) => {
  if (filterCategory) return f === filterCategory;
  return true;
});

for (const category of categories) {
  const catDir = join(PUBLIC_PRODUCTS, category);
  const slugs = readdirSync(catDir);
  for (const slug of slugs) {
    const slugDir = join(catDir, slug);
    const files = readdirSync(slugDir)
      .filter((f) => /\.(jpg|png|webp)$/i.test(f))
      .sort((a, b) => {
        // Sort: slug.jpg first, then slug-1.jpg, slug-2.jpg
        const aBase = a.replace(/\.[^.]+$/, "");
        const bBase = b.replace(/\.[^.]+$/, "");
        if (aBase === slug) return -1;
        if (bBase === slug) return 1;
        return aBase.localeCompare(bBase);
      });
    if (files.length > 0) {
      imageMap[slug] = files.map((f) => `/products/${category}/${slug}/${f}`);
    }
  }
}

console.log(`\nUpdating ${Object.keys(imageMap).length} products in Convex...`);
if (filterCategory) console.log(`Category: ${filterCategory}`);
console.log();

let ok = 0;
const skipped = 0;
let failed = 0;

for (const [slug, images] of Object.entries(imageMap)) {
  process.stdout.write(`  ${slug.padEnd(48)} `);
  try {
    await client.mutation(updateProductImages, { slug, images });
    console.log(`✓  ${images.length} image${images.length !== 1 ? "s" : ""}`);
    ok++;
  } catch (err) {
    console.log(`✗  ${(err as Error).message.slice(0, 60)}`);
    failed++;
  }
}

console.log(`\nDone — ${ok} updated, ${skipped} skipped, ${failed} failed\n`);
