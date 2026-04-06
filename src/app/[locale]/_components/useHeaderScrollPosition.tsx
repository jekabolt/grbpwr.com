import { useEffect, useRef, useState } from "react";

export function useHeaderScrollPosition() {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    null,
  );
  const [isAtTop, setIsAtTop] = useState(true);

  const scrollDirectionRef = useRef<"up" | "down" | null>(null);
  const lastScrollYRef = useRef(0);
  const downAccumulatorRef = useRef(0);
  const upAccumulatorRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const atTop = scrollY <= 1;
      setIsAtTop(atTop);

      const lastScrollY = lastScrollYRef.current;
      if (scrollY === lastScrollY) return;

      const delta = scrollY - lastScrollY;
      lastScrollYRef.current = scrollY;

      const dir = scrollDirectionRef.current;

      if (delta > 0) {
        downAccumulatorRef.current += delta;
        upAccumulatorRef.current = 0;
        if (downAccumulatorRef.current >= 250 && dir !== "down") {
          scrollDirectionRef.current = "down";
          setScrollDirection("down");
        }
      } else {
        upAccumulatorRef.current += Math.abs(delta);
        downAccumulatorRef.current = 0;
        if (upAccumulatorRef.current >= 60 && dir !== "up") {
          scrollDirectionRef.current = "up";
          setScrollDirection("up");
        }
      }
    };

    const handleScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
        requestAnimationFrame(() => {
          updateScrollDirection();
          tickingRef.current = false;
        });
      }
    };

    lastScrollYRef.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });
    updateScrollDirection();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return { scrollDirection, isAtTop };
}
