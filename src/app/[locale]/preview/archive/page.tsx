import { setRequestLocale } from "next-intl/server";

import { ArchivePreviewClient } from "./archive-preview-client";

// The editor drives this iframe live over postMessage, so it must never be
// statically cached or ISR-revalidated — always render fresh.
export const dynamic = "force-dynamic";

export default async function ArchivePreviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Mirrors the hero preview, but unlike the hero (one published record) there is
  // no "current" archive to seed — the editor decides which one — so we pass null
  // and the frame waits for the first `archive-draft`.
  return <ArchivePreviewClient initialArchive={null} />;
}
