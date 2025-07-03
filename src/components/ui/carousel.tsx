"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";

type CarouselProps = {
  className?: string;
  children: React.ReactNode;
  loop?: boolean | { mobile: boolean; desktop: boolean };
  disabled?: boolean | { mobile: boolean; desktop: boolean };
  align?:
    | "start"
    | "center"
    | "end"
    | {
        mobile: "start" | "center" | "end";
        desktop: "start" | "center" | "end";
      };
};

export function Carousel({
  className,
  children,
  loop = false,
  disabled = false,
  align = "start",
}: CarouselProps) {
  const isDesktop = useIsDesktop();

  const shouldDisable =
    typeof disabled === "object"
      ? isDesktop
        ? disabled.desktop
        : disabled.mobile
      : disabled;

  const shouldLoop =
    typeof loop === "object" ? (isDesktop ? loop.desktop : loop.mobile) : loop;

  const shouldAlign =
    typeof align === "object"
      ? isDesktop
        ? align.desktop
        : align.mobile
      : align;

  const [emblaRef] = useEmblaCarousel(
    shouldDisable
      ? undefined
      : {
          loop: shouldLoop,
          dragFree: true,
          align: shouldAlign,
        },
    shouldDisable ? [] : [WheelGesturesPlugin()],
  );

  return (
    <div className="overflow-hidden" ref={shouldDisable ? undefined : emblaRef}>
      <div className={className}>{children}</div>
    </div>
  );
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIsDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);
    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  return isDesktop;
}
