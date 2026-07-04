"use client";

import type { common_HeroStatementWithTranslations } from "@/api/proto-http/frontend";

import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { calculateAspectRatio, cn, internalHref, isVideo } from "@/lib/utils";
import { AnimatedButton } from "@/components/ui/animated-button";
import Image from "@/components/ui/image";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";

// STATEMENT hero: centred statement copy (headline + optional subhead/body) at
// the normal text size, optionally over a subtle background image/video. Copy
// flips to light on media, dark on a plain background. The scrim honours the
// media's disableOverlay; an optional exploreLink wraps the whole block.
export function HeroStatement({
  statement,
  priority = false,
  onHeroClick,
}: {
  statement?: common_HeroStatementWithTranslations;
  priority?: boolean;
  onHeroClick?: () => void;
}) {
  const { languageId } = useTranslationsStore((state) => state);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  if (!statement) return null;

  const t =
    statement.translations?.find((x) => x.languageId === languageId) ||
    statement.translations?.[0];
  const bg =
    statement.media?.landscape?.media || statement.media?.portrait?.media;
  const bgUrl = bg?.fullSize?.mediaUrl || "";
  const hasMedia = Boolean(bgUrl);
  const bgIsVideo = isVideo(bgUrl);

  const inner = (
    <>
      {hasMedia && (
        <div className="absolute inset-0">
          <Image
            src={bgUrl}
            alt={t?.headline || "GRBPWR"}
            blurhash={bg?.blurhash}
            type={bgIsVideo ? "video" : "image"}
            aspectRatio={calculateAspectRatio(
              bg?.fullSize?.width,
              bg?.fullSize?.height,
            )}
            fit="cover"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            autoPlay={bgIsVideo && !reducedMotion}
          />
        </div>
      )}
      {hasMedia && !statement.media?.disableOverlay && (
        <Overlay cover="container" disablePointerEvents />
      )}
      <div
        className={cn(
          "relative z-20 flex flex-col items-center gap-6 p-6 text-center",
          hasMedia ? "text-bgColor" : "text-textColor",
        )}
      >
        {t?.headline && (
          <Text component="h2" variant="uppercase">
            {t.headline}
          </Text>
        )}
        {t?.subhead && <Text variant="uppercase">{t.subhead}</Text>}
        {t?.body && <Text className="max-w-2xl">{t.body}</Text>}
        {t?.exploreText && (
          <Text variant="uppercase" className="underline">
            {t.exploreText}
          </Text>
        )}
      </div>
    </>
  );

  const className =
    "relative flex min-h-screen w-full items-center justify-center";

  if (statement.exploreLink) {
    return (
      <AnimatedButton
        href={internalHref(statement.exploreLink)}
        className={cn("group", className)}
        onClick={onHeroClick}
      >
        {inner}
      </AnimatedButton>
    );
  }
  return <div className={className}>{inner}</div>;
}
