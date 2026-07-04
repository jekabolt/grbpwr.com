"use client";

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import type { common_HeroFullWithTranslations } from "@/api/proto-http/frontend";

import { Text } from "@/components/ui/text";
import { HeroView } from "@/app/[locale]/_components/hero-view";

import { ADMIN_ORIGINS } from "../_components/admin-origins";
import { PreviewBoundary } from "../_components/preview-boundary";

type HeroDraftMessage = {
  type: "hero-draft";
  hero: common_HeroFullWithTranslations;
  rev: number;
};

export function HeroPreviewClient({
  initialHero,
}: {
  initialHero: common_HeroFullWithTranslations | null;
}) {
  const [hero, setHero] = useState(initialHero);
  // Latest applied revision. A ref (not state) so the listener can drop stale /
  // out-of-order drafts without being torn down and re-subscribed each update.
  const revRef = useRef(-1);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (!ADMIN_ORIGINS.includes(e.origin)) return; // origin gate
      const msg = e.data as Partial<HeroDraftMessage> | null;
      if (!msg || msg.type !== "hero-draft" || !msg.hero) return;
      // Keep only the newest draft — postMessage order isn't guaranteed.
      if (typeof msg.rev === "number" && msg.rev <= revRef.current) return;
      revRef.current = typeof msg.rev === "number" ? msg.rev : revRef.current;
      setHero(msg.hero);
    }

    window.addEventListener("message", onMessage);
    // Handshake: tell the editor the bridge is mounted so it replays the current
    // draft immediately. Targeted origins only — never "*".
    for (const origin of ADMIN_ORIGINS) {
      window.parent?.postMessage({ type: "hero-preview-ready" }, origin);
    }
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Clicking a block should highlight it in the editor, not follow its explore
  // link. Running in the capture phase (before the block's own Link/onClick) and
  // calling preventDefault + stopPropagation suppresses both navigation and the
  // hero analytics event; the parent gets the block's `data-hero-block-index`.
  function onBlockClickCapture(e: ReactMouseEvent) {
    const el = (e.target as HTMLElement | null)?.closest?.(
      "[data-hero-block-index]",
    );
    if (!el) return;
    const index = Number(el.getAttribute("data-hero-block-index"));
    if (!Number.isFinite(index)) return;
    e.preventDefault();
    e.stopPropagation();
    for (const origin of ADMIN_ORIGINS) {
      window.parent?.postMessage({ type: "hero-block-click", index }, origin);
    }
  }

  if (!hero) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bgColor p-6">
        <Text variant="uppercase">waiting for editor…</Text>
      </div>
    );
  }

  return (
    <PreviewBoundary
      resetKey={hero}
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-bgColor p-6">
          <Text variant="uppercase">
            block render error — waiting for next draft…
          </Text>
        </div>
      }
    >
      {/* display:contents = layout-neutral; the capture handler intercepts block
          clicks before their Link navigates. */}
      <div style={{ display: "contents" }} onClickCapture={onBlockClickCapture}>
        <HeroView hero={hero} preview />
      </div>
    </PreviewBoundary>
  );
}
