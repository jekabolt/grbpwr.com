import { NextResponse } from "next/server";
import { GRBPWR_API, GRBPWR_PACK, GRBPWR_SITE } from "@/brands/grbpwr/config";

import { getShopPack } from "@/lib/shop/server";

// API catalog for automated API discovery (RFC 9727 / linkset RFC 9264).
// grbpwr pack only: its public frontend read API, with service-desc pointing at
// the frontend-only OpenAPI document served from this app. Other shops' API
// needs the x-shop-host header, so it is not advertised (404).
export const dynamic = "force-dynamic";

export async function GET() {
  if ((await getShopPack()) !== GRBPWR_PACK) {
    return new NextResponse("Not Found", { status: 404 });
  }
  const linkset = {
    linkset: [
      {
        anchor: GRBPWR_API.anchor,
        "service-desc": [
          {
            href: `${GRBPWR_SITE.origin}/openapi/frontend.json`,
            type: "application/json",
          },
        ],
      },
    ],
  };
  return new NextResponse(JSON.stringify(linkset, null, 2), {
    headers: {
      "Content-Type": "application/linkset+json",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
