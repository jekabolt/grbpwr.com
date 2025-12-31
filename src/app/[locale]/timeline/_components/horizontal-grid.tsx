"use client";

import { useState } from "react";
import type { common_ArchiveList } from "@/api/proto-http/frontend";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";

import { ArchiveGrid } from "./archive-grid";
import { HoverOverlay } from "./hover-overlay";

export interface HoverState {
  item: common_ArchiveList;
  rect: DOMRect;
}

export function HorizontalGrid({
  archives,
}: {
  archives: common_ArchiveList[];
}) {
  const { languageId } = useTranslationsStore((state) => state);

  const [hoverState, setHoverState] = useState<HoverState | null>(null);

  return (
    <div className="blackTheme bg-bgColor text-textColor">
      <ArchiveGrid
        items={archives}
        languageId={languageId}
        onHover={(item, rect) =>
          setHoverState({
            item,
            rect,
          })
        }
        onLeave={() => setHoverState(null)}
      />
      {hoverState && (
        <HoverOverlay
          item={hoverState.item}
          rect={hoverState.rect}
          languageId={languageId}
        />
      )}
    </div>
  );
}
