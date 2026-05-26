"use client";


import { useSyncExternalStore } from "react";

import { isVisited, normalizeHref, subscribeVisited } from "@/lib/visited-links";

export function useVisitedLink(href?: string) {
    const path = href ? normalizeHref(href) : "";

    return useSyncExternalStore(
        subscribeVisited,
        () => (path ? isVisited(path) : false),
        () => false,
    );
}
