import type { common_HeroFullWithTranslations } from "@/api/proto-http/frontend";

import { Ads } from "./ads";
import { MainAds } from "./main-ads";

// Pure render of the hero blocks (main + ads) from an already-hydrated hero.
// Deliberately fetch-free: the caller supplies `hero`, so the exact same markup
// is shared by the homepage (server fetch) and the /preview/hero editor iframe
// (draft over postMessage) with no duplicated layout.
//
// Every block carries `data-hero-block-index` (its position in `hero.entities`);
// the homepage ignores it, but the /preview/hero iframe reads it on click to tell
// the editor which block was tapped. index 0 is the main block (`Ads` renders it
// as null via its default case, so there's no duplicate marker for it).
export function HeroView({ hero }: { hero?: common_HeroFullWithTranslations }) {
  return (
    <>
      {/* display:contents wrapper = layout-neutral click target for the main block */}
      <div style={{ display: "contents" }} data-hero-block-index={0}>
        <MainAds main={hero?.entities?.[0]?.main} />
      </div>
      <Ads entities={hero?.entities || []} />
    </>
  );
}
