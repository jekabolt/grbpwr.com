"use client";

import type { common_HeroMediaFull } from "@/api/proto-http/frontend";

import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { calculateAspectRatio, isVideo } from "@/lib/utils";
import Image from "@/components/ui/image";
import { Overlay } from "@/components/ui/overlay";

// Full-bleed background for a HeroMediaFull: portrait on mobile / landscape on
// desktop (each falling back to the other slot), with the dark scrim honouring
// the per-media `disableOverlay` modifier. Video backgrounds autoplay muted
// unless the viewer prefers reduced motion. Shared by the media-backed heroes
// (DROP, NEWSLETTER, EMBED fallback, PRODUCT_SPOTLIGHT). Renders nothing without
// a usable media URL.
export function HeroMedia({
  media,
  priority = false,
  className = "absolute inset-0",
}: {
  media?: common_HeroMediaFull;
  priority?: boolean;
  className?: string;
}) {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const landscape = media?.landscape?.media;
  const portrait = media?.portrait?.media;
  const desktop = landscape || portrait;
  const mobile = portrait || landscape;
  const desktopUrl = desktop?.fullSize?.mediaUrl || "";
  const mobileUrl = mobile?.fullSize?.mediaUrl || "";
  if (!desktopUrl && !mobileUrl) return null;

  return (
    <div className={className}>
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
          autoPlay={isVideo(desktopUrl) && !reducedMotion}
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
          autoPlay={isVideo(mobileUrl) && !reducedMotion}
        />
      </div>
      {!media?.disableOverlay && (
        <Overlay cover="container" disablePointerEvents />
      )}
    </div>
  );
}
