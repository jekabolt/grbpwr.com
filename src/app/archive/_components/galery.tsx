"use client";

import { useState } from "react";
import type { common_ArchiveFull } from "@/api/proto-http/frontend";

import { HorizontalGrid } from "./horizontal-grid";
import { VerticalCarousel } from "./vertical-carousel";

type ViewMode = "horizontal" | "vertical";

export function Galery({ archives }: { archives: common_ArchiveFull[] }) {
  const [viewMode, setViewMode] = useState<ViewMode>("horizontal");

  const handleChangeView = () => {
    setViewMode(viewMode === "horizontal" ? "vertical" : "horizontal");
  };

  return (
    <div className="h-screen w-full border border-red-500 pt-32">
      <div className="h-full">
        {/* <div className="absolute right-0 top-0">
          <Button onClick={handleChangeView}>change view</Button>
        </div> */}

        {viewMode === "horizontal" ? (
          <HorizontalGrid archives={archives} />
        ) : (
          <VerticalCarousel archives={archives} />
        )}
      </div>
    </div>
  );
}
