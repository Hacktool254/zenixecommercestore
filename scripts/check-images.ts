import { ConvexHttpClient } from "convex/browser";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env.local") });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllProducts = "products:getAllProductsAdmin" as any;

const products = await client.query(getAllProducts, {});
const relevant = products.filter(
  (p: { category: string }) => p.category === "iphones" || p.category === "samsung"
);

for (const p of relevant) {
  const imgs = p.images as string[];
  console.log(`\n${p.slug}`);
  if (!imgs.length) {
    console.log("  ⚠️  NO IMAGES");
  } else {
    imgs.forEach((img: string) => console.log(`  ${img}`));
  }
}
