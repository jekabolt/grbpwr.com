import { NextResponse } from "next/server";

import {
  SITEMAP_CHILD_DOCUMENT_RELATIVE,
  SITEMAP_PUBLIC_BASE_URL,
  serializeSitemapIndex,
} from "@/lib/sitemap";

export const revalidate = 3600;

export async function GET() {
  const locs = [
    `${SITEMAP_PUBLIC_BASE_URL}${SITEMAP_CHILD_DOCUMENT_RELATIVE.pages}`,
    `${SITEMAP_PUBLIC_BASE_URL}${SITEMAP_CHILD_DOCUMENT_RELATIVE.catalog}`,
    `${SITEMAP_PUBLIC_BASE_URL}${SITEMAP_CHILD_DOCUMENT_RELATIVE.products}`,
  ];
  const xml = serializeSitemapIndex(locs);
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
