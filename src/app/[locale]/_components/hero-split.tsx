"use client";

import type { common_HeroSplitWithTranslations } from "@/api/proto-http/frontend";

import { cn } from "@/lib/utils";
import { Carousel } from "@/components/ui/carousel";

import { HeroSingle } from "./hero-single";
import { ProductItem } from "./product-item";

// SPLIT hero: an editorial <HeroSingle> media pane beside product cards — a
// single centred card, a 2-up grid, or a full-bleed looping carousel for 3-4.
// `mediaLeft` picks the side; on mobile the panes stack in the same order.
// Reuses <ProductItem> so the cards match the catalog exactly.
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
  const single = products.length === 1;

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
    <div
      className={cn(
        "flex w-full items-center justify-center lg:h-screen lg:w-1/2",
        // >2 products = a full-bleed carousel (no side frames), so only pad top/
        // bottom; single and the 2-up grid keep padding on every side.
        products.length > 2 ? "py-6" : "p-6",
      )}
    >
      {single ? (
        // One product: on desktop the card grows to fill the box beside the
        // media (capped by viewport height so a tall portrait can't overflow
        // h-screen); on mobile it's a normal-sized card centred in the pane.
        // On desktop the caption is pulled out of flow (absolute, below the
        // image) so the pane centres the image itself — aligning it vertically
        // with the media box instead of sitting high above the name/price.
        <div className="w-1/2 lg:w-full lg:max-w-[65vh]">
          <ProductItem
            product={products[0]}
            className="w-full"
            imagePriority={priority}
            infoClassName="lg:absolute lg:inset-x-0 lg:top-full"
          />
        </div>
      ) : products.length > 2 ? (
        // 3-4 products: an infinite (looping) carousel, full-bleed to the pane
        // edges (no side frames), looping both ways. Same pattern as the featured
        // carousels — the embla container is a plain `flex` (NO gap, which embla
        // can't lay out since it transforms the container); the gutters come from
        // per-slide padding instead.
        <div className="w-full">
          <Carousel loop className="flex w-full">
            {products.map((p, idx) => (
              <ProductItem
                key={p.id}
                className="flex-[0_0_50%] px-3"
                product={p}
                imagePriority={priority && idx === 0}
              />
            ))}
          </Carousel>
        </div>
      ) : (
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
      )}
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
