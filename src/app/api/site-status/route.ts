import { NextResponse } from "next/server";

import { serviceClient } from "@/lib/api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const { dictionary } = await serviceClient.GetHero({});
    return NextResponse.json({
      siteEnabled: dictionary?.siteEnabled ?? true,
    });
  } catch {
    return NextResponse.json({ siteEnabled: true });
  }
}
