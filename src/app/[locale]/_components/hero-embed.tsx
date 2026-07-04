"use client";

import { useState } from "react";
import type { common_HeroEmbedWithTranslations } from "@/api/proto-http/frontend";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn, internalHref } from "@/lib/utils";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Text } from "@/components/ui/text";

import { HeroMedia } from "./hero-media";

// EMBED hero: a full-viewport third-party iframe (Spline/3D/campaign) layered
// over the block's fallback media, with copy/CTA in a solid bottom bar so it
// stays legible over any embed and leaves the rest of the frame interactive. The
// iframe starts hidden and reveals on load, so a CSP-blocked or failed embed
// degrades to the fallback media automatically. Its origin must be allowlisted in
// the CSP `frame-src` (see next.config.ts) — otherwise it never reveals.
export function HeroEmbed({
  embed,
  priority = false,
  onHeroClick,
}: {
  embed?: common_HeroEmbedWithTranslations;
  priority?: boolean;
  onHeroClick?: () => void;
}) {
  const { languageId } = useTranslationsStore((state) => state);
  const [loaded, setLoaded] = useState(false);

  if (!embed) return null;

  const t =
    embed.translations?.find((x) => x.languageId === languageId) ||
    embed.translations?.[0];
  const headline = t?.headline;
  const ctaText = t?.ctaText;

  const barContent = (headline || ctaText) && (
    <div className="flex flex-col items-center gap-1 text-center">
      {headline && (
        <Text component="h2" variant="uppercase">
          {headline}
        </Text>
      )}
      {ctaText && (
        <Text variant="uppercase" className="underline">
          {ctaText}
        </Text>
      )}
    </div>
  );

  const barClassName =
    "absolute inset-x-0 bottom-0 z-30 flex justify-center border-t border-textColor bg-bgColor py-4 text-textColor";

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Fallback media behind — shown until (or unless) the embed reveals. */}
      <HeroMedia media={embed.fallback} priority={priority} />

      {embed.embedUrl && (
        <iframe
          src={embed.embedUrl}
          title={headline || "GRBPWR"}
          loading={priority ? "eager" : "lazy"}
          onLoad={() => setLoaded(true)}
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture; xr-spatial-tracking; accelerometer; gyroscope"
          sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
          className={cn(
            "absolute inset-0 z-10 h-full w-full border-0 transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      )}

      {barContent &&
        (embed.ctaLink ? (
          <AnimatedButton
            href={internalHref(embed.ctaLink)}
            onClick={onHeroClick}
            className={barClassName}
          >
            {barContent}
          </AnimatedButton>
        ) : (
          <div className={barClassName}>{barContent}</div>
        ))}
    </div>
  );
}
