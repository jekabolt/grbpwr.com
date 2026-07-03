"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

// Measure before paint on the client so each new character lands already scrolled;
// fall back to useEffect during SSR to avoid the warning.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Human-ish per-character typing cadence (ms): a brisk-but-not-instant base
// (~60-150ms, roughly a confident human pace), with mild jitter, the occasional
// brief hesitation, and a small beat after spaces/punctuation.
function typeDelay(justTyped: string): number {
  let d = 60 + Math.random() * 90;
  if (Math.random() < 0.08) d += 150 + Math.random() * 180;
  if (/[\s,.;:!?—-]/.test(justTyped)) d += 80 + Math.random() * 120;
  return d;
}

// "Hold backspace" erase: once the finished line has held, the first character
// deletes, then OS-style key-repeat kicks in — a short initial delay followed by a
// steady, rapid, jitter-free rate until the typed text is gone.
const BACKSPACE_HOLD_DELAY_MS = 400;
const BACKSPACE_REPEAT_MS = 45;

// <Typewriter>: a terminal-style loop — sit at the `prefix` (e.g. "> ") with the
// caret blinking a couple of times, type `text` out with a human cadence, hold the
// finished line for `holdMs`, erase it as if holding backspace, then loop. The
// line is centred while it fits and, once it outgrows the container, anchors left
// and scrolls to keep the caret in view (native scroll, so it can never be pushed
// off screen). The caret blinks continuously. The full text is always present for
// screen readers; the animated glyphs are aria-hidden.
//
// NOTE: this animation runs unconditionally (it does not pause under
// prefers-reduced-motion) because it is a core brand element of the marquee.
export function Typewriter({
  text,
  prefix = "",
  holdMs = 2500,
  pauseMs = 2000,
  className,
  caretClassName,
}: {
  text: string;
  // A static, always-visible prefix rendered before the typed text (e.g. a
  // terminal prompt "> "). It never animates and is excluded from the
  // screen-reader text.
  prefix?: string;
  holdMs?: number;
  // The blink-a-couple-of-times beat at "> " before typing and between loops.
  pauseMs?: number;
  className?: string;
  caretClassName?: string;
}) {
  const [displayed, setDisplayed] = useState("");
  const [overflowing, setOverflowing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!text) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let i = 0;

    const type = () => {
      if (cancelled) return;
      i++;
      setDisplayed(text.slice(0, i));
      if (i < text.length) {
        timer = setTimeout(type, typeDelay(text[i - 1]));
      } else {
        timer = setTimeout(() => erase(true), holdMs); // hold, then backspace
      }
    };

    const erase = (first: boolean) => {
      if (cancelled) return;
      i--;
      setDisplayed(text.slice(0, Math.max(i, 0)));
      if (i > 0) {
        timer = setTimeout(
          () => erase(false),
          first ? BACKSPACE_HOLD_DELAY_MS : BACKSPACE_REPEAT_MS,
        );
      } else {
        // Back to "> " with the caret blinking a couple of times, then retype.
        timer = setTimeout(() => {
          i = 0;
          type();
        }, pauseMs);
      }
    };

    // Start at "> " with the caret blinking a couple of times, then type.
    setDisplayed("");
    timer = setTimeout(type, pauseMs);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [text, holdMs, pauseMs]);

  // Centre while the line fits; left-anchor once it overflows.
  useIsomorphicLayoutEffect(() => {
    const c = containerRef.current;
    if (c) setOverflowing(c.scrollWidth > c.clientWidth + 1);
  }, [displayed, prefix]);

  // Once overflowing, scroll to the end so the caret stays visible.
  useIsomorphicLayoutEffect(() => {
    const c = containerRef.current;
    if (c && overflowing) c.scrollLeft = c.scrollWidth;
  }, [overflowing, displayed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex overflow-x-hidden",
        overflowing ? "justify-start" : "justify-center",
        className,
      )}
    >
      <span className="shrink-0 whitespace-pre">
        <span className="sr-only">{text}</span>
        <span aria-hidden="true">{`${prefix}${displayed}`}</span>
        <span
          aria-hidden="true"
          className={cn(
            // Black block caret with a fixed 1:2 (w:h) aspect; blinks continuously.
            // The blink lives in globals.css so it does not depend on a Tailwind
            // rebuild.
            "caret-blink ml-px inline-block h-[1.1em] w-[0.55em] translate-y-[0.15em] bg-textColor",
            caretClassName,
          )}
        />
      </span>
    </div>
  );
}
