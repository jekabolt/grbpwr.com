"use client";

import type { StorefrontArchiveList } from "@/api/proto-http/frontend";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";

import { ArchiveGrid } from "./archive-grid";

export interface HoverState {
  item: StorefrontArchiveList;
  rect: DOMRect;
}

export function HorizontalGrid({
  archives,
}: {
  archives: StorefrontArchiveList[];
}) {
  const { languageId } = useTranslationsStore((state) => state);

  // const [hoverState, setHoverState] = useState<HoverState | null>(null);

  return (
    <div className="blackTheme bg-bgColor text-textColor">
      <ArchiveGrid items={archives} languageId={languageId} />
    </div>
  );
}
