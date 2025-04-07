"use client";

import { useState } from "react";
import { common_ArchiveFull } from "@/api/proto-http/frontend";

import FlexibleLayout from "@/components/flexible-layout";

import { ViewMode } from "../page";
import { Galery } from "./galery";

interface ArchiveClientProps {
  archives: common_ArchiveFull[];
  total: number;
}

export function ArchiveClient({ archives, total }: ArchiveClientProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("horizontal");

  const handleChangeView = () => {
    setViewMode(viewMode === "horizontal" ? "vertical" : "horizontal");
  };

  return (
    <FlexibleLayout
      headerType="archive"
      headerProps={{
        left: "grbpwr.com",
        center: "archive",
        right: "change view",
        onClick: handleChangeView,
      }}
      footerType="mini"
      theme="dark"
    >
      <Galery archives={archives} viewMode={viewMode} total={total} />
    </FlexibleLayout>
  );
}
