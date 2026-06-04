import { NextResponse } from "next/server";

// API catalog for automated API discovery (RFC 9727 / linkset RFC 9264).
// Advertises only the public frontend read API; service-desc points at the
// frontend-only OpenAPI document served from this app (see
// /openapi/frontend.json), not the combined backend spec.

const SITE = "https://grbpwr.com";

const linkset = {
  linkset: [
    {
      anchor: "https://backend.grbpwr.com/api/frontend",
      "service-desc": [
        { href: `${SITE}/openapi/frontend.json`, type: "application/json" },
      ],
    },
  ],
};

export function GET() {
  return new NextResponse(JSON.stringify(linkset, null, 2), {
    headers: {
      "Content-Type": "application/linkset+json",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
