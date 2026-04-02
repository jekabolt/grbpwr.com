"use client";

import {
  useLayoutEffect,
  useMemo,
  useRef,
  type RefCallback,
  type RefObject,
} from "react";

function rowRefCallbackForIndex(
  elementsRef: RefObject<Map<number, HTMLDivElement>>,
  lineItemIndex: number,
): RefCallback<HTMLDivElement> {
  return (el) => {
    if (el) elementsRef.current.set(lineItemIndex, el);
    else elementsRef.current.delete(lineItemIndex);
  };
}

export function useOrderReviewItemRowScroll(
  orderItemReviewRows: readonly { lineItemIndex: number }[],
  fitBlinkingIndices: readonly number[],
) {
  const mobileRowEls = useRef<Map<number, HTMLDivElement>>(new Map());
  const desktopRowEls = useRef<Map<number, HTMLDivElement>>(new Map());

  const { mobileRowRefByIndex, desktopRowRefByIndex } = useMemo(() => {
    const mobile = new Map<number, RefCallback<HTMLDivElement>>();
    const desktop = new Map<number, RefCallback<HTMLDivElement>>();
    for (const row of orderItemReviewRows) {
      const idx = row.lineItemIndex;
      mobile.set(idx, rowRefCallbackForIndex(mobileRowEls, idx));
      desktop.set(idx, rowRefCallbackForIndex(desktopRowEls, idx));
    }
    return { mobileRowRefByIndex: mobile, desktopRowRefByIndex: desktop };
  }, [orderItemReviewRows]);

  useLayoutEffect(() => {
    if (fitBlinkingIndices.length === 0) return;
    const targetIndex = Math.min(...fitBlinkingIndices);
    const scroll = () => {
      const desktop =
        typeof window !== "undefined" &&
        window.matchMedia("(min-width: 1024px)").matches;
      const rowEl = desktop
        ? desktopRowEls.current.get(targetIndex)
        : mobileRowEls.current.get(targetIndex);
      rowEl?.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    requestAnimationFrame(() => {
      requestAnimationFrame(scroll);
    });
  }, [fitBlinkingIndices]);

  return { mobileRowRefByIndex, desktopRowRefByIndex };
}
