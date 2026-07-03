"use client";

import type { common_HeroVideoWithTranslations } from "@/api/proto-http/frontend";

import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { calculateAspectRatio, internalHref } from "@/lib/utils";
import { AnimatedButton } from "@/components/ui/animated-button";
import Image from "@/components/ui/image";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";

// VIDEO hero: full-screen muted-autoplay-loop clip with a poster frame and an
// optional CTA. Reuses the shared <Image type="video"> renderer; autoplay is
// gated on prefers-reduced-motion (falls back to the static poster). The scrim +
// copy only render when there is copy, so a pure-video block stays clean.
export function HeroVideo({
  video,
  priority = false,
  onHeroClick,
}: {
  video?: common_HeroVideoWithTranslations;
  priority?: boolean;
  onHeroClick?: () => void;
}) {
  const { languageId } = useTranslationsStore((state) => state);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  if (!video) return null;

  const translation = video.translations?.find(
    (t) => t.languageId === languageId,
  );
  const media = video.media?.media;
  const posterUrl = video.posterMedia?.media?.fullSize?.mediaUrl;
  const headline = translation?.headline;
  const ctaText = translation?.ctaText;
  const hasCopy = Boolean(headline || ctaText);
  const shouldAutoplay = Boolean(video.autoplay) && !reducedMotion;

  const content = (
    <>
      <div className="h-full w-full">
        <Image
          src={media?.fullSize?.mediaUrl || ""}
          type="video"
          alt={headline || "GRBPWR"}
          blurhash={media?.blurhash}
          aspectRatio={calculateAspectRatio(
            media?.fullSize?.width,
            media?.fullSize?.height,
          )}
          fit="cover"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          preload={priority ? "auto" : "metadata"}
          autoPlay={shouldAutoplay}
          muted={video.muted ?? true}
          loop={video.loop ?? true}
          {...(posterUrl ? { poster: posterUrl } : {})}
        />
      </div>
      {hasCopy && <Overlay cover="container" disablePointerEvents />}
      {hasCopy && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 text-center text-bgColor">
          {headline && (
            <Text variant="uppercase" component="h2">
              {headline}
            </Text>
          )}
          {ctaText && (
            <Text variant="uppercase" className="group-hover:underline">
              {ctaText}
            </Text>
          )}
        </div>
      )}
    </>
  );

  if (video.ctaLink) {
    return (
      <AnimatedButton
        href={internalHref(video.ctaLink)}
        className="group relative block h-screen w-full"
        onClick={onHeroClick}
      >
        {content}
      </AnimatedButton>
    );
  }
  return <div className="relative h-screen w-full">{content}</div>;
}
