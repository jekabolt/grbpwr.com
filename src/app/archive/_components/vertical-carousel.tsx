"use client";

import { useEffect, useRef, useState } from "react";
import type { common_ArchiveFull } from "@/api/proto-http/frontend";

import { FullSizeItem } from "./full-size-item";

interface CarouselProps {
  archives: common_ArchiveFull[];
}

export function VerticalCarousel({ archives }: CarouselProps) {
  const [selectedArchive, setSelectedArchive] = useState<number | null>(null);
  const [highlightedArchive, setHighlightedArchive] = useState<number | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.top + containerRect.height / 2;

      let closestItem: HTMLElement | null = null;
      let closestDistance = Infinity;

      container.querySelectorAll(".archive-item").forEach((item) => {
        const itemElement = item as HTMLElement;
        const itemRect = itemElement.getBoundingClientRect();
        const itemCenter = itemRect.top + itemRect.height / 2;
        const distance = Math.abs(containerCenter - itemCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestItem = itemElement;
        }
      });

      if (closestItem) {
        // @ts-ignore
        const archiveId = Number(closestItem.getAttribute("data-archive-id"));
        setHighlightedArchive(archiveId);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [archives]);

  useEffect(() => {
    if (highlightedArchive && containerRef.current) {
      const highlightedElement = containerRef.current.querySelector(
        `[data-archive-id="${highlightedArchive}"]`,
      ) as HTMLElement;

      if (highlightedElement) {
        const container = containerRef.current;
        const containerHeight = container.clientHeight;
        const elementHeight = highlightedElement.offsetHeight;
        const topOffset = (containerHeight - elementHeight) / 2;
        const elementTop = highlightedElement.offsetTop;
        const scrollPosition = elementTop - topOffset;

        container.scrollTo({
          top: scrollPosition,
          behavior: "smooth",
        });
      }
    }
  }, [highlightedArchive]);

  return (
    <div
      className="relative h-screen overflow-auto scroll-smooth"
      ref={containerRef}
    >
      {archives.map((archive, index) => {
        const isHighlighted = archive.id === highlightedArchive;

        return (
          <div
            key={index}
            data-archive-id={archive.id}
            className={`archive-item relative px-14 transition-transform duration-300 ease-in-out lg:px-7 ${
              isHighlighted ? "scale-100" : "scale-95 opacity-30"
            }`}
            onClick={() =>
              isHighlighted && setSelectedArchive(archive.id || null)
            }
          >
            <FullSizeItem
              archive={archive}
              className={`w-full transition-all duration-300 ease-in-out lg:w-[34rem] ${
                !isHighlighted ? "lg:w-96" : ""
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}
