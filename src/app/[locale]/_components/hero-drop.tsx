"use client";

import type { common_HeroDropWithTranslations } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import { useCountdown } from "@/lib/hooks/useCountdown";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { internalHref } from "@/lib/utils";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Text } from "@/components/ui/text";

import { HeroMedia } from "./hero-media";

// DROP hero: a full-screen media background with a live countdown to `releaseAt`.
// Before release it shows the tag, headline and the ticking DD/HH/MM/SS units;
// once the target passes it swaps to the explore CTA and the whole block becomes
// a link. The countdown hydrates on the client — units render as "00"
// placeholders during SSR / first paint to avoid a hydration mismatch.
export function HeroDrop({
  drop,
  priority = false,
  onHeroClick,
}: {
  drop?: common_HeroDropWithTranslations;
  priority?: boolean;
  onHeroClick?: () => void;
}) {
  const { languageId } = useTranslationsStore((state) => state);
  const tUnits = useTranslations("countdown");
  const countdown = useCountdown(drop?.releaseAt);

  if (!drop) return null;

  const t = drop.translations?.find((x) => x.languageId === languageId);
  const released = countdown?.isComplete ?? false;

  const units = [
    { key: "days", value: countdown?.days, label: tUnits("days") },
    { key: "hours", value: countdown?.hours, label: tUnits("hours") },
    { key: "minutes", value: countdown?.minutes, label: tUnits("minutes") },
    { key: "seconds", value: countdown?.seconds, label: tUnits("seconds") },
  ];

  const content = (
    <div className="relative z-20 flex flex-col items-center gap-8 p-6 text-center text-bgColor">
      {drop.tag && <Text variant="uppercase">{drop.tag}</Text>}
      {t?.headline && (
        <Text
          component="h2"
          variant="uppercase"
          className="text-textGiantSmallSize leading-tight lg:text-textGiantSize"
        >
          {t.headline}
        </Text>
      )}
      {t?.subhead && <Text variant="uppercase">{t.subhead}</Text>}

      {released ? (
        t?.exploreText && (
          <Text variant="uppercase" className="underline">
            {t.exploreText}
          </Text>
        )
      ) : (
        <div className="flex items-start gap-4 lg:gap-8">
          {units.map((u) => (
            <div key={u.key} className="flex flex-col items-center gap-1">
              <Text
                variant="uppercase"
                className="text-4xl tabular-nums leading-none lg:text-6xl"
              >
                {u.value === undefined
                  ? "00"
                  : String(u.value).padStart(2, "0")}
              </Text>
              <Text variant="uppercase" className="text-textBaseSize">
                {u.label}
              </Text>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const className =
    "relative flex min-h-screen w-full items-center justify-center";

  if (released && drop.exploreLink) {
    return (
      <AnimatedButton
        href={internalHref(drop.exploreLink)}
        className={className}
        onClick={onHeroClick}
      >
        <HeroMedia media={drop.media} priority={priority} />
        {content}
      </AnimatedButton>
    );
  }

  return (
    <div className={className}>
      <HeroMedia media={drop.media} priority={priority} />
      {content}
    </div>
  );
}
