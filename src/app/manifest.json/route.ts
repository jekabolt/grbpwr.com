import { NextResponse } from "next/server";
import { GRBPWR_MANIFEST, GRBPWR_PACK } from "@/brands/grbpwr/config";

import { getShopPack, getShopProfile } from "@/lib/shop/server";

// Web app manifest of the shop on the request host (name, colours, logo from
// the team's brand; the grbpwr pack keeps its own). Unknown / closed host → 404.
export const dynamic = "force-dynamic";

export async function GET() {
  const shop = await getShopProfile();
  if (shop.status !== "ok") {
    return new NextResponse("Not Found", { status: 404 });
  }
  if ((await getShopPack()) === GRBPWR_PACK) {
    return NextResponse.json(GRBPWR_MANIFEST, {
      headers: {
        "Content-Type": "application/manifest+json",
        "Cache-Control": "public, max-age=300",
      },
    });
  }
  const { profile } = shop;
  const background = profile.colors?.background ?? "#ffffff";
  const manifest = {
    name: profile.name,
    short_name: profile.name,
    ...(profile.description ? { description: profile.description } : {}),
    start_url: "/",
    display: "standalone",
    background_color: background,
    theme_color: background,
    orientation: "portrait-primary",
    icons: profile.logoUrl ? [{ src: profile.logoUrl, sizes: "any" }] : [],
  };
  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "public, max-age=300",
    },
  });
}
