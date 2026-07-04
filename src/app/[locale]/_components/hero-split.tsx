"use client";

import type { common_HeroSplitWithTranslations } from "@/api/proto-http/frontend";

import { HeroSingle } from "./hero-single";
import { ProductItem } from "./product-item";

// SPLIT hero: an editorial <HeroSingle> media pane beside a small grid of 2-4
// products. `mediaLeft` picks the side; on mobile the panes stack in the same
// order. Reuses <ProductItem> so the cards match the catalog exactly.
export function HeroSplit({
  split,
  priority = false,
  onHeroClick,
}: {
  split?: common_HeroSplitWithTranslations;
  priority?: boolean;
  onHeroClick?: () => void;
}) {
  const products = split?.products ?? [];
  if (!split?.media && products.length === 0) return null;

  const mediaLeft = split?.mediaLeft ?? true;

  const mediaPane = (
    <div className="relative h-[70vh] w-full lg:h-screen lg:w-1/2">
      <HeroSingle
        single={split?.media}
        priority={priority}
        onHeroClick={onHeroClick}
        className="relative h-full w-full"
      />
    </div>
  );

  const productsPane = (
    <div className="flex w-full items-center justify-center p-6 lg:h-screen lg:w-1/2">
      <div className="grid w-full grid-cols-2 gap-6">
        {products.map((p, idx) => (
          <ProductItem
            key={p.id}
            product={p}
            className="w-full"
            imagePriority={priority && idx === 0}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row">
      {mediaLeft ? (
        <>
          {mediaPane}
          {productsPane}
        </>
      ) : (
        <>
          {productsPane}
          {mediaPane}
        </>
      )}
    </div>
  );
}
