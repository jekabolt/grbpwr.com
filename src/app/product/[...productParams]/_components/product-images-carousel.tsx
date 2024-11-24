"use client";

import { common_MediaFull } from "@/api/proto-http/frontend";
import useEmblaCarousel from "embla-carousel-react";

import { cn } from "@/lib/utils";
import { ProductMediaItem } from "@/components/images-carousel/ProductMediaItem";

export function ProductImagesCarousel({ productMedia, className }: Props) {
  const [emblaRef] = useEmblaCarousel();

  return (
    <div className={cn("relative overflow-hidden", className)} ref={emblaRef}>
      <div className="flex h-full">
        {productMedia.map((m) => (
          <div key={m.id} className="min-w-[70%]">
            <ProductMediaItem singleMedia={m} />
          </div>
        ))}
      </div>
    </div>
  );
}

type Props = {
  className?: string;
  productMedia: common_MediaFull[];
};
