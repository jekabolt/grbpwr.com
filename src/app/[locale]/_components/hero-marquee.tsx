"use client";

import type { common_HeroMarqueeWithTranslations } from "@/api/proto-http/frontend";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { internalHref } from "@/lib/utils";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Text } from "@/components/ui/text";
import { Typewriter } from "@/components/ui/typewriter";

// Hold the finished line for `speed` seconds (the editor-specified freeze time)
// before it erases; clamped so it never sticks too briefly or too long.
const DEFAULT_HOLD_S = 3;
const MIN_HOLD_S = 1;
const MAX_HOLD_S = 10;

// MARQUEE hero: a thin, full-width announcement bar (sale, delivery, drop live)
// rendered as a typewriter — the line types itself out with a human, uneven
// cadence, holds while a black block caret blinks, erases, pauses and loops. Copy
// is the current language's `headline`; an optional `link` makes the bar
// clickable.
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

  const holdMs =
    Math.min(
      Math.max(marquee.speed || DEFAULT_HOLD_S, MIN_HOLD_S),
      MAX_HOLD_S,
    ) * 1000;

  const bar = (
    <div className="w-full overflow-hidden border-y border-textColor bg-bgColor px-6 py-2">
      <Text variant="uppercase" component="div">
        <Typewriter text={text} prefix="> " holdMs={holdMs} />
      </Text>
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
