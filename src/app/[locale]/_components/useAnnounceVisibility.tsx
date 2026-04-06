import { useEffect, useState } from "react";

import { useHeaderScrollPosition } from "./useHeaderScrollPosition";

export function useAnnounceVisibility() {
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { scrollDirection, isAtTop } = useHeaderScrollPosition();

  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsVisible(true);
    } else {
      if (scrollDirection === "down") {
        setIsVisible(false);
      } else if (scrollDirection === "up" || isAtTop) {
        setIsVisible(true);
      }
    }
  }, [scrollDirection, isAtTop, isMobile]);

  return { isVisible };
}
