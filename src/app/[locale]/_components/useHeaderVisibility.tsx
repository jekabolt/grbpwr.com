import { useEffect, useRef, useState } from "react";

import { useHeaderScrollPosition } from "./useHeaderScrollPosition";

export function useHeaderVisibility() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isAnnounceVisible, setIsAnnounceVisible] = useState(true);
  const { scrollDirection, isAtTop } = useHeaderScrollPosition();
  const showTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    clearTimeout(showTimerRef.current);

    if (!isMobile) {
      setIsVisible(true);
      return;
    }

    if (scrollDirection === "down") {
      setIsVisible(false);
      return;
    }

    if (scrollDirection === "up" || isAtTop) {
      showTimerRef.current = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(showTimerRef.current);
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
