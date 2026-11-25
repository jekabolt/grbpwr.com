import type { common_HeroFullWithTranslations } from "@/api/proto-http/frontend";

import { Ads } from "./ads";

// Pure render of the hero blocks from an already-hydrated hero. Deliberately
// fetch-free: the caller supplies `hero`, so the exact same markup is shared by
// the homepage (server fetch) and the /preview/hero editor iframe (draft over
// postMessage) with no duplicated layout.
//
// Every block carries `data-hero-block-index` (its position in `hero.entities`);
// the homepage ignores it, but the /preview/hero iframe reads it on click to tell
// the editor which block was tapped. MAIN blocks render inline through `Ads` like
// every other type, so any number of them can appear at any position.
export function HeroView({
  hero,
  preview = false,
}: {
  hero?: common_HeroFullWithTranslations;
  // In the /preview editor, skip the audience-targeting gate so every block is
  // visible and selectable regardless of the viewer.
  preview?: boolean;
}) {
  return <Ads entities={hero?.entities || []} preview={preview} />;
}
