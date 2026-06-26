"use client";

import type { common_ArchiveList } from "@/api/proto-http/frontend";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";

import { ArchiveGrid } from "./archive-grid";

export interface HoverState {
  item: common_ArchiveList;
  rect: DOMRect;
}

export function HorizontalGrid({
  archives,
  isFetchingNextPage,
}: {
  archives: common_ArchiveList[];
  isFetchingNextPage?: boolean;
}) {
  const { languageId } = useTranslationsStore((state) => state);

  // const [hoverState, setHoverState] = useState<HoverState | null>(null);

  return (
    <div className="blackTheme bg-bgColor text-textColor">
      <ArchiveGrid
        items={archives}
        languageId={languageId}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
}
