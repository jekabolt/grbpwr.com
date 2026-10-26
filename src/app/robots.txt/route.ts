import { NextResponse } from "next/server";

import { isProductionSiteEnvironment } from "@/lib/site-environment";

// Custom robots.txt route handler (replaces app/robots.ts) so we can emit a
// Content-Signal directive (contentsignals.org / IETF aipref draft) alongside
// the standard rules — Next's MetadataRoute.Robots can't express it.
// Policy: allow AI training, search indexing and AI input (answer) usage.
const PRODUCTION_BODY = `User-Agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=yes
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /*/checkout
Disallow: /*/account
Disallow: /*/login
Disallow: /*/order
Disallow: /*?

Sitemap: https://grbpwr.com/sitemap.xml
`;

const NON_PRODUCTION_BODY = `User-Agent: *
Disallow: /
`;

export function GET() {
  const body = isProductionSiteEnvironment(process.env.NEXT_PUBLIC_SITE_ENV)
    ? PRODUCTION_BODY
    : NON_PRODUCTION_BODY;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
