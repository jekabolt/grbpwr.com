"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { common_HeroSlideshowWithTranslations } from "@/api/proto-http/frontend";
import useEmblaCarousel from "embla-carousel-react";

import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

import { HeroSingle } from "./hero-single";

// Autoplay cadence: fall back to 5s, and never faster than 2s so copy stays
// readable even if the backend sends an aggressive interval.
const DEFAULT_INTERVAL_MS = 5000;
const MIN_INTERVAL_MS = 2000;

// SLIDESHOW hero: a looping carousel of full-bleed <HeroSingle> slides with
// autoplay driven by `intervalMs`. Autoplay is suppressed under
// prefers-reduced-motion and paused on hover/focus; slides advance manually via
// the square page dots. A single slide degrades to a plain <HeroSingle>.
export function HeroSlideshow({
  slideshow,
  priority = false,
  onHeroClick,
}: {
  slideshow?: common_HeroSlideshowWithTranslations;
  priority?: boolean;
  onHeroClick?: () => void;
}) {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const slides = slideshow?.slides ?? [];
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isPaused = useRef(false);

  const interval = Math.max(
    slideshow?.intervalMs || DEFAULT_INTERVAL_MS,
    MIN_INTERVAL_MS,
  );

  const onSelect = useCallback(() => {
    if (emblaApi) setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || reducedMotion || slides.length < 2) return;
    const id = setInterval(() => {
      if (!isPaused.current) emblaApi.scrollNext();
    }, interval);
    return () => clearInterval(id);
  }, [emblaApi, reducedMotion, slides.length, interval]);

  if (slides.length === 0) return null;
  if (slides.length === 1) {
    return (
      <HeroSingle
        single={slides[0]}
        priority={priority}
        onHeroClick={onHeroClick}
      />
    );
  }

  return (
    <section
      className="relative h-screen w-full"
      aria-roledescription="carousel"
      onMouseEnter={() => (isPaused.current = true)}
      onMouseLeave={() => (isPaused.current = false)}
      onFocusCapture={() => (isPaused.current = true)}
      onBlurCapture={() => (isPaused.current = false)}
    >
      <div ref={emblaRef} className="h-full overflow-hidden">
        <div className="flex h-full">
          {slides.map((slide, idx) => (
            <HeroSingle
              key={idx}
              single={slide}
              priority={priority && idx === 0}
              onHeroClick={onHeroClick}
              className="relative h-full w-full flex-[0_0_100%]"
            />
          ))}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-6 z-30 flex justify-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Go to slide ${idx + 1}`}
            aria-current={idx === selectedIndex}
            onClick={() => emblaApi?.scrollTo(idx)}
            className="flex h-8 w-8 items-center justify-center"
          >
            <span
              className={cn(
                "h-2 w-2 border border-bgColor",
                idx === selectedIndex ? "bg-bgColor" : "bg-transparent",
              )}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
