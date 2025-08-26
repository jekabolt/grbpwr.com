import { useEffect, useState } from "react";

export function useHeaderScrollPosition() {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    null,
  );
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    let downAccumulator = 0;
    let upAccumulator = 0;

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;

      setIsAtTop(scrollY === 0);

      if (scrollY === lastScrollY) return;

      const delta = scrollY - lastScrollY;

      if (delta > 0) {
        downAccumulator += delta;
        upAccumulator = 0;

        if (downAccumulator >= 250 && scrollDirection !== "down") {
          setScrollDirection("down");
        }
      } else {
        upAccumulator += Math.abs(delta);
        downAccumulator = 0;

        if (upAccumulator >= 10 && scrollDirection !== "up") {
          setScrollDirection("up");
        }
      }

      lastScrollY = scrollY;
    };

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScrollDirection();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateScrollDirection();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollDirection]);

  return { scrollDirection, isAtTop };
}
