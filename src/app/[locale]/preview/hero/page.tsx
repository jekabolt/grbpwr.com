import { setRequestLocale } from "next-intl/server";

import { getHero } from "@/lib/api";

import { HeroPreviewClient } from "./hero-preview-client";

// The editor drives this iframe live over postMessage, so it must never be
// statically cached or ISR-revalidated like the homepage — always render fresh.
export const dynamic = "force-dynamic";

export default async function HeroPreviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // First paint = the currently published hero, so the frame isn't blank before
  // the editor posts its first draft. Tolerate a backend failure gracefully.
  const initial = await getHero().catch(() => null);

  return <HeroPreviewClient initialHero={initial?.hero ?? null} />;
}
