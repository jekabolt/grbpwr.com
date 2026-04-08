import { NextResponse } from "next/server";

import { buildCatalogSitemapEntries, serializeUrlset } from "@/lib/sitemap";

export const revalidate = 3600;

export async function GET() {
  const entries = await buildCatalogSitemapEntries();
  const xml = serializeUrlset(entries);
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
