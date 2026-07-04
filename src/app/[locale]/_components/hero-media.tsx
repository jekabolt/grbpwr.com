"use client";

import type { common_HeroMediaFull } from "@/api/proto-http/frontend";

import { calculateAspectRatio, cn, isVideo } from "@/lib/utils";
import Image from "@/components/ui/image";

// Full-bleed background for a HeroMediaFull: portrait on mobile / landscape on
// desktop (each falling back to the other slot). A dark mask (our --overlay
// tint) sits over the image and is removed by EITHER `disableTint` or
// `disableOverlay`, so the block can show as plain, undarkened media; `stroke`
// draws our grey hairline border around the media box. Video backgrounds autoplay
// muted (as a core brand hero, it does not pause under prefers-reduced-motion).
// Shared by the media-backed heroes (DROP, NEWSLETTER, EMBED fallback,
// PRODUCT_SPOTLIGHT). Renders nothing without a usable media URL.
export function HeroMedia({
  media,
  priority = false,
  className = "absolute inset-0",
}: {
  media?: common_HeroMediaFull;
  priority?: boolean;
  className?: string;
}) {
  const landscape = media?.landscape?.media;
  const portrait = media?.portrait?.media;
  const desktop = landscape || portrait;
  const mobile = portrait || landscape;
  const desktopUrl = desktop?.fullSize?.mediaUrl || "";
  const mobileUrl = mobile?.fullSize?.mediaUrl || "";
  if (!desktopUrl && !mobileUrl) return null;

  return (
    <div
      className={cn(
        className,
        media?.stroke && "border border-textInactiveColor",
      )}
    >
      <div className="hidden h-full w-full lg:block">
        <Image
          src={desktopUrl}
          blurhash={desktop?.blurhash}
          alt="GRBPWR"
          aspectRatio={calculateAspectRatio(
            desktop?.fullSize?.width,
            desktop?.fullSize?.height,
          )}
          fit="cover"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          type={isVideo(desktopUrl) ? "video" : "image"}
          autoPlay={isVideo(desktopUrl)}
        />
      </div>
      <div className="block h-full w-full lg:hidden">
        <Image
          src={mobileUrl}
          blurhash={mobile?.blurhash}
          alt="GRBPWR"
          aspectRatio={calculateAspectRatio(
            mobile?.fullSize?.width,
            mobile?.fullSize?.height,
          )}
          fit="cover"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          type={isVideo(mobileUrl) ? "video" : "image"}
          autoPlay={isVideo(mobileUrl)}
        />
      </div>
      {/* Single dark mask over the media. EITHER modifier — disableTint or
          disableOverlay — removes it, so the block renders as plain, undarkened
          media. */}
      {!media?.disableTint && !media?.disableOverlay && (
        <div
          className="pointer-events-none absolute inset-0 bg-overlay"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
