"use client";

import { useEffect, useRef, useState } from "react";
import type { common_HeroFullWithTranslations } from "@/api/proto-http/frontend";

import { Text } from "@/components/ui/text";
import { HeroView } from "@/app/[locale]/_components/hero-view";

import { HeroPreviewBoundary } from "./hero-preview-boundary";

// Origins allowed to embed this iframe and push hero drafts into it. Keep in
// sync with the `frame-ancestors` allowlist for /preview/* in next.config.ts.
const ADMIN_ORIGINS = [
  "https://admin.grbpwr.com",
  "https://admin.beta.grbpwr.com",
  "http://localhost:4040",
];

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

  if (!hero) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bgColor p-6">
        <Text variant="uppercase">waiting for editor…</Text>
      </div>
    );
  }

  return (
    <HeroPreviewBoundary
      resetKey={hero}
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-bgColor p-6">
          <Text variant="uppercase">
            block render error — waiting for next draft…
          </Text>
        </div>
      }
    >
      <HeroView hero={hero} />
    </HeroPreviewBoundary>
  );
}
