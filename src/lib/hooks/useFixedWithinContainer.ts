import { useEffect, useState } from "react";

export type FixedWithinContainerPosition = "fixed" | "contained";

type UseFixedWithinContainerOptions = {
  container?: HTMLElement | null;
  containerId?: string;
  bottomOffset?: number;
  enabled?: boolean;
};

export function useFixedWithinContainer({
  container,
  containerId,
  bottomOffset = 24,
  enabled = true,
}: UseFixedWithinContainerOptions): FixedWithinContainerPosition {
  const [position, setPosition] =
    useState<FixedWithinContainerPosition>("fixed");

  useEffect(() => {
    if (!enabled) {
      setPosition("fixed");
      return;
    }

    const boundary =
      container ?? (containerId ? document.getElementById(containerId) : null);
    if (!boundary) return;

    let animationFrameId = 0;

    const updatePosition = () => {
      cancelAnimationFrame(animationFrameId);

      animationFrameId = requestAnimationFrame(() => {
        const { bottom } = boundary.getBoundingClientRect();
        const fixedBottomY = window.innerHeight - bottomOffset;

        setPosition(bottom >= fixedBottomY ? "fixed" : "contained");
      });
    };

    const resizeObserver = new ResizeObserver(updatePosition);

    updatePosition();
    resizeObserver.observe(boundary);
    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [bottomOffset, container, containerId, enabled]);

  return position;
}
