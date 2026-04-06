import { useEffect, useState } from "react";

export function useHeaderVisibility() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;

    const handleScroll = () => {
      setTick(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;

    if (tick > lastScrollY && tick > 50) {
      setIsVisible(false);
    } else if (tick < lastScrollY) {
      setIsVisible(true);
    }

    setLastScrollY(tick);
  }, [tick, lastScrollY]);

  return { isVisible };
}
