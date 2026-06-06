"use client";

import { useInView } from "react-intersection-observer";

// The art.grbpwr.com logo is a footer decoration that pulls ~350 KiB of JS +
// image from a separate origin. The browser's native iframe lazy-loading still
// fetches it on short pages, so gate it behind an explicit IntersectionObserver:
// the iframe only mounts once the footer is ~300px from the viewport, keeping it
// off the initial LCP critical path. Mobile only (desktop uses a static SVG).
export function LazyArtIframe({ theme }: { theme?: "light" | "dark" }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "300px 0px",
  });

  const src =
    theme === "dark" ? "https://art.grbpwr.com/invert" : "https://art.grbpwr.com";

  return (
    <div ref={ref} className="h-56 w-56 lg:hidden">
      {inView && (
        <iframe
          src={src}
          loading="lazy"
          className="h-full w-full border-0"
          title="logo"
        />
      )}
    </div>
  );
}
