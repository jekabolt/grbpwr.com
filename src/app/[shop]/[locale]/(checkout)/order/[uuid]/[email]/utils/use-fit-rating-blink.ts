import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_DURATION_MS = 400;

export function useFitRatingBlink(durationMs = DEFAULT_DURATION_MS) {
  const [fitBlinkingIndices, setFitBlinkingIndices] = useState<number[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current != null) {
        clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  const triggerFitBlink = useCallback(
    (indices: number[]) => {
      if (timeoutRef.current != null) {
        clearTimeout(timeoutRef.current);
      }
      setFitBlinkingIndices(indices);
      timeoutRef.current = setTimeout(() => {
        setFitBlinkingIndices([]);
        timeoutRef.current = null;
      }, durationMs);
    },
    [durationMs],
  );

  return { fitBlinkingIndices, triggerFitBlink };
}
