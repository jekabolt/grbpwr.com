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

// Live preview of a single archive (timeline) entry the admin is editing. Mirrors
// the hero preview: an origin-gated postMessage bridge receives `timeline-draft`
// messages ({ archive, rev }) and renders them inside the real archive page
// layout, so the editor sees exactly how the entry will look. See hero preview
// for the protocol rationale (ready handshake, stale-rev drop, error boundary).
type ArchiveDraftMessage = {
  type: "timeline-draft";
  archive: common_ArchiveFull;
  rev: number;
};

export function TimelinePreviewClient() {
  const t = useTranslations("navigation");
  const [archive, setArchive] = useState<common_ArchiveFull | null>(null);
  // Latest applied revision — a ref so the listener drops stale/out-of-order
  // drafts without being torn down and re-subscribed each update.
  const revRef = useRef(-1);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (!ADMIN_ORIGINS.includes(e.origin)) return; // origin gate
      const msg = e.data as Partial<ArchiveDraftMessage> | null;
      if (!msg || msg.type !== "timeline-draft" || !msg.archive) return;
      if (typeof msg.rev === "number" && msg.rev <= revRef.current) return;
      revRef.current = typeof msg.rev === "number" ? msg.rev : revRef.current;
      setArchive(msg.archive);
    }

    window.addEventListener("message", onMessage);
    // Handshake: tell the editor the bridge is mounted so it replays the current
    // draft immediately. Targeted origins only — never "*".
    for (const origin of ADMIN_ORIGINS) {
      window.parent?.postMessage({ type: "timeline-preview-ready" }, origin);
    }
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Keep the preview pinned: a stray click on an internal link would navigate the
  // iframe away from the canvas. Cancel navigation for anchors only (in the
  // capture phase) so interactive controls keep working.
  function onLinkClickCapture(e: ReactMouseEvent) {
    if ((e.target as HTMLElement | null)?.closest?.("a[href]")) {
      e.preventDefault();
    }
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
      <div style={{ display: "contents" }} onClickCapture={onLinkClickCapture}>
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
