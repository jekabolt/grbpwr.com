import { useEffect, useRef, useState } from "react";

const HEADER_OFFSET = 50;
const MOBILE_SCROLL_TOLERANCE = 8;

export function useHeaderVisibility() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnnounceVisible, setIsAnnounceVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const current = Math.max(window.scrollY, 0);
      const prev = lastScrollY.current;
      const delta = current - prev;
      const isDown = delta > 0;
      const atTop = current <= HEADER_OFFSET;
      setIsAtTop(atTop);

      if (isMobile) {
        if (Math.abs(delta) < MOBILE_SCROLL_TOLERANCE) {
          lastScrollY.current = current;
          return;
        }

        if (isDown && current > HEADER_OFFSET) {
          setIsVisible(false);
        } else if (delta < 0 || atTop) {
          setIsVisible(true);
        }
        setIsAnnounceVisible(true);
      } else {
        setIsVisible(true);
        if (isDown) {
          setIsAnnounceVisible(false);
        } else if (!isDown || atTop) {
          setIsAnnounceVisible(true);
        }
      }

      lastScrollY.current = current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  return { isVisible, isAnnounceVisible, isAtTop, isMobile };
}
