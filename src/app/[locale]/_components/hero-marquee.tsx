"use client";

import type { common_HeroMarqueeWithTranslations } from "@/api/proto-http/frontend";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { internalHref } from "@/lib/utils";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Marquee } from "@/components/ui/marquee";
import { Text } from "@/components/ui/text";

// How many times the headline repeats inside one marquee copy — enough to fill a
// wide viewport for typical announcement phrases so the loop reads as continuous.
const REPEAT = 6;

// MARQUEE hero: a thin, full-width scrolling announcement bar (sale, delivery, drop
// live). Copy is the current language's `headline`; an optional `link` makes the
// whole bar clickable. Translations-only, no media — matches the brutalist bar.
export function HeroMarquee({
  marquee,
  onHeroClick,
}: {
  marquee?: common_HeroMarqueeWithTranslations;
  onHeroClick?: () => void;
}) {
  const { languageId } = useTranslationsStore((state) => state);

  const translation = marquee?.translations?.find(
    (t) => t.languageId === languageId,
  );
  const text = translation?.headline;
  if (!marquee || !text) return null;

  const items = Array.from({ length: REPEAT }, (_, idx) => (
    <Text key={idx} variant="uppercase" className="whitespace-nowrap px-6">
      {text}
    </Text>
  ));

  const bar = (
    <div className="w-full border-y border-textColor bg-bgColor py-2">
      <Marquee speed={marquee.speed}>{items}</Marquee>
    </div>
  );

  if (marquee.link) {
    return (
      <AnimatedButton
        href={internalHref(marquee.link)}
        className="block w-full"
        onClick={onHeroClick}
      >
        {bar}
      </AnimatedButton>
    );
  }
  return bar;
}
