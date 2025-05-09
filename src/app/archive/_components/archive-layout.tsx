"use client";

import { useState } from "react";
import { common_ArchiveFull } from "@/api/proto-http/frontend";

import FlexibleLayout from "@/components/flexible-layout";

import { Galery } from "./galery";

export type ViewMode = "horizontal" | "vertical";

export function ArchiveLayout({
  archives,
  total,
}: {
  archives: common_ArchiveFull[];
  total: number;
}) {
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
      className="pt-16"
    >
      <Galery
        archives={archives || []}
        total={total || 0}
        viewMode={viewMode}
      />
    </FlexibleLayout>
  );
}
