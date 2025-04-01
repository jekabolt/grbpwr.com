"use client";

import { useState } from "react";
import type { common_ArchiveFull } from "@/api/proto-http/frontend";

import { Button } from "@/components/ui/button";

import { HorizontalGrid } from "./horizontal-grid";
import { VerticalCarousel } from "./vertical-carousel";

type ViewMode = "horizontal" | "vertical";

export function Galery({ archives }: { archives: common_ArchiveFull[] }) {
  const [viewMode, setViewMode] = useState<ViewMode>("horizontal");

  const handleChangeView = () => {
    setViewMode(viewMode === "horizontal" ? "vertical" : "horizontal");
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex justify-center gap-4">
        <Button onClick={handleChangeView}>change view</Button>
      </div>

      {viewMode === "horizontal" ? (
        <HorizontalGrid archives={archives} />
      ) : (
        <VerticalCarousel archives={archives} />
      )}
    </div>
  );
}
