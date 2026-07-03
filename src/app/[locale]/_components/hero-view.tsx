import type { common_HeroFullWithTranslations } from "@/api/proto-http/frontend";

import { Ads } from "./ads";
import { MainAds } from "./main-ads";

// Pure render of the hero blocks (main + ads) from an already-hydrated hero.
// Deliberately fetch-free: the caller supplies `hero`, so the exact same markup
// is shared by the homepage (server fetch) and the /preview/hero editor iframe
// (draft over postMessage) with no duplicated layout.
export function HeroView({ hero }: { hero?: common_HeroFullWithTranslations }) {
  return (
    <>
      <MainAds main={hero?.entities?.[0]?.main} />
      <Ads entities={hero?.entities || []} />
    </>
  );
}
