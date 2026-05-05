import { ConvexHttpClient } from "convex/browser";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env.local") });

const PROD_URL = "https://reliable-salamander-205.convex.cloud";
const client = new ConvexHttpClient(PROD_URL);

type Row = { displayOrder?: number; name: string };

async function printSection(label: string, fn: string, limit = 8) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const products = (await client.query(fn as any, {})) as Row[];
  const shown = products.slice(0, limit);
  console.log(`\n${label} (${products.length} total):`);
  shown.forEach((p, i) => {
    console.log(
      `  ${String(i + 1).padStart(2)}. [order=${String(p.displayOrder ?? "nil").padStart(3)}] ${p.name}`
    );
  });
}

console.log("===== PROD (reliable-salamander-205) after sync =====");
await printSection("New Arrivals (first 14)", "products:getNewArrivals", 14);
await printSection("Featured", "products:getFeaturedProducts");
await printSection("Hot Deals", "products:getHotDeals");
