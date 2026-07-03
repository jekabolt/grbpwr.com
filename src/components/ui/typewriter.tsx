"use client";

import { useEffect, useState } from "react";

import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

// Human-ish per-character typing cadence (ms): a jittery base, occasional
// hesitations, and a longer beat after spaces/punctuation. Erasing is quicker and
// steadier, like holding backspace.
function typeDelay(justTyped: string): number {
  let d = 65 + Math.random() * 120;
  if (Math.random() < 0.12) d += 220 + Math.random() * 320;
  if (/[\s,.;:!?—-]/.test(justTyped)) d += 120 + Math.random() * 200;
  return d;
}

function eraseDelay(): number {
  return 30 + Math.random() * 35;
}

// <Typewriter>: types `text` out character by character with an uneven, human
// cadence, holds the finished line for `holdMs` while a solid block caret blinks,
// erases it, pauses, and loops. The caret is steady while typing/erasing and
// blinks only while idle (holding / paused). Honours prefers-reduced-motion by
// rendering the full text with a static caret. The full text is always present
// for screen readers; the animated glyphs are aria-hidden.
export function Typewriter({
  text,
  holdMs = 2500,
  pauseMs = 700,
  className,
  caretClassName,
}: {
  text: string;
  holdMs?: number;
  pauseMs?: number;
  className?: string;
  caretClassName?: string;
}) {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [displayed, setDisplayed] = useState("");
  const [idle, setIdle] = useState(true);

  useEffect(() => {
    if (reducedMotion || !text) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let i = 0;

    const type = () => {
      if (cancelled) return;
      setIdle(false);
      i++;
      setDisplayed(text.slice(0, i));
      if (i < text.length) {
        timer = setTimeout(type, typeDelay(text[i - 1]));
      } else {
        setIdle(true); // hold the finished line — caret blinks
        timer = setTimeout(erase, holdMs);
      }
    };

    const erase = () => {
      if (cancelled) return;
      setIdle(false);
      i--;
      setDisplayed(text.slice(0, Math.max(i, 0)));
      if (i > 0) {
        timer = setTimeout(erase, eraseDelay());
      } else {
        setIdle(true); // empty pause — caret blinks
        timer = setTimeout(() => {
          i = 0;
          type();
        }, pauseMs);
      }
    };

    // Start from an empty line with a blinking caret, then begin typing.
    setDisplayed("");
    setIdle(true);
    timer = setTimeout(type, pauseMs);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [text, holdMs, pauseMs, reducedMotion]);

  const shown = reducedMotion ? text : displayed;
  const blink = !reducedMotion && idle;

  return (
    <span className={cn("whitespace-pre", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{shown}</span>
      <span
        aria-hidden="true"
        className={cn(
          "ml-px inline-block h-[1.15em] w-[0.6ch] translate-y-[0.15em] bg-textColor",
          blink && "animate-caret-blink",
          caretClassName,
        )}
      />
    </span>
  );
}
