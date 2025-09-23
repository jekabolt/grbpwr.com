"use client";

import { useState } from "react";
import { common_ArchiveList } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import FlexibleLayout from "@/components/flexible-layout";

import { Galery } from "./galery";

export type ViewMode = "horizontal" | "vertical";

export function ArchiveLayout({
  archives,
  total,
}: {
  archives: common_ArchiveList[];
  total: number;
}) {
  const [viewMode, setViewMode] = useState<ViewMode>("horizontal");
  const t = useTranslations("navigation");

  const handleChangeView = () => {
    setViewMode(viewMode === "horizontal" ? "vertical" : "horizontal");
  };

  return (
    <FlexibleLayout
      headerType="archive"
      headerProps={{
        left: "grbpwr.com",
        center: t("timeline"),
        // right: "change view",
        // onClick: handleChangeView,
      }}
      theme="dark"
    >
      <Galery
        archives={archives || []}
        total={total || 0}
        viewMode={viewMode}
      />
    </FlexibleLayout>
  );
}
