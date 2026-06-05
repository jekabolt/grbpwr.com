import { useEffect, useState } from "react";

export function useVisualViewportHeight(
  enabled: boolean,
  offsetPx = 16,
): number | undefined {
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!enabled) {
      setHeight(undefined);
      return;
    }

    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      setHeight(Math.max(0, Math.round(vv.height - offsetPx)));
    };

    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);

    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, [enabled, offsetPx]);

  return height;
}
