"use client";

import type { common_HeroLookbookWithTranslations } from "@/api/proto-http/frontend";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { internalHref } from "@/lib/utils";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Text } from "@/components/ui/text";

import { HeroSingle } from "./hero-single";

// LOOKBOOK hero: a vertically-scrolled sequence of full-bleed <HeroSingle> frames,
// each with an optional cornered caption (from the frame's own translation),
// closed by an optional explore CTA (from the lookbook-level translation). Native
// scroll, no autoplay/animation — reduced-motion-safe by construction. Frames
// below the fold lazy-load.
export function HeroLookbook({
  lookbook,
  priority = false,
  onHeroClick,
}: {
  lookbook?: common_HeroLookbookWithTranslations;
  priority?: boolean;
  onHeroClick?: () => void;
}) {
  const { languageId } = useTranslationsStore((state) => state);
  const frames = lookbook?.frames ?? [];
  if (frames.length === 0) return null;

  const t = lookbook?.translations?.find((x) => x.languageId === languageId);

  return (
    <section className="w-full">
      {frames.map((frame, idx) => {
        const caption = frame.translations?.find(
          (x) => x.languageId === languageId,
        )?.caption;
        return (
          <div key={idx} className="relative h-screen w-full">
            <HeroSingle
              single={frame}
              priority={priority && idx === 0}
              onHeroClick={onHeroClick}
              className="relative h-full w-full"
            />
            {caption && (
              <Text className="pointer-events-none absolute bottom-6 left-6 z-30 text-bgColor">
                {caption}
              </Text>
            )}
          </div>
        );
      })}
      {lookbook?.exploreLink && t?.exploreText && (
        <AnimatedButton
          href={internalHref(lookbook.exploreLink)}
          className="flex w-full items-center justify-center border-t border-textColor py-16"
          onClick={onHeroClick}
        >
          <Text variant="uppercase" className="underline">
            {t.exploreText}
          </Text>
        </AnimatedButton>
      )}
    </section>
  );
}
