import { setRequestLocale } from "next-intl/server";

import { ProductPreviewClient } from "./product-preview-client";

// The editor drives this iframe live over postMessage, so it must never be
// statically cached or ISR-revalidated — always render fresh.
export const dynamic = "force-dynamic";

export default async function ProductPreviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Unlike the hero (one published record), there is no "current" product to
  // seed — the editor decides which one — so the frame waits for the first draft.
  return <ProductPreviewClient />;
}
