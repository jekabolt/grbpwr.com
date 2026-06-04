import { NextResponse } from "next/server";

// Custom robots.txt route handler (replaces app/robots.ts) so we can emit a
// Content-Signal directive (contentsignals.org / IETF aipref draft) alongside
// the standard rules — Next's MetadataRoute.Robots can't express it.
// Policy: allow AI training, search indexing and AI input (answer) usage.
const BODY = `User-Agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=yes
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /*/cart
Disallow: /*/checkout
Disallow: /*/account
Disallow: /*/login
Disallow: /*/order
Disallow: /*?

Sitemap: https://grbpwr.com/sitemap.xml
`;

export function GET() {
  return new NextResponse(BODY, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
