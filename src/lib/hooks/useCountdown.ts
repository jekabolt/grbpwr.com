import { useEffect, useState } from "react";

export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
};

/**
 * Live countdown to an RFC 3339 timestamp. Returns `null` until mounted so the
 * server render and the first client paint agree — the target is parsed
 * deterministically and only the per-second tick reads the wall clock. Once
 * mounted it recomputes every second and reports `isComplete` when the target
 * has passed (or immediately, for an already-elapsed target).
 */
export function useCountdown(releaseAt?: string): Countdown | null {
  const target = releaseAt ? new Date(releaseAt).getTime() : NaN;
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (Number.isNaN(target)) return;
    const tick = () => setRemaining(Math.max(0, target - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (remaining === null || Number.isNaN(target)) return null;

  const totalSeconds = Math.floor(remaining / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isComplete: remaining <= 0,
  };
}
