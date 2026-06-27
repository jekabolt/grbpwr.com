"use client";

import { common_ArchiveList } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import FlexibleLayout from "@/components/flexible-layout";
import { PageBackground } from "@/app/[locale]/_components/page-background";

import { Galery } from "./galery";

export function ArchiveLayout({
  archives,
  total,
}: {
  archives: common_ArchiveList[];
  total: number;
}) {
  const t = useTranslations("navigation");

  return (
    <>
      <PageBackground backgroundColor="#000000" splitBackground={false} />
      <FlexibleLayout
        headerType="archive"
        headerProps={{
          left: "grbpwr.com",
          center: t("timeline"),
        }}
        theme="dark"
      >
        <Galery archives={archives || []} total={total || 0} />
      </FlexibleLayout>
    </>
  );
}
