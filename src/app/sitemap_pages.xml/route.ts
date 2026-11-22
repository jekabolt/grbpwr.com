import { NextResponse } from "next/server";

import { getShopOrigin } from "@/lib/shop/server";
import { buildPagesSitemapEntries, serializeUrlset } from "@/lib/sitemap";

// Per shop: the host decides which catalog and which base URL.
export const dynamic = "force-dynamic";

export async function GET() {
  const base = await getShopOrigin();
  if (!base) return new NextResponse("not found", { status: 404 });
  const entries = await buildPagesSitemapEntries(base);
  const xml = serializeUrlset(entries);
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
