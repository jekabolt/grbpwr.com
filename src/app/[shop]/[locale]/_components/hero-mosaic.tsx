"use client";

import type { CSSProperties } from "react";
import type { common_HeroMosaicWithTranslations } from "@/api/proto-http/frontend";

import { HeroSingle } from "./hero-single";

const DEFAULT_COLUMNS = 3;

// MOSAIC hero: a responsive grid of square <HeroSingle> tiles. `columns` sets the
// desktop track count (mobile always collapses to 2); DOUBLE/TRIPLE mosaics are
// just columns=2/3. Hairline separators come from a 1px grid gap over a textColor
// background plus a hairline outer border — no cards, no shadows.
export function HeroMosaic({
  mosaic,
  priority = false,
  onHeroClick,
}: {
  mosaic?: common_HeroMosaicWithTranslations;
  priority?: boolean;
  onHeroClick?: () => void;
}) {
  const tiles = mosaic?.tiles ?? [];
  if (tiles.length === 0) return null;

  const columns = Math.max(mosaic?.columns || DEFAULT_COLUMNS, 1);

  return (
    <div
      className="grid grid-cols-2 gap-px border border-textColor bg-textColor lg:grid-cols-[repeat(var(--mosaic-cols),minmax(0,1fr))]"
      style={{ "--mosaic-cols": String(columns) } as CSSProperties}
    >
      {tiles.map((tile, idx) => (
        <HeroSingle
          key={idx}
          single={tile}
          priority={priority && idx === 0}
          onHeroClick={onHeroClick}
          fit="cover"
          responsive={false}
          className="relative aspect-square w-full bg-bgColor"
        />
      ))}
    </div>
  );
}
