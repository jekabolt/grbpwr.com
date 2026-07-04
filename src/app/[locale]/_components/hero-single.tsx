"use client";

import { useState } from "react";
import type { common_HeroSingleWithTranslations } from "@/api/proto-http/frontend";

import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { calculateAspectRatio, cn, internalHref, isVideo } from "@/lib/utils";
import { AnimatedButton } from "@/components/ui/animated-button";
import Image from "@/components/ui/image";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";

// Reusable atom for one hero slide: a portrait/landscape media pair, centred
// headline + explore-text copy, the explore-link wrapper, and the dark scrim
// (honouring the per-media `disableOverlay` modifier). SINGLE and DOUBLE render
// it directly; the composite types (SLIDESHOW, MOSAIC, LOOKBOOK, SPLIT) compose
// it. Hover-to-play video state is owned here so each instance is self-contained.
//
// `responsive` (default) swaps portrait on mobile / landscape on desktop like the
// SINGLE block. Pass `responsive={false}` for a single landscape crop that plays
// inline on mobile (the DOUBLE halves).
export function HeroSingle({
  single,
  priority = false,
  onHeroClick,
  fit = "cover",
  responsive = true,
  className = "relative h-screen w-full",
  copyClassName,
}: {
  single?: common_HeroSingleWithTranslations;
  priority?: boolean;
  onHeroClick?: () => void;
  fit?: "cover" | "contain";
  responsive?: boolean;
  className?: string;
  copyClassName?: string;
}) {
  const { languageId } = useTranslationsStore((state) => state);
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const [isHovered, setIsHovered] = useState(false);

  if (!single) return null;

  const translation =
    single.translations?.find((t) => t.languageId === languageId) ||
    single.translations?.[0];
  const landscape = single.media?.landscape?.media;
  const portrait = single.media?.portrait?.media;
  const headline = translation?.headline;
  const exploreText = translation?.exploreText;
  const alt = headline || "GRBPWR feature";

  const landscapeUrl = landscape?.thumbnail?.mediaUrl || "";
  const portraitUrl = portrait?.fullSize?.mediaUrl || "";
  const landscapeIsVideo = isVideo(landscapeUrl);

  const media = responsive ? (
    <>
      <div className="hidden h-full lg:block">
        <Image
          src={landscapeUrl}
          blurhash={landscape?.blurhash}
          alt={alt}
          aspectRatio={calculateAspectRatio(
            landscape?.thumbnail?.width,
            landscape?.thumbnail?.height,
          )}
          fit={fit}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          type={landscapeIsVideo ? "video" : "image"}
          playOnHover={isHovered}
          preload={priority ? "auto" : "metadata"}
        />
      </div>
      <div className="block h-full lg:hidden">
        <Image
          src={portraitUrl}
          blurhash={portrait?.blurhash}
          alt={alt}
          aspectRatio={calculateAspectRatio(
            portrait?.fullSize?.width,
            portrait?.fullSize?.height,
          )}
          type={isVideo(portraitUrl) ? "video" : "image"}
          fit={fit}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          preload={priority ? "auto" : "metadata"}
          autoPlay
        />
      </div>
    </>
  ) : (
    <Image
      src={landscapeUrl}
      blurhash={landscape?.blurhash}
      alt={alt}
      aspectRatio={calculateAspectRatio(
        landscape?.thumbnail?.width,
        landscape?.thumbnail?.height,
      )}
      fit={fit}
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      type={landscapeIsVideo ? "video" : "image"}
      playOnHover={isHovered}
      autoPlay={isMobile && landscapeIsVideo}
      preload={priority ? "auto" : "metadata"}
    />
  );

  const hasCopy = Boolean(headline || exploreText);

  return (
    <div className={className}>
      <AnimatedButton
        href={internalHref(single.exploreLink)}
        className="group relative h-full w-full text-bgColor"
        onClick={onHeroClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {media}
        {!single.media?.disableOverlay && (
          <Overlay cover="container" disablePointerEvents />
        )}
        {hasCopy && (
          <div
            className={cn(
              "absolute inset-0 z-20 flex flex-col items-center justify-center text-center",
              copyClassName,
            )}
          >
            {headline && (
              <Text
                variant="uppercase"
                component="h2"
                className={cn("w-full text-center", {
                  "group-hover:underline": !exploreText && single.exploreLink,
                })}
              >
                {headline}
              </Text>
            )}
            {exploreText && (
              <Text variant="uppercase" className="group-hover:underline">
                {exploreText}
              </Text>
            )}
          </div>
        )}
      </AnimatedButton>
    </div>
  );
}
