"use client";

import type { common_HeroVideoWithTranslations } from "@/api/proto-http/frontend";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { calculateAspectRatio, internalHref } from "@/lib/utils";
import { AnimatedButton } from "@/components/ui/animated-button";
import Image from "@/components/ui/image";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";

// VIDEO hero: full-screen muted-autoplay-loop clip with an optional CTA. Reuses
// the shared <Image type="video"> renderer. Autoplay + muted are forced on (muted
// is required for browsers to allow autoplay, and this is a core brand hero), and
// it does not pause under prefers-reduced-motion. A poster layer sits behind the
// video so the block is never blank while it loads or if the clip is missing. The
// scrim + copy only render when there is copy, so a pure-video block stays clean.
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

  if (!video) return null;

  const translation =
    video.translations?.find((t) => t.languageId === languageId) ||
    video.translations?.[0];
  const media = video.media?.media;
  // The playable URL can live in any size slot depending on the transcode; fall
  // back across them so a video that only populated one slot still renders.
  const videoUrl =
    media?.fullSize?.mediaUrl ||
    media?.compressed?.mediaUrl ||
    media?.thumbnail?.mediaUrl ||
    "";
  const posterUrl =
    video.posterMedia?.media?.fullSize?.mediaUrl ||
    video.posterMedia?.media?.thumbnail?.mediaUrl;
  const headline = translation?.headline;
  const ctaText = translation?.ctaText;
  const hasCopy = Boolean(headline || ctaText);

  const content = (
    <>
      {/* Poster/first-frame layer behind — the block is never blank while the
          video loads, and if the clip URL is missing the poster still shows. */}
      {posterUrl && (
        <div className="absolute inset-0">
          <Image
            src={posterUrl}
            type="image"
            alt={headline || "GRBPWR"}
            blurhash={media?.blurhash}
            aspectRatio={calculateAspectRatio(
              video.posterMedia?.media?.fullSize?.width,
              video.posterMedia?.media?.fullSize?.height,
            )}
            fit="cover"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
          />
        </div>
      )}
      {videoUrl && (
        <div className="absolute inset-0">
          <Image
            src={videoUrl}
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
            autoPlay
            muted
            loop={video.loop ?? true}
            {...(posterUrl ? { poster: posterUrl } : {})}
          />
        </div>
      )}
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
