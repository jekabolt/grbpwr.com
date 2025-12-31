import { useEffect, useState } from "react";

import { useHeaderScrollPosition } from "./useHeaderScrollPosition";

export function useHeaderVisibility() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isAnnounceVisible, setIsAnnounceVisible] = useState(true);
  const { scrollDirection, isAtTop } = useHeaderScrollPosition();

  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      if (scrollDirection === "down") {
        setIsVisible(false);
      } else if (scrollDirection === "up" || isAtTop) {
        setIsVisible(true);
      }
    } else {
      setIsVisible(true);
    }
  }, [scrollDirection, isAtTop, isMobile]);

  useEffect(() => {
    if (isMobile) {
      setIsAnnounceVisible(true);
    } else {
      if (scrollDirection === "down") {
        setIsAnnounceVisible(false);
      } else if (scrollDirection === "up" || isAtTop) {
        setIsAnnounceVisible(true);
      }
    }
  }, [scrollDirection, isAtTop, isMobile]);

  return {
    isVisible,
    isMobile,
    isAnnounceVisible,
    scrollDirection,
    isAtTop,
  };
}
