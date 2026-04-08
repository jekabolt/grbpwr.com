import { NextResponse } from "next/server";

import { buildProductSitemapEntries, serializeUrlset } from "@/lib/sitemap";

export const revalidate = 3600;

export async function GET() {
  const entries = await buildProductSitemapEntries();
  const xml = serializeUrlset(entries);
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
