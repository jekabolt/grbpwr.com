import { useEffect, useRef, useState } from "react";

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
      const current = window.scrollY;
      const prev = lastScrollY.current;
      const isDown = current > prev;
      const atTop = current <= 50;
      setIsAtTop(atTop);

      if (isMobile) {
        if (isDown && current > 50) {
          setIsVisible(false);
        } else if (!isDown) {
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
