import { NextResponse } from "next/server";

import {
  SITEMAP_CHILD_DOCUMENT_RELATIVE,
  serializeSitemapIndex,
} from "@/lib/sitemap";
import { getShopOrigin } from "@/lib/shop/server";

// Per shop: the host decides which catalog and which base URL.
export const dynamic = "force-dynamic";

export async function GET() {
  const base = await getShopOrigin();
  if (!base) return new NextResponse("not found", { status: 404 });
  const locs = [
    `${base}${SITEMAP_CHILD_DOCUMENT_RELATIVE.pages}`,
    `${base}${SITEMAP_CHILD_DOCUMENT_RELATIVE.catalog}`,
    `${base}${SITEMAP_CHILD_DOCUMENT_RELATIVE.products}`,
  ];
  const xml = serializeSitemapIndex(locs);
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
