"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";

type ResponsiveValue<T> = T | { mobile: T; desktop: T };

type CarouselProps = {
  className?: string;
  children: React.ReactNode;
  loop?: ResponsiveValue<boolean>;
  disabled?: ResponsiveValue<boolean>;
  align?: ResponsiveValue<"start" | "center" | "end">;
};

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
};

const resolveResponsive = <T,>(
  value: ResponsiveValue<T>,
  isDesktop: boolean,
): T =>
  value && typeof value === "object" && "mobile" in value && "desktop" in value
    ? isDesktop
      ? value.desktop
      : value.mobile
    : (value as T);

export function Carousel({
  className,
  children,
  loop = false,
  disabled = false,
  align = "start",
}: CarouselProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const isDisabled = resolveResponsive(disabled, isDesktop);
  const shouldLoop = resolveResponsive(loop, isDesktop);
  const alignValue = resolveResponsive(align, isDesktop);

  const [emblaRef] = useEmblaCarousel(
    isDisabled
      ? undefined
      : { loop: shouldLoop, dragFree: true, align: alignValue },
    isDisabled ? [] : [WheelGesturesPlugin()],
  );

  return (
    <div className="overflow-hidden" ref={isDisabled ? undefined : emblaRef}>
      <div className={className}>{children}</div>
    </div>
  );
}
