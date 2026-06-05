import { NextResponse } from "next/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zenixelectronics.co.ke";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function conditionLabel(condition: string): string {
  if (condition === "brand-new") return "new";
  return "used"; // ex-uk / ex-usa
}

export async function GET() {
  const products = await fetchQuery(api.products.getAllProducts, {});

  const items = products
    .filter((p) => p.stock > 0 && p.images.length > 0)
    .map((p) => {
      const url = `${BASE_URL}/shop/${p.category}/${p.slug}`;
      const image = p.images[0];
      const condition = conditionLabel(p.condition);
      const brand = p.brand ?? p.category ?? "Zenix Electronics";

      // Build title with condition label
      const conditionSuffix =
        p.condition === "brand-new" ? "Brand New" : p.condition === "ex-uk" ? "Ex UK" : "Ex USA";
      const title = escapeXml(`${p.name} — ${conditionSuffix}`);
      const description = escapeXml(
        p.description.length > 5000 ? p.description.slice(0, 4997) + "..." : p.description
      );

      return `    <item>
      <g:id>${escapeXml(p.slug)}</g:id>
      <g:title>${title}</g:title>
      <g:description>${description}</g:description>
      <g:link>${escapeXml(url)}</g:link>
      <g:image_link>${escapeXml(image ?? "")}</g:image_link>
      <g:condition>${condition}</g:condition>
      <g:price>${p.price} KES</g:price>
      <g:availability>${p.stock > 0 ? "in_stock" : "out_of_stock"}</g:availability>
      <g:brand>${escapeXml(brand)}</g:brand>
      <g:product_type>${escapeXml(p.category)}</g:product_type>
      <g:shipping>
        <g:country>KE</g:country>
        <g:service>Standard</g:service>
        <g:price>300 KES</g:price>
      </g:shipping>
      <g:return_policy_label>default</g:return_policy_label>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Zenix Electronics</title>
    <link>${BASE_URL}</link>
    <description>Brand new and Ex UK electronics in Nairobi — iPhones, MacBooks, TVs, Starlinks and more.</description>
${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
