import { ConvexHttpClient } from "convex/browser";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateProductImages = "products:updateProductImages" as any;

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env.local") });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!CONVEX_URL) {
  console.error("Missing NEXT_PUBLIC_CONVEX_URL");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

const slugs = [
  // iPhones
  "iphone-12-pro-256gb-ex-usa",
  "iphone-12-pro-max-ex-usa",
  "iphone-13-ex-usa",
  "iphone-13-pro-ex-usa",
  "iphone-13-pro-max-ex-usa",
  "iphone-14-ex-usa",
  "iphone-14-pro-ex-usa",
  "iphone-14-pro-max-ex-usa",
  "iphone-15-ex-usa",
  "iphone-15-pro-max-ex-usa",
  "iphone-16-brand-new",
  "iphone-16-pro-max-ex-usa",
  "iphone-17-air-brand-new",
  "iphone-17-brand-new",
  "iphone-17-pro-brand-new",
  "iphone-17-pro-ex-usa",
  "iphone-17-pro-max-brand-new",
  // Samsung
  "samsung-s23-ultra-ex-uk",
  "samsung-s24-plus-ex-uk",
  "samsung-s24-ultra-ex-uk",
  "samsung-s25-ultra-brand-new",
  "samsung-s26-brand-new",
  "samsung-s26-ultra-brand-new",
  "samsung-flip-7-brand-new",
  "samsung-fold-6-ex-uk",
  "samsung-fold-7-brand-new",
  "samsung-fold-7-ex-uk",
  "samsung-trifold-brand-new",
];

let ok = 0,
  failed = 0;
for (const slug of slugs) {
  process.stdout.write(`  ${slug.padEnd(50)} `);
  try {
    await client.mutation(updateProductImages, { slug, images: [] });
    console.log("✓ cleared");
    ok++;
  } catch (e) {
    console.log(`✗  ${(e as Error).message.slice(0, 60)}`);
    failed++;
  }
}
console.log(`\nDone — ${ok} cleared, ${failed} failed`);
