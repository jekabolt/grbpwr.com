import { useEffect, useState } from "react";

const LG_MIN_WIDTH = 1024;

/**
 * lg+: right column matches left column height (left is measured; right scrolls inside).
 */
export function useOrderReviewRightColHeight(
  leftColEl: HTMLElement | null,
): number | undefined {
  const [heightPx, setHeightPx] = useState<number | undefined>();

  useEffect(() => {
    if (!leftColEl) {
      setHeightPx(undefined);
      return;
    }

    const mq = window.matchMedia(`(min-width: ${LG_MIN_WIDTH}px)`);

    const measure = () => {
      if (!mq.matches) {
        setHeightPx(undefined);
        return;
      }
      setHeightPx(Math.round(leftColEl.getBoundingClientRect().height));
    };

    const ro = new ResizeObserver(measure);
    ro.observe(leftColEl);
    mq.addEventListener("change", measure);
    measure();

    return () => {
      ro.disconnect();
      mq.removeEventListener("change", measure);
    };
  }, [leftColEl]);

  return heightPx;
}
