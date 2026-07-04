"use client";

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import type { common_ArchiveFull } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import FlexibleLayout from "@/components/flexible-layout";
import { Text } from "@/components/ui/text";
import { PageBackground } from "@/app/[locale]/_components/page-background";
import PageComponent from "@/app/[locale]/timeline/[...archiveParams]/_components/page-component";

import { ADMIN_ORIGINS } from "../_components/admin-origins";
import { PreviewBoundary } from "../_components/preview-boundary";

// Live preview of a single archive (timeline) entry the admin is editing. The
// postMessage bridge intentionally mirrors the hero preview one-to-one — same
// three message types, same ready handshake, same stale-rev drop, same
// block-click channel — so the admin speaks one protocol for both:
//   admin  → storefront : { type: "archive-draft", archive, rev }
//   storefront → admin   : { type: "archive-preview-ready" }
//                          { type: "archive-block-click", index }   // items[] index
type ArchiveDraftMessage = {
  type: "archive-draft";
  archive: common_ArchiveFull;
  rev: number;
};

export function ArchivePreviewClient({
  initialArchive,
}: {
  initialArchive: common_ArchiveFull | null;
}) {
  const t = useTranslations("navigation");
  const [archive, setArchive] = useState(initialArchive);
  // Latest applied revision — a ref so the listener drops stale/out-of-order
  // drafts without being torn down and re-subscribed each update.
  const revRef = useRef(-1);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (!ADMIN_ORIGINS.includes(e.origin)) return; // origin gate
      const msg = e.data as Partial<ArchiveDraftMessage> | null;
      if (!msg || msg.type !== "archive-draft" || !msg.archive) return;
      // Keep only the newest draft — postMessage order isn't guaranteed.
      if (typeof msg.rev === "number" && msg.rev <= revRef.current) return;
      revRef.current = typeof msg.rev === "number" ? msg.rev : revRef.current;
      setArchive(msg.archive);
    }

    window.addEventListener("message", onMessage);
    // Handshake: tell the editor the bridge is mounted so it replays the current
    // draft immediately. Targeted origins only — never "*".
    for (const origin of ADMIN_ORIGINS) {
      window.parent?.postMessage({ type: "archive-preview-ready" }, origin);
    }
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Clicking a block should select it in the editor, not follow its link.
  // Running in the capture phase (before a product card / embed CTA navigates)
  // and calling preventDefault + stopPropagation suppresses navigation; the
  // parent gets the block's `data-archive-block-index` (its items[] position).
  function onBlockClickCapture(e: ReactMouseEvent) {
    const target = e.target as HTMLElement | null;
    const el = target?.closest?.("[data-archive-block-index]");
    if (el) {
      const index = Number(el.getAttribute("data-archive-block-index"));
      if (Number.isFinite(index)) {
        e.preventDefault();
        e.stopPropagation();
        for (const origin of ADMIN_ORIGINS) {
          window.parent?.postMessage(
            { type: "archive-block-click", index },
            origin,
          );
        }
        return;
      }
    }
    // Not a body block — still pin the canvas: cancel stray anchor navigation.
    // Unlike the bare hero preview, the archive preview renders full page chrome
    // (FlexibleLayout header + footer with links), so without this a click on a
    // header/footer link would navigate the iframe off the draft.
    if (target?.closest?.("a[href]")) e.preventDefault();
  }

  if (!archive) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bgColor p-6">
        <Text variant="uppercase">waiting for editor…</Text>
      </div>
    );
  }

  return (
    <PreviewBoundary
      resetKey={archive}
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-bgColor p-6">
          <Text variant="uppercase">
            render error — waiting for next draft…
          </Text>
        </div>
      }
    >
      {/* The capture handler intercepts block clicks before their Link navigates
          and reports the tapped block's index to the editor. */}
      <div style={{ display: "contents" }} onClickCapture={onBlockClickCapture}>
        <PageBackground backgroundColor="#000000" splitBackground={false} />
        <FlexibleLayout
          headerType="archive"
          headerProps={{ left: "grbpwr.com", center: t("timeline") }}
          theme="dark"
        >
          <div className="space-y-20 px-2.5 pt-20 lg:space-y-10 lg:px-7">
            <PageComponent archive={archive} />
          </div>
        </FlexibleLayout>
      </div>
    </PreviewBoundary>
  );
}
