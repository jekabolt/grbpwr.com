import { NextResponse } from "next/server";

import { getShopOrigin } from "@/lib/shop/server";
import { isProductionSiteEnvironment } from "@/lib/site-environment";

// Per shop: the Sitemap line names this shop's own host; a host without an open
// shop is not indexed at all.
export const dynamic = "force-dynamic";

// Custom robots.txt route handler (replaces app/robots.ts) so we can emit a
// Content-Signal directive (contentsignals.org / IETF aipref draft) alongside
// the standard rules — Next's MetadataRoute.Robots can't express it.
// Policy: allow AI training, search indexing and AI input (answer) usage.
const productionBody = (origin: string) => `User-Agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=yes
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /*/checkout
Disallow: /*/account
Disallow: /*/login
Disallow: /*/order
Disallow: /*?

Sitemap: ${origin}/sitemap.xml
`;

const NON_PRODUCTION_BODY = `User-Agent: *
Disallow: /
`;

export async function GET() {
  const origin = await getShopOrigin();
  const body =
    origin && isProductionSiteEnvironment(process.env.NEXT_PUBLIC_SITE_ENV)
      ? productionBody(origin)
      : NON_PRODUCTION_BODY;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
