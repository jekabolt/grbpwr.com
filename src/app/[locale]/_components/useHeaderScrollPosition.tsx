import { useEffect, useRef, useState } from "react";

export function useHeaderScrollPosition() {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    null,
  );
  const [isAtTop, setIsAtTop] = useState(true);
  // ref to avoid stale closure — no need to put scrollDirection in deps
  const directionRef = useRef(scrollDirection);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    let downAccumulator = 0;
    let upAccumulator = 0;
    let ticking = false;

    const hide = () => {
      if (directionRef.current !== "down") {
        directionRef.current = "down";
        setScrollDirection("down");
      }
    };

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;

      setIsAtTop(scrollY <= 0);

      // iOS pull-to-refresh overscroll: scrollY goes negative.
      // Hide immediately so the compositor can't freeze a visible
      // fixed element at the wrong position during the gesture.
      if (scrollY < 0) {
        hide();
        lastScrollY = scrollY;
        return;
      }

      if (scrollY === lastScrollY) return;

      const delta = scrollY - lastScrollY;

      if (delta > 0) {
        upAccumulator = 0;

        // First downward movement from the very top (including after
        // overscroll settles): hide with zero threshold so the header
        // is gone before iOS compositor runs its next compositing pass.
        if (lastScrollY <= 0) {
          hide();
          downAccumulator = 0;
        } else {
          downAccumulator += delta;
          if (downAccumulator >= 80) hide();
        }
      } else {
        upAccumulator += Math.abs(delta);
        downAccumulator = 0;

        if (upAccumulator >= 10 && directionRef.current !== "up") {
          directionRef.current = "up";
          setScrollDirection("up");
        }
      }

      lastScrollY = scrollY;
    };

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
  }, []);

  return { scrollDirection, isAtTop };
}
