"use client";

import type { common_HeroDropWithTranslations } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import { useCountdown } from "@/lib/hooks/useCountdown";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn, internalHref } from "@/lib/utils";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Text } from "@/components/ui/text";

import { HeroMedia } from "./hero-media";

// DROP hero: a live countdown to `releaseAt` over an optional media background.
// Before release it shows the tag, headline and the ticking DD/HH/MM/SS units in
// hairline boxes; once the target passes it swaps to the explore CTA and the whole
// block becomes a link. Copy + box borders use currentColor and flip light over
// media / dark on a plain background, so the block is legible either way. The
// countdown hydrates on the client — units render as "00" during SSR to avoid a
// hydration mismatch.
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
    // text-bgColor + mix-blend-exclusion auto-inverts the copy against whatever is
    // behind it (plain background, dark or light media) — the same technique the
    // header uses — so it stays legible without a hasMedia colour flip.
    <div className="relative z-20 flex flex-col items-center gap-8 p-6 text-center text-bgColor mix-blend-exclusion">
      {drop.tag && <Text variant="uppercase">{drop.tag}</Text>}
      {t?.headline && (
        <Text component="h2" variant="uppercase">
          {t.headline}
        </Text>
      )}
      {t?.subhead && <Text variant="uppercase">{t.subhead}</Text>}

      {!released && (
        <div className="flex gap-8 tabular-nums lg:gap-12">
          {units.map((u) => (
            <div key={u.key} className="flex flex-col items-center gap-1">
              <Text variant="uppercase">
                {u.value === undefined
                  ? "00"
                  : String(u.value).padStart(2, "0")}
              </Text>
              <Text variant="uppercase" className="opacity-60">
                {u.label}
              </Text>
            </div>
          ))}
        </div>
      )}

      {t?.exploreText && (
        <Text variant="uppercase" className="group-hover:underline">
          {`[ ${t.exploreText} ]`}
        </Text>
      )}
    </div>
  );

  const className =
    "relative flex min-h-screen w-full items-center justify-center";

  if (drop.exploreLink) {
    return (
      <AnimatedButton
        href={internalHref(drop.exploreLink)}
        className={cn("group", className)}
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
