"use client";

import { useEffect } from "react";

const SCROLL_LOCK_CLASSES = "overflow-hidden lg:overflow-visible";

export function useDisableScrollUntilGroupsExpanded(allGroupsOpen: boolean) {
  useEffect(() => {
    if (!allGroupsOpen) {
      document.body.classList.add(...SCROLL_LOCK_CLASSES.split(" "));
    } else {
      document.body.classList.remove(...SCROLL_LOCK_CLASSES.split(" "));
    }
    return () => {
      document.body.classList.remove(...SCROLL_LOCK_CLASSES.split(" "));
    };
  }, [allGroupsOpen]);
}
