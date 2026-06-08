import { useCallback, useSyncExternalStore } from "react";

/**
 * SSR-safe media query hook. Returns `false` during server render / prerender
 * (so it never throws and matches the first client paint), then reads the real
 * value on the client and updates on viewport changes.
 *
 * Replaces `@uidotdev/usehooks`'s `useMediaQuery`, which throws
 * "useMediaQuery is a client-only hook" during static prerendering.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = () => window.matchMedia(query).matches;
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
