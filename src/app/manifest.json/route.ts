import { NextResponse } from "next/server";

import { getShopProfile } from "@/lib/shop/server";

// lekalo-shop: web app manifest of the shop on the request host (name, colours,
// logo from the team's brand). Unknown / closed host → 404.
export const dynamic = "force-dynamic";

export async function GET() {
  const shop = await getShopProfile();
  if (shop.status !== "ok") {
    return new NextResponse("Not Found", { status: 404 });
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
