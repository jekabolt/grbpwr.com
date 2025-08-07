"use client";

import { useState } from "react";
import type { common_ArchiveList } from "@/api/proto-http/frontend";

import { cn } from "@/lib/utils";
import { Carousel } from "@/components/ui/carousel";

import { FullSizeItem } from "./full-size-item";

interface CarouselProps {
  archives: common_ArchiveList[];
}

export function VerticalCarousel({ archives }: CarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  return (
    <div className="relative">
      <Carousel
        axis="y"
        align="center"
        className="flex h-screen flex-col gap-20 lg:gap-0"
        enablePageScroll
        setSelectedIndex={setSelectedIndex}
      >
        {archives.map((archive, index) => (
          <div key={index} className="px-14 lg:px-7">
            <FullSizeItem
              archive={archive}
              className={cn(
                "h-full w-44 scale-95 opacity-50 transition-all duration-300 ease-in-out lg:flex-[0_0_25%]",
                {
                  "w-60 scale-100 opacity-100 lg:flex-[0_0_35%]":
                    index === selectedIndex,
                },
              )}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}
